import * as utils from '@iobroker/adapter-core';
import { NextcloudApiClient } from './lib/nextcloudApi';
import { words } from './lib/words';

/**
 * Interface für die Definition eines einzelnen Servers aus der Admin-Tabelle.
 */
interface NextcloudServer {
	name: string;
	domain: string;
	token: string;
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
		this.log.debug('onReady: starting initialization');

		if (!config.servers || !Array.isArray(config.servers) || config.servers.length === 0) {
			this.log.error('Configuration incomplete: No servers found in the table!');
			return;
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

			await this.updateNextcloudData(cleanId, apiClient);
			this.log.debug(`updateAllServers: finished processing ${cleanId}`);
		}
		this.log.debug('updateAllServers: completed all servers');
	}

	/**
	 * Hauptfunktion zum Abrufen und Verarbeiten aller Datenpunkte eines spezifischen Servers.
	 *
	 * @param serverId ID of the server used as the root folder in the object tree
	 * @param apiClient Instance of the NextcloudApiClient for this specific server
	 */
	private async updateNextcloudData(serverId: string, apiClient: NextcloudApiClient): Promise<void> {
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
						uk: 'Наluftungen PHP',
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

			// 3. WICHTIG: Die Variable muss hier benutzt werden!
			for (const chan of channels) {
				await this.setObjectNotExistsAsync(`${serverId}.${chan.id}`, {
					type: 'channel',
					common: {
						name: chan.name as any,
						role: 'info',
					},
					native: {},
				});
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
				);
				await this.setAndCreateState(`${serverId}.system.cpuload_1`, 'CPU Load 1min', sys.cpuload[0], 'number');
				await this.setAndCreateState(`${serverId}.system.cpuload_5`, 'CPU Load 5min', sys.cpuload[1], 'number');
				await this.setAndCreateState(
					`${serverId}.system.cpuload_15`,
					'CPU Load 15min',
					sys.cpuload[2],
					'number',
				);
				await this.setAndCreateState(`${serverId}.system.cpunum`, 'CPU Cores', sys.cpunum, 'number');
				await this.setAndCreateState(
					`${serverId}.system.mem_total`,
					'RAM Total',
					apiClient.formatValue(sys.mem_total, true),
					'string',
				);
				await this.setAndCreateState(
					`${serverId}.system.mem_free`,
					'RAM Free',
					apiClient.formatValue(sys.mem_free, true),
					'string',
				);
				await this.setAndCreateState(
					`${serverId}.system.swap_total`,
					'Swap Total',
					apiClient.formatValue(sys.swap_total, true),
					'string',
				);
				await this.setAndCreateState(
					`${serverId}.system.freespace`,
					'Free Disk Space',
					apiClient.formatValue(sys.freespace),
					'string',
				);
				await this.setAndCreateState(
					`${serverId}.system.memcache_local`,
					'Memcache Local',
					sys['memcache.local'],
					'string',
				);
				await this.setAndCreateState(
					`${serverId}.system.memcache_locking`,
					'Memcache Locking',
					sys['memcache.locking'],
					'string',
				);

				if (sys.apps) {
					await this.setAndCreateState(
						`${serverId}.apps.num_installed`,
						'Installed Apps',
						sys.apps.num_installed,
						'number',
					);
					await this.setAndCreateState(
						`${serverId}.apps.updates_available`,
						'App Updates available',
						sys.apps.num_updates_available,
						'number',
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
						);
					}
				}

				if (sys.update) {
					await this.setAndCreateState(
						`${serverId}.apps.update_available`,
						'System Update available',
						sys.update.available,
						'boolean',
					);
					await this.setAndCreateState(
						`${serverId}.apps.last_update_check`,
						'Last Update Check',
						new Date(sys.update.lastupdatedat * 1000).toLocaleString(),
						'string',
					);
					await this.setAndCreateState(
						`${serverId}.apps.available_new_version`,
						'Available New Version',
						sys.update.available_version ?? '0',
						'string',
					);
				}
			}

			// --- 2. STORAGE & USERS ---
			if (nc?.storage) {
				const st = nc.storage;
				await this.setAndCreateState(`${serverId}.storage.num_users`, 'Total Users', st.num_users, 'number');
				await this.setAndCreateState(`${serverId}.storage.num_files`, 'Total Files', st.num_files, 'number');
				await this.setAndCreateState(
					`${serverId}.storage.num_storages`,
					'Total Storages',
					st.num_storages,
					'number',
				);
				await this.setAndCreateState(
					`${serverId}.storage.num_files_appdata`,
					'Appdata Files',
					st.num_files_appdata,
					'number',
				);
				await this.setAndCreateState(
					`${serverId}.storage.num_disabled_users`,
					'Num Disabled Users',
					st.num_disabled_users,
					'number',
				);
			}

			// --- 3. SHARES (FREIGABEN) ---
			if (nc?.shares) {
				const sh = nc.shares;
				await this.setAndCreateState(`${serverId}.shares.num_shares`, 'Total Shares', sh.num_shares, 'number');
				await this.setAndCreateState(
					`${serverId}.shares.num_shares_link`,
					'Link Shares',
					sh.num_shares_link,
					'number',
				);
				await this.setAndCreateState(
					`${serverId}.shares.num_shares_room`,
					'Talk Rooms',
					sh.num_shares_room,
					'number',
				);
				await this.setAndCreateState(
					`${serverId}.shares.num_fed_shares_sent`,
					'Federated Sent',
					sh.num_fed_shares_sent,
					'number',
				);
			}

			// --- 4. SERVER, PHP, OPCACHE, APCU & FPM & DATABASE ---
			if (data.server) {
				const srv = data.server;
				await this.setAndCreateState(`${serverId}.server.webserver`, 'Webserver Type', srv.webserver, 'string');

				if (srv.php) {
					await this.setAndCreateState(
						`${serverId}.server.php.version`,
						'PHP Version',
						srv.php.version,
						'string',
					);
					await this.setAndCreateState(
						`${serverId}.server.php.memory_limit`,
						'PHP Memory Limit',
						apiClient.formatValue(srv.php.memory_limit),
						'string',
					);
					await this.setAndCreateState(
						`${serverId}.server.php.upload_max`,
						'Max Upload Size',
						apiClient.formatValue(srv.php.upload_max_filesize),
						'string',
					);

					const opcache = srv.php.opcache || srv.opcache;
					if (opcache) {
						const stats = opcache.opcache_statistics;
						const mem = opcache.memory_usage;
						if (stats) {
							const hitRate = stats.opcache_hit_rate
								? `${parseFloat(stats.opcache_hit_rate).toFixed(2)}%`
								: '0%';
							await this.setAndCreateState(
								`${serverId}.server.php.opcache.hit_rate`,
								'Opcache Hit Rate',
								hitRate,
								'string',
							);
						}
						if (mem) {
							await this.setAndCreateState(
								`${serverId}.server.php.opcache.used_mem`,
								'Opcache RAM used',
								apiClient.formatValue(mem.used_memory || 0),
								'string',
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
						);
						await this.setAndCreateState(
							`${serverId}.server.php.apcu.mem_size`,
							'APCu Cache Size',
							apiClient.formatValue(apcu.cache.mem_size),
							'string',
						);
						await this.setAndCreateState(
							`${serverId}.server.php.apcu.hits`,
							'APCu Hits',
							apcu.cache.num_hits,
							'number',
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
					);
					await this.setAndCreateState(
						`${serverId}.server.fpm.total_processes`,
						'FPM Total Processes',
						fpm['total-processes'],
						'number',
					);
					await this.setAndCreateState(
						`${serverId}.server.fpm.idle_processes`,
						'FPM Idle Processes',
						fpm['idle-processes'],
						'number',
					);
					await this.setAndCreateState(
						`${serverId}.server.fpm.accepted_conn`,
						'FPM Accepted Conn',
						fpm['accepted-conn'],
						'number',
					);
					await this.setAndCreateState(
						`${serverId}.server.fpm.max_active`,
						'FPM Max Active',
						fpm['max-active-processes'],
						'number',
					);
				}

				if (srv.database) {
					await this.setAndCreateState(
						`${serverId}.server.database.type`,
						'DB Type',
						srv.database.type,
						'string',
					);
					await this.setAndCreateState(
						`${serverId}.server.database.version`,
						'DB Version',
						srv.database.version,
						'string',
					);
					await this.setAndCreateState(
						`${serverId}.server.database.size`,
						'DB Size',
						apiClient.formatValue(srv.database.size),
						'string',
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
				);
				await this.setAndCreateState(
					`${serverId}.activeUsers.last1h`,
					'Active Users (1 h)',
					au.last1hour,
					'number',
				);
				await this.setAndCreateState(
					`${serverId}.activeUsers.last24h`,
					'Active Users (24 h)',
					au.last24hours,
					'number',
				);
				await this.setAndCreateState(
					`${serverId}.activeUsers.last1month`,
					'Active Users (1 month)',
					au.last1month,
					'number',
				);
				await this.setAndCreateState(
					`${serverId}.activeUsers.last3month`,
					'Active Users (3 month)',
					au.last3months,
					'number',
				);
				await this.setAndCreateState(
					`${serverId}.activeUsers.last6month`,
					'Active Users (6 month)',
					au.last6months,
					'number',
				);
				await this.setAndCreateState(
					`${serverId}.activeUsers.lastyear`,
					'Active Users (Last Year)',
					au.lastyear,
					'number',
				);
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

	private async setAndCreateState(id: string, nameKey: string, value: any, type: ioBroker.CommonType): Promise<void> {
		const translatedName = words[nameKey] || nameKey;
		this.log.debug(`setAndCreateState: ${id} value=${String(value)}`);

		// Objekt nur erstellen, wenn es noch nicht gecacht ist
		if (!this.createdStates.has(id)) {
			await this.setObjectNotExistsAsync(id, {
				type: 'state',
				common: {
					name: translatedName,
					type,
					role: 'value',
					read: true,
					write: false,
				},
				native: {},
			});
			this.createdStates.add(id);
		}
		await this.setState(id, { val: value, ack: true });
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
