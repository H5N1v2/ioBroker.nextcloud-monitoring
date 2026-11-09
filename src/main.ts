import * as utils from '@iobroker/adapter-core';
import { NextcloudApiClient } from './lib/nextcloudApi';
import { resolveServerToken } from './lib/serverToken';
import { words } from './lib/words';
import type { WidgetConfig } from './lib/widgetGenerator';
import { WidgetGenerator } from './lib/widgetGenerator';

/**
 * Interface für die Definition eines einzelnen Servers aus der Admin-Tabelle.
 */
interface NextcloudServer {
	name: string;
	domain: string;
	token: string;
	createWidget: boolean;
	widgetFontSize: number;
	widgetDarkMode: boolean;
}

/**
 * Interface für die Adapter-Konfiguration.
 */
interface AdapterConfig extends ioBroker.AdapterConfig {
	servers: NextcloudServer[];
	skipApps: boolean;
	skipUpdate: boolean;
	interval: number;
}

class NextcloudMonitoring extends utils.Adapter {
	private updateInterval: ioBroker.Interval | undefined;
	private createdStates: Set<string> = new Set();
	private systemLanguage: string = 'en';
	private readonly widgetGenerator: WidgetGenerator = new WidgetGenerator();

	public constructor(options: Partial<utils.AdapterOptions> = {}) {
		super({ ...options, name: 'nextcloud-monitoring' });
		this.on('ready', this.onReady.bind(this));
		this.on('unload', this.onUnload.bind(this));
	}

	/**
	 * Initialisiert den Adapter und startet die Abfragen für alle konfigurierten Server.
	 */
	private async onReady(): Promise<void> {
		const config = this.config as AdapterConfig;
		const servers = config.servers || [];
		let configChanged = false;

		for (const server of servers) {
			// Prüfe 'createWidget' (Default: false)
			if (server.createWidget === undefined) {
				server.createWidget = false;
				configChanged = true;
			}
			// Prüfe 'widgetFontSize' (Default: 12)
			if (server.widgetFontSize === undefined) {
				server.widgetFontSize = 12;
				configChanged = true;
			}
			// Prüfe 'widgetDarkMode' (Default: false)
			if (server.widgetDarkMode === undefined) {
				server.widgetDarkMode = false;
				configChanged = true;
			}
		}

		// OCS-Tokens aus Altbeständen (Klartext) erkennen und verschlüsselt zurückschreiben
		const repairedTokens = await this.repairPlainTextTokens(servers);

		if (configChanged || repairedTokens > 0) {
			if (configChanged) {
				this.log.info('Old configuration detected: Default values for widget settings have been added.');
			}
			if (repairedTokens > 0) {
				this.log.info(`Configuration updated: ${repairedTokens} OCS token(s) are now stored encrypted.`);
			}
			// updateConfig verschlüsselt die Token; ein direktes Schreiben von native würde sie im Klartext ablegen
			await this.writeServersConfig(servers);

			if (configChanged) {
				return;
			}
		}
		this.log.debug('onReady: starting initialization');

		if (!config.servers || !Array.isArray(config.servers) || config.servers.length === 0) {
			this.log.error('Configuration incomplete: No servers found in the table!');
			return;
		}
		try {
			const sysConfig = await this.getForeignObjectAsync('system.config');
			this.systemLanguage = (sysConfig?.common as any)?.language || 'en';
		} catch {
			this.systemLanguage = 'en';
		}
		await this.extendForeignObjectAsync(this.namespace, {
			type: 'meta',
			common: {
				name: {
					en: 'Nextcloud Monitoring Service',
					de: 'Nextcloud-Überwachungsdienst',
					ru: 'Служба мониторинга Nextcloud',
					pt: 'Serviço de monitoramento do Nextcloud',
					nl: 'Nextcloud-monitoringservice',
					fr: 'Service de surveillance Nextcloud',
					it: 'Servizio di monitoraggio Nextcloud',
					es: 'Servicio de monitoreo de Nextcloud',
					pl: 'Usługa monitorowania Nextcloud',
					uk: 'Сервіс моніторингу Nextcloud',
					'zh-cn': 'Nextcloud 监控服务',
				},
			},
		});

		// Erstmaliger Aufruf beim Start
		await this.updateAllServers();

		// Intervall einrichten (Standard 10 Min, falls nicht gesetzt)
		const minutes = config.interval || 10;
		const intervalMs = minutes * 60 * 1000;

		this.updateInterval = this.setInterval(async () => {
			await this.updateAllServers();
		}, intervalMs);
		this.log.debug(`onReady: scheduled updates every ${minutes} minutes`);
	}

	/**
	 * Erkennt OCS-Tokens, die noch unverschlüsselt im Instanzobjekt liegen.
	 *
	 * Die in `encryptedNative` genannten Attribute (`servers.token`) entschlüsselt ioBroker beim
	 * Adapterstart. Wurde ein Token vor der Aktivierung der Verschlüsselung gespeichert - oder von
	 * einer Admin-Version ohne Unterstützung für verschachtelte Tabellenattribute - liefert diese
	 * Entschlüsselung keinen brauchbaren Wert. Der Klartext wird dann direkt aus dem Instanzobjekt
	 * gelesen und für den laufenden Betrieb verwendet. Bereits verschlüsselte Werte bleiben unberührt.
	 *
	 * @param servers Serverliste aus der Adapterkonfiguration, wird in-place aktualisiert
	 * @returns Anzahl der Tokens, die verschlüsselt werden müssen
	 */
	private async repairPlainTextTokens(servers: NextcloudServer[]): Promise<number> {
		if (servers.length === 0) {
			return 0;
		}

		let storedServers: unknown;
		try {
			const instanceObject = await this.getForeignObjectAsync(`system.adapter.${this.namespace}`);
			const native = instanceObject?.native as Record<string, unknown> | undefined;
			storedServers = native?.servers;
		} catch (error) {
			this.log.debug(`Could not read the own instance object: ${String(error)}`);
			return 0;
		}

		if (!Array.isArray(storedServers)) {
			return 0;
		}

		let repaired = 0;
		for (let i = 0; i < servers.length; i++) {
			const stored = storedServers[i] as { token?: unknown } | undefined;
			const resolution = resolveServerToken(servers[i].token, stored?.token);
			if (!resolution.needsEncryption) {
				continue;
			}
			servers[i].token = resolution.token;
			repaired++;
		}

		return repaired;
	}

	/**
	 * Schreibt die Serverliste zurück in das Instanzobjekt.
	 *
	 * `updateConfig` verschlüsselt die in `encryptedNative` genannten Attribute (`servers.token`)
	 * vor dem Speichern und führt bestehende Konfigurationswerte zusammen. Ein direktes Schreiben
	 * von `native` würde die Token im Klartext ablegen.
	 *
	 * @param servers Serverliste mit Klartext-Tokens
	 */
	private async writeServersConfig(servers: NextcloudServer[]): Promise<void> {
		try {
			await this.updateConfig({ servers });
		} catch (error) {
			// Kein Abbruch: die Tokens werden beim nächsten Start erneut geprüft
			this.log.error(
				`Could not store the server configuration: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}

	/**
	 * Iteriert über alle Server in der Liste und führt die API-Abfrage aus.
	 */
	private async updateAllServers(): Promise<void> {
		const config = this.config as AdapterConfig;
		this.log.debug('updateAllServers: starting update for all servers');

		for (const server of config.servers) {
			if (!server.domain || !server.token) {
				this.log.warn(`Server "${server.name || 'Unknown'}" skipped: Domain or token is missing.`);
				continue;
			}
			this.log.debug(`updateAllServers: processing server ${server.name || server.domain}`);

			// Erzeuge eine saubere ID für den ioBroker Objektbaum
			const cleanId = (server.name || server.domain).replace(this.FORBIDDEN_CHARS, '_').replace(/\s|\./g, '_');

			this.log.info(`Query running for: ${server.name} (${server.domain})`);

			const apiClient = new NextcloudApiClient(
				server.domain,
				server.token.trim(),
				config.skipApps,
				config.skipUpdate,
			);
			await this.setObjectNotExistsAsync(cleanId, {
				type: 'device',
				common: {
					name: server.name || server.domain,
				},
				native: {},
			});

			await this.updateNextcloudData(cleanId, apiClient, server);
			this.log.debug(`updateAllServers: finished processing ${cleanId}`);
		}
		this.log.debug('updateAllServers: completed all servers');
	}

	/**
	 * Hauptfunktion zum Abrufen und Verarbeiten aller Datenpunkte eines spezifischen Servers.
	 *
	 * @param serverId ID of the server used as the root folder in the object tree
	 * @param apiClient Instance of the NextcloudApiClient for this specific server
	 * @param server Server configuration object, used for widget settings and logging
	 */
	private async updateNextcloudData(
		serverId: string,
		apiClient: NextcloudApiClient,
		server: NextcloudServer,
	): Promise<void> {
		try {
			this.log.debug(`updateNextcloudData: fetching data for ${serverId}`);
			const response = await apiClient.fetchData();
			const config = this.config as AdapterConfig;

			let channels = [
				{
					id: 'activeUsers',
					name: {
						en: 'Active users',
						de: 'Aktive Benutzer',
						pl: 'Aktywni użytkownicy',
						ru: 'Активные пользователи',
						it: 'Utenti attivi',
						es: 'Usuarios activos',
						'zh-cn': '活跃用户',
						fr: 'Utilisateurs actifs',
						pt: 'Usuários ativos',
						nl: 'Actieve gebruikers',
						uk: 'Активні користувачи',
					},
				},
				{
					id: 'apps',
					name: {
						en: 'Applications',
						de: 'Anwendungen',
						pl: 'Aplikacje',
						ru: 'Приложения',
						it: 'Applicazioni',
						es: 'Aplicaciones',
						'zh-cn': '应用程序',
						fr: 'Applications',
						pt: 'Aplicativos',
						nl: 'Applicaties',
						uk: 'Програми',
					},
				},
				{
					id: 'server',
					name: {
						en: 'Server',
						de: 'Server',
						pl: 'Serwer',
						ru: 'Сервер',
						it: 'Server',
						es: 'Servidor',
						'zh-cn': '服务器',
						fr: 'Serveur',
						pt: 'Servidor',
						nl: 'Server',
						uk: 'Сервер',
					},
				},
				{
					id: 'server.database',
					name: {
						en: 'Database',
						de: 'Datenbank',
						pl: 'Baza danych',
						ru: 'База данных',
						it: 'Database',
						es: 'Base de datos',
						'zh-cn': '数据库',
						fr: 'Base de données',
						pt: 'Banco de dados',
						nl: 'Database',
						uk: 'База даних',
					},
				},
				{
					id: 'server.fpm',
					name: {
						en: 'PHP-FPM',
						de: 'PHP-FPM',
						pl: 'PHP-FPM',
						ru: 'PHP-FPM',
						it: 'PHP-FPM',
						es: 'PHP-FPM',
						'zh-cn': 'PHP-FPM',
						fr: 'PHP-FPM',
						pt: 'PHP-FPM',
						nl: 'PHP-FPM',
						uk: 'PHP-FPM',
					},
				},
				{
					id: 'server.php',
					name: {
						en: 'PHP Settings',
						de: 'PHP-Einstellungen',
						pl: 'Ustawienia PHP',
						ru: 'Настройки PHP',
						it: 'Impostazioni PHP',
						es: 'Ajustes de PHP',
						'zh-cn': 'PHP 设置',
						fr: 'Paramètres PHP',
						pt: 'Configurações do PHP',
						nl: 'PHP-instellingen',
						uk: 'Налаштування PHP',
					},
				},
				{
					id: 'server.php.apcu',
					name: {
						en: 'PHP APCu Cache',
						de: 'PHP APCu Cache',
						pl: 'Pamięć podręczna PHP APCu',
						ru: 'Кэш PHP APCu',
						it: 'Cache PHP APCu',
						es: 'Caché PHP APCu',
						'zh-cn': 'PHP APCu 缓存',
						fr: 'Cache PHP APCu',
						pt: 'Cache APCu do PHP',
						nl: 'PHP APCu-cache',
						uk: 'Кеш PHP APCu',
					},
				},
				{
					id: 'server.php.opcache',
					name: {
						en: 'PHP OPcache',
						de: 'PHP OPcache',
						pl: 'PHP OPcache',
						ru: 'PHP OPcache',
						it: 'PHP OPcache',
						es: 'PHP OPcache',
						'zh-cn': 'PHP OPcache',
						fr: 'PHP OPcache',
						pt: 'PHP OPcache',
						nl: 'PHP OPcache',
						uk: 'PHP OPcache',
					},
				},
				{
					id: 'shares',
					name: {
						en: 'Shares',
						de: 'Freigaben',
						pl: 'Udziały',
						ru: 'Общие ресурсы',
						it: 'Condivisioni',
						es: 'Recursos compartidos',
						'zh-cn': '共享',
						fr: 'Partages',
						pt: 'Compartilhamentos',
						nl: 'Gedeelde mappen',
						uk: 'Спільні ресурси',
					},
				},
				{
					id: 'storage',
					name: {
						en: 'Storage',
						de: 'Speicher',
						pl: 'Magazyn danych',
						ru: 'Хранилище',
						it: 'Archiviazione',
						es: 'Almacenamiento',
						'zh-cn': '存储',
						fr: 'Stockage',
						pt: 'Armazenamento',
						nl: 'Opslag',
						uk: 'Сховище',
					},
				},
				{
					id: 'system',
					name: {
						en: 'System',
						de: 'System',
						pl: 'System',
						ru: 'Система',
						it: 'Sistema',
						es: 'Sistema',
						'zh-cn': '系统',
						fr: 'Système',
						pt: 'Sistema',
						nl: 'Systeem',
						uk: 'Система',
					},
				},
			];

			if (config.skipApps) {
				this.log.debug(`Filtering out App details for ${serverId}`);
			}

			if (config.skipUpdate) {
				this.log.debug(`Filtering out Update details for ${serverId}`);
			}

			if (config.skipApps && config.skipUpdate) {
				this.log.debug(`Skipping entire Apps channel`);
				channels = channels.filter(chan => !chan.id.startsWith('apps'));
			}

			// Eltern-Channels vor Kind-Channels erstellen (alphabetische Sortierung garantiert das,
			// da z. B. "server" immer vor "server.database" einsortiert wird).
			const sortedChannels = [...channels].sort((a, b) => a.id.localeCompare(b.id));

			for (const chan of sortedChannels) {
				const channelId = `${serverId}.${chan.id}`;
				if (!this.createdStates.has(channelId)) {
					await this.setObjectNotExistsAsync(channelId, {
						type: 'channel',
						common: {
							name: chan.name,
							role: 'info',
						},
						native: {},
					});
					this.createdStates.add(channelId);
				}
			}

			if (!response?.ocs?.data) {
				this.log.warn(`Unexpected API response from Nextcloud (${serverId})`);
				return;
			}

			const data = response.ocs.data;
			const nc = data.nextcloud;
			this.log.debug(`updateNextcloudData: received data keys for ${serverId}: ${Object.keys(data).join(', ')}`);

			// --- 1. SYSTEM & HARDWARE ---
			if (nc?.system) {
				const sys = nc.system;
				await this.setAndCreateState(
					`${serverId}.system.current_version`,
					'Current Version',
					sys.version,
					'string',
					'info.firmware',
				);
				await this.setAndCreateState(
					`${serverId}.system.cpuload_1`,
					'CPU Load 1min',
					sys.cpuload[0],
					'number',
					'value',
				);
				await this.setAndCreateState(
					`${serverId}.system.cpuload_5`,
					'CPU Load 5min',
					sys.cpuload[1],
					'number',
					'value',
				);
				await this.setAndCreateState(
					`${serverId}.system.cpuload_15`,
					'CPU Load 15min',
					sys.cpuload[2],
					'number',
					'value',
				);
				await this.setAndCreateState(`${serverId}.system.cpunum`, 'CPU Cores', sys.cpunum, 'number', 'value');
				const memTotal = this.parseStorageValue(sys.mem_total, true);
				await this.setAndCreateState(
					`${serverId}.system.mem_total`,
					'RAM Total',
					memTotal.value,
					'number',
					'value.storage',
					memTotal.unit,
				);
				const memFree = this.parseStorageValue(sys.mem_free, true);
				await this.setAndCreateState(
					`${serverId}.system.mem_free`,
					'RAM Free',
					memFree.value,
					'number',
					'value.storage',
					memFree.unit,
				);
				const swapTotal = this.parseStorageValue(sys.swap_total, true);
				await this.setAndCreateState(
					`${serverId}.system.swap_total`,
					'Swap Total',
					swapTotal.value,
					'number',
					'value.storage',
					swapTotal.unit,
				);
				const freespace = this.parseStorageValue(sys.freespace);
				await this.setAndCreateState(
					`${serverId}.system.freespace`,
					'Free Disk Space',
					freespace.value,
					'number',
					'value.storage',
					freespace.unit,
				);
				await this.setAndCreateState(
					`${serverId}.system.memcache_local`,
					'Memcache Local',
					sys['memcache.local'],
					'string',
					'text',
				);
				await this.setAndCreateState(
					`${serverId}.system.memcache_locking`,
					'Memcache Locking',
					sys['memcache.locking'],
					'string',
					'text',
				);

				if (sys.apps) {
					await this.setAndCreateState(
						`${serverId}.apps.num_installed`,
						'Installed Apps',
						sys.apps.num_installed,
						'number',
						'value',
					);
					await this.setAndCreateState(
						`${serverId}.apps.updates_available`,
						'App Updates available',
						sys.apps.num_updates_available,
						'number',
						'value',
					);

					if (sys.apps.app_updates && typeof sys.apps.app_updates === 'object') {
						const updateList = Object.entries(sys.apps.app_updates as Record<string, any>)
							.map(([appName, version]) => `${String(appName)} = "${String(version)}"`)
							.join(' & ');

						await this.setAndCreateState(
							`${serverId}.apps.new_updates_for_apps`,
							'New Updates for apps',
							updateList || 'none',
							'string',
							'text',
						);
					}
				}

				if (sys.update) {
					await this.setAndCreateState(
						`${serverId}.apps.update_available`,
						'System Update available',
						sys.update.available,
						'boolean',
						'indicator',
					);
					await this.setAndCreateState(
						`${serverId}.apps.last_update_check`,
						'Last Update Check',
						new Date(sys.update.lastupdatedat * 1000).toLocaleString(),
						'string',
						'value.datetime',
					);
					await this.setAndCreateState(
						`${serverId}.apps.available_new_version`,
						'Available New Version',
						sys.update.available_version ?? '0',
						'string',
						'info.firmware',
					);
				}
			}

			// --- 2. STORAGE & USERS ---
			if (nc?.storage) {
				const st = nc.storage;
				await this.setAndCreateState(
					`${serverId}.storage.num_users`,
					'Total Users',
					st.num_users,
					'number',
					'value',
				);
				await this.setAndCreateState(
					`${serverId}.storage.num_files`,
					'Total Files',
					st.num_files,
					'number',
					'value',
				);
				await this.setAndCreateState(
					`${serverId}.storage.num_storages`,
					'Total Storages',
					st.num_storages,
					'number',
					'value',
				);
				await this.setAndCreateState(
					`${serverId}.storage.num_files_appdata`,
					'Appdata Files',
					st.num_files_appdata,
					'number',
					'value',
				);
				await this.setAndCreateState(
					`${serverId}.storage.num_disabled_users`,
					'Num Disabled Users',
					st.num_disabled_users,
					'number',
					'value',
				);
			}

			// --- 3. SHARES (FREIGABEN) ---
			if (nc?.shares) {
				const sh = nc.shares;
				await this.setAndCreateState(
					`${serverId}.shares.num_shares`,
					'Total Shares',
					sh.num_shares,
					'number',
					'value',
				);
				await this.setAndCreateState(
					`${serverId}.shares.num_shares_link`,
					'Link Shares',
					sh.num_shares_link,
					'number',
					'value',
				);
				await this.setAndCreateState(
					`${serverId}.shares.num_shares_room`,
					'Talk Rooms',
					sh.num_shares_room,
					'number',
					'value',
				);
				await this.setAndCreateState(
					`${serverId}.shares.num_fed_shares_sent`,
					'Federated Sent',
					sh.num_fed_shares_sent,
					'number',
					'value',
				);
			}

			// --- 4. SERVER, PHP, OPCACHE, APCU & FPM & DATABASE ---
			if (data.server) {
				const srv = data.server;
				await this.setAndCreateState(
					`${serverId}.server.webserver`,
					'Webserver Type',
					srv.webserver,
					'string',
					'text',
				);

				if (srv.php) {
					await this.setAndCreateState(
						`${serverId}.server.php.version`,
						'PHP Version',
						srv.php.version,
						'string',
						'info.firmware',
					);
					const phpMemLimit = this.parseStorageValue(srv.php.memory_limit);
					await this.setAndCreateState(
						`${serverId}.server.php.memory_limit`,
						'PHP Memory Limit',
						phpMemLimit.value,
						'number',
						'value.storage',
						phpMemLimit.unit,
					);
					const phpUploadMax = this.parseStorageValue(srv.php.upload_max_filesize);
					await this.setAndCreateState(
						`${serverId}.server.php.upload_max`,
						'Max Upload Size',
						phpUploadMax.value,
						'number',
						'value.storage',
						phpUploadMax.unit,
					);

					const opcache = srv.php.opcache || srv.opcache;
					if (opcache) {
						const stats = opcache.opcache_statistics;
						const mem = opcache.memory_usage;
						if (stats) {
							const hitRateRaw = Number(stats.opcache_hit_rate);
							const hitRate = Number.isFinite(hitRateRaw) ? Math.round(hitRateRaw * 100) / 100 : 0;
							await this.setAndCreateState(
								`${serverId}.server.php.opcache.hit_rate`,
								'Opcache Hit Rate',
								hitRate,
								'number',
								'value',
								'%',
							);
						}
						if (mem) {
							const opcacheUsedMem = this.parseStorageValue(mem.used_memory || 0);
							await this.setAndCreateState(
								`${serverId}.server.php.opcache.used_mem`,
								'Opcache RAM used',
								opcacheUsedMem.value,
								'number',
								'value.storage',
								opcacheUsedMem.unit,
							);
						}
					}

					const apcu = srv.php.apcu || srv.apcu;
					if (apcu?.cache) {
						await this.setAndCreateState(
							`${serverId}.server.php.apcu.entries`,
							'APCu Entries',
							apcu.cache.num_entries,
							'number',
							'value',
						);
						const apcuMemSize = this.parseStorageValue(apcu.cache.mem_size);
						await this.setAndCreateState(
							`${serverId}.server.php.apcu.mem_size`,
							'APCu Cache Size',
							apcuMemSize.value,
							'number',
							'value.storage',
							apcuMemSize.unit,
						);
						await this.setAndCreateState(
							`${serverId}.server.php.apcu.hits`,
							'APCu Hits',
							apcu.cache.num_hits,
							'number',
							'value',
						);
					}
				}

				if (srv.fpm) {
					const fpm = srv.fpm;
					await this.setAndCreateState(
						`${serverId}.server.fpm.active_processes`,
						'FPM Active Processes',
						fpm['active-processes'],
						'number',
						'value',
					);
					await this.setAndCreateState(
						`${serverId}.server.fpm.total_processes`,
						'FPM Total Processes',
						fpm['total-processes'],
						'number',
						'value',
					);
					await this.setAndCreateState(
						`${serverId}.server.fpm.idle_processes`,
						'FPM Idle Processes',
						fpm['idle-processes'],
						'number',
						'value',
					);
					await this.setAndCreateState(
						`${serverId}.server.fpm.accepted_conn`,
						'FPM Accepted Conn',
						fpm['accepted-conn'],
						'number',
						'value',
					);
					await this.setAndCreateState(
						`${serverId}.server.fpm.max_active`,
						'FPM Max Active',
						fpm['max-active-processes'],
						'number',
						'value',
					);
				}

				if (srv.database) {
					await this.setAndCreateState(
						`${serverId}.server.database.type`,
						'DB Type',
						srv.database.type,
						'string',
						'text',
					);
					await this.setAndCreateState(
						`${serverId}.server.database.version`,
						'DB Version',
						srv.database.version,
						'string',
						'info.firmware',
					);
					const dbSizeMB = Math.round((srv.database.size / 1024 / 1024) * 100) / 100;
					await this.setAndCreateState(
						`${serverId}.server.database.size`,
						'DB Size',
						dbSizeMB,
						'number',
						'value.storage',
						'MB',
					);
				}
			}

			// --- 5. AKTIVE NUTZER ---
			if (data.activeUsers) {
				const au = data.activeUsers;
				await this.setAndCreateState(
					`${serverId}.activeUsers.last5min`,
					'Active Users (5 min)',
					au.last5minutes,
					'number',
					'value',
				);
				await this.setAndCreateState(
					`${serverId}.activeUsers.last1h`,
					'Active Users (1 h)',
					au.last1hour,
					'number',
					'value',
				);
				await this.setAndCreateState(
					`${serverId}.activeUsers.last24h`,
					'Active Users (24 h)',
					au.last24hours,
					'number',
					'value',
				);
				await this.setAndCreateState(
					`${serverId}.activeUsers.last1month`,
					'Active Users (1 month)',
					au.last1month,
					'number',
					'value',
				);
				await this.setAndCreateState(
					`${serverId}.activeUsers.last3month`,
					'Active Users (3 month)',
					au.last3months,
					'number',
					'value',
				);
				await this.setAndCreateState(
					`${serverId}.activeUsers.last6month`,
					'Active Users (6 month)',
					au.last6months,
					'number',
					'value',
				);
				await this.setAndCreateState(
					`${serverId}.activeUsers.lastyear`,
					'Active Users (Last Year)',
					au.lastyear,
					'number',
					'value',
				);
			}

			// --- 6. HTML WIDGET ---
			const widgetId = `${serverId}.htmlWidget`;
			if (server.createWidget) {
				const widgetConfig: WidgetConfig = {
					fontSize: server.widgetFontSize || 12,
					darkMode: !!server.widgetDarkMode,
					serverName: server.name || server.domain,
					language: this.systemLanguage,
				};
				const html = this.widgetGenerator.generateHtml(data, widgetConfig);
				if (!this.createdStates.has(widgetId)) {
					await this.setObjectNotExistsAsync(widgetId, {
						type: 'state',
						common: {
							name: {
								en: 'HTML Widget',
								de: 'HTML Widget',
								fr: 'Widget HTML',
								it: 'Widget HTML',
								es: 'Widget HTML',
								pl: 'Widget HTML',
								pt: 'Widget HTML',
								nl: 'HTML Widget',
								ru: 'HTML виджет',
								uk: 'HTML віджет',
								'zh-cn': 'HTML 组件',
							},
							type: 'string',
							role: 'html',
							read: true,
							write: false,
						},
						native: {},
					});
					this.createdStates.add(widgetId);
				}
				await this.setState(widgetId, { val: html, ack: true });
				this.log.debug(`updateNextcloudData: HTML widget written for ${serverId}`);
			} else {
				if (this.createdStates.has(widgetId)) {
					await this.delObjectAsync(widgetId);
					this.createdStates.delete(widgetId);
					this.log.debug(`updateNextcloudData: Removed htmlWidget (cache hit) for ${serverId}`);
				} else {
					const obj = await this.getObjectAsync(widgetId);
					if (obj) {
						await this.delObjectAsync(widgetId);
						this.log.debug(`updateNextcloudData: Removed pre-existing htmlWidget for ${serverId}`);
					}
				}
			}

			this.log.debug(`Monitoring (${serverId}): All data updated successfully.`);
		} catch (error: any) {
			if (error.response && error.response.status === 503) {
				this.log.info(`Nextcloud (${serverId}) is in maintenance mode.`);
			} else {
				this.log.error(`Error on server "${serverId}": ${error.message}`);
			}
			this.log.debug(`updateNextcloudData error for ${serverId}: ${error.stack || error}`);
		}
	}

	private async setAndCreateState(
		id: string,
		nameKey: string,
		value: unknown,
		type: ioBroker.CommonType,
		role: string,
		unit?: string,
	): Promise<void> {
		const translatedName = words[nameKey] || nameKey;
		this.log.debug(`setAndCreateState: ${id} value=${String(value)}`);

		// Objekt nur beim ersten Aufruf nach dem Adapterstart prüfen/erstellen
		if (!this.createdStates.has(id)) {
			const existing = await this.getObjectAsync(id);

			if (!existing) {
				await this.setObjectNotExistsAsync(id, {
					type: 'state',
					common: {
						name: translatedName,
						type,
						role,
						read: true,
						write: false,
						...(unit !== undefined ? { unit } : {}),
					},
					native: {},
				});
			} else if (existing.type === 'state') {
				// Migration für Bestandsinstallationen: falscher Typ oder falsche Rolle wird automatisch korrigiert
				const existingCommon = existing.common as ioBroker.StateCommon;
				if (existingCommon.type !== type || existingCommon.role !== role) {
					this.log.info(
						`Object ${id} migrated: type "${String(existingCommon.type)}" -> "${type}", role "${String(existingCommon.role)}" -> "${role}"`,
					);
					await this.extendObject(id, { common: { type, role } });
				}
			}
			this.createdStates.add(id);
		}

		await this.setState(id, { val: this.normalizeStateValue(value, type), ack: true });
	}

	/**
	 * Wandelt einen Rohwert in den für den Datenpunkt-Typ passenden Wert um.
	 * Ungültige oder fehlende Werte werden als null geschrieben.
	 *
	 * @param value Raw value to be written
	 * @param type Target data type of the state
	 */
	private normalizeStateValue(value: unknown, type: ioBroker.CommonType): ioBroker.StateValue {
		if (value === null || value === undefined) {
			return null;
		}

		if (type === 'number') {
			if (typeof value === 'number') {
				return Number.isFinite(value) ? value : null;
			}
			if (typeof value === 'string' && value.trim() !== '') {
				const parsed = Number(value.trim().replace(',', '.'));
				return Number.isFinite(parsed) ? parsed : null;
			}
			return null;
		}

		if (type === 'boolean') {
			if (typeof value === 'boolean') {
				return value;
			}
			if (typeof value === 'number') {
				return value !== 0;
			}
			if (typeof value === 'string') {
				const lower = value.trim().toLowerCase();
				if (lower === 'true' || lower === '1') {
					return true;
				}
				if (lower === 'false' || lower === '0') {
					return false;
				}
			}
			return null;
		}

		if (type === 'string') {
			if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
				return String(value);
			}
			return null;
		}

		if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
			return value;
		}
		return null;
	}

	/**
	 * Wandelt einen Rohwert (Bytes oder Kilobytes) in einen numerischen Wert mit Einheit um.
	 * Verarbeitet auch bereits formatierte Strings wie "495.72 MB".
	 *
	 * @param val The raw value (number in bytes/KB or already formatted string)
	 * @param isKilobytes Whether the raw numerical value is in kilobytes
	 */
	private parseStorageValue(val: any, isKilobytes = false): { value: number; unit: string } {
		if (typeof val === 'string') {
			const match = val.match(/^([\d.]+)\s*(\w+)$/);
			if (match) {
				return { value: parseFloat(match[1]), unit: match[2] };
			}
		}
		const numericValue = typeof val === 'string' ? parseFloat(val) : Number(val);
		if (isNaN(numericValue) || numericValue <= 0) {
			return { value: 0, unit: 'MB' };
		}
		const bytes = isKilobytes ? numericValue * 1024 : numericValue;
		const mb = bytes / (1024 * 1024);
		if (mb >= 1024) {
			return { value: parseFloat((mb / 1024).toFixed(2)), unit: 'GB' };
		}
		return { value: parseFloat(mb.toFixed(2)), unit: 'MB' };
	}

	private onUnload(callback: () => void): void {
		try {
			this.log.debug('onUnload: adapter is stopping, clearing interval');
			if (this.updateInterval) {
				this.clearInterval(this.updateInterval);
			}
			callback();
		} catch {
			callback();
		}
	}
}

if (require.main !== module) {
	module.exports = (options: Partial<utils.AdapterOptions> | undefined) => new NextcloudMonitoring(options);
} else {
	(() => new NextcloudMonitoring())();
}
