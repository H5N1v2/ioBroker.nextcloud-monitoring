/**
 * Configuration for the widget
 */
export interface WidgetConfig {
	/**
	 * Font size
	 */
	fontSize: number;
	/**
	 * Enable dark mode
	 */
	darkMode: boolean;
	/**
	 * Server name to display in the widget header
	 */
	serverName: string;
	/**
	 * Language code for the widget (e.g., 'en', 'de', 'fr')
	 */
	language: string;
}

type LangMap = Record<string, string>;

const I18N: Record<string, LangMap> = {
	de: {
		ms: 'Überwachungsserver',
		instv: 'Installierte Version',
		sysup: 'System Update',
		newncv: 'Neue Nextcloud Version',
		appupa: 'App-Updates verfügbar',
		activeu: 'aktive Nutzer (letzte 5 min)',
		db: 'Datenbank',
		size: 'Größe',
		ws: 'Webserver',
		st: 'Storage',
		fsum: 'Dateien gesamt',
		freesp: 'Freier Speicher',
		sys: 'System',
		cpuc: 'CPU Kerne',
		cpul: 'CPU Last (5m)',
		fmem: 'RAM frei / gesamt',
		yes: 'Ja',
		no: 'Nein',
		act: 'Aktuell',
		newv: 'Neue Version',
		lastUpd: 'Zuletzt aktualisiert',
		user: 'Benutzer',
		typv: 'Typ / Version',
	},
	en: {
		ms: 'Monitoring Server',
		instv: 'Installed Version',
		sysup: 'System Update',
		newncv: 'New Nextcloud Version',
		appupa: 'App updates available',
		activeu: 'active users (last 5 min)',
		db: 'Database',
		size: 'Size',
		ws: 'Webserver',
		st: 'Storage',
		fsum: 'Total files',
		freesp: 'Free space',
		sys: 'System',
		cpuc: 'CPU Cores',
		cpul: 'CPU Load (5m)',
		fmem: 'RAM free / total',
		yes: 'Yes',
		no: 'No',
		act: 'Current',
		newv: 'New Version',
		lastUpd: 'Last updated',
		user: 'User',
		typv: 'Type / Version',
	},
	fr: {
		ms: 'Serveur de surveillance',
		instv: 'Version installée',
		sysup: 'Mise à jour système',
		newncv: 'Nouvelle version Nextcloud',
		appupa: "Mises à jour d'applications disponibles",
		activeu: 'utilisateurs actifs (dernières 5 min)',
		db: 'Base de données',
		size: 'Taille',
		ws: 'Serveur web',
		st: 'Stockage',
		fsum: 'Total des fichiers',
		freesp: 'Espace libre',
		sys: 'Système',
		cpuc: 'Cœurs CPU',
		cpul: 'Charge CPU (5m)',
		fmem: 'RAM libre / totale',
		yes: 'Oui',
		no: 'Non',
		act: 'Actuel',
		newv: 'Nouvelle version',
		lastUpd: 'Dernière mise à jour',
		user: 'Utilisateur',
		typv: 'Type / Version',
	},
	it: {
		ms: 'Server di monitoraggio',
		instv: 'Versione installata',
		sysup: 'Aggiornamento del sistema',
		newncv: 'Nuova versione Nextcloud',
		appupa: 'Aggiornamenti app disponibili',
		activeu: 'utenti attivi (ultimi 5 min)',
		db: 'Database',
		size: 'Dimensione',
		ws: 'Webserver',
		st: 'Archiviazione',
		fsum: 'File totali',
		freesp: 'Spazio libero',
		sys: 'Sistema',
		cpuc: 'Core CPU',
		cpul: 'Carico CPU (5m)',
		fmem: 'RAM libera / totale',
		yes: 'Sì',
		no: 'No',
		act: 'Attuale',
		newv: 'Nuova versione',
		lastUpd: 'Ultimo aggiornamento',
		user: 'Utente',
		typv: 'Tipo / Versione',
	},
	es: {
		ms: 'Servidor de monitoreo',
		instv: 'Versión instalada',
		sysup: 'Actualización del sistema',
		newncv: 'Nueva versión de Nextcloud',
		appupa: 'Actualizaciones de aplicaciones disponibles',
		activeu: 'usuarios activos (últimos 5 min)',
		db: 'Base de datos',
		size: 'Tamaño',
		ws: 'Servidor web',
		st: 'Almacenamiento',
		fsum: 'Total de archivos',
		freesp: 'Espacio libre',
		sys: 'Sistema',
		cpuc: 'Núcleos de CPU',
		cpul: 'Carga de CPU (5m)',
		fmem: 'RAM libre / total',
		yes: 'Sí',
		no: 'No',
		act: 'Actual',
		newv: 'Nueva versión',
		lastUpd: 'Última actualización',
		user: 'Usuario',
		typv: 'Tipo / Versión',
	},
	nl: {
		ms: 'Monitoringserver',
		instv: 'Geïnstalleerde versie',
		sysup: 'Systeemupdate',
		newncv: 'Nieuwe Nextcloud-versie',
		appupa: 'App-updates beschikbaar',
		activeu: 'actieve gebruikers (laatste 5 min)',
		db: 'Database',
		size: 'Grootte',
		ws: 'Webserver',
		st: 'Opslag',
		fsum: 'Totaal aantal bestanden',
		freesp: 'Vrije ruimte',
		sys: 'Systeem',
		cpuc: 'CPU-kernen',
		cpul: 'CPU-belasting (5m)',
		fmem: 'RAM vrij / totaal',
		yes: 'Ja',
		no: 'Nee',
		act: 'Actueel',
		newv: 'Nieuwe versie',
		lastUpd: 'Laatste update',
		user: 'Gebruiker',
		typv: 'Type / Versie',
	},
	pl: {
		ms: 'Serwer monitorujący',
		instv: 'Zainstalowana wersja',
		sysup: 'Aktualizacja systemu',
		newncv: 'Nowa wersja Nextcloud',
		appupa: 'Dostępne aktualizacje aplikacji',
		activeu: 'aktywni użytkownicy (ostatnie 5 min)',
		db: 'Baza danych',
		size: 'Rozmiar',
		ws: 'Serwer WWW',
		st: 'Pamięć masowa',
		fsum: 'Wszystkich plików',
		freesp: 'Wolne miejsce',
		sys: 'System',
		cpuc: 'Rdzenie CPU',
		cpul: 'Obciążenie CPU (5m)',
		fmem: 'RAM wolny / całkowity',
		yes: 'Tak',
		no: 'Nie',
		act: 'Aktualnie',
		newv: 'Nowa wersja',
		lastUpd: 'Ostatnia aktualizacja',
		user: 'Użytkownik',
		typv: 'Typ / Wersja',
	},
	pt: {
		ms: 'Servidor de monitoramento',
		instv: 'Versão instalada',
		sysup: 'Atualização do sistema',
		newncv: 'Nova versão Nextcloud',
		appupa: 'Atualizações de aplicativos disponíveis',
		activeu: 'usuários ativos (últimos 5 min)',
		db: 'Banco de dados',
		size: 'Tamanho',
		ws: 'Servidor web',
		st: 'Armazenamento',
		fsum: 'Total de arquivos',
		freesp: 'Espaço livre',
		sys: 'Sistema',
		cpuc: 'Núcleos de CPU',
		cpul: 'Carga de CPU (5m)',
		fmem: 'RAM livre / total',
		yes: 'Sim',
		no: 'Não',
		act: 'Atual',
		newv: 'Nova versão',
		lastUpd: 'Última atualização',
		user: 'Usuário',
		typv: 'Tipo / Versão',
	},
	ru: {
		ms: 'Сервер мониторинга',
		instv: 'Установленная версия',
		sysup: 'Обновление системы',
		newncv: 'Новая версия Nextcloud',
		appupa: 'Доступны обновления приложений',
		activeu: 'активные пользователи (последние 5 мин)',
		db: 'База данных',
		size: 'Размер',
		ws: 'Веб-сервер',
		st: 'Хранилище',
		fsum: 'Всего файлов',
		freesp: 'Свободное место',
		sys: 'Система',
		cpuc: 'Ядра ЦП',
		cpul: 'Нагрузка ЦП (5 мин)',
		fmem: 'ОЗУ свободно / всего',
		yes: 'Да',
		no: 'Нет',
		act: 'Сейчас',
		newv: 'Новая версия',
		lastUpd: 'Последнее обновление',
		user: 'Пользователь',
		typv: 'Тип / Версия',
	},
	uk: {
		ms: 'Сервер моніторингу',
		instv: 'Встановлена версія',
		sysup: 'Оновлення системи',
		newncv: 'Нова версія Nextcloud',
		appupa: 'Доступні оновлення додатків',
		activeu: 'активні користувачі (останні 5 хв)',
		db: 'База даних',
		size: 'Розмір',
		ws: 'Веб-сервер',
		st: 'Сховище',
		fsum: 'Всього файлів',
		freesp: 'Вільне місце',
		sys: 'Система',
		cpuc: 'Ядра ЦП',
		cpul: 'Навантаження ЦП (5 хв)',
		fmem: 'ОЗП вільно / всього',
		yes: 'Так',
		no: 'Ні',
		act: 'Зараз',
		newv: 'Нова версія',
		lastUpd: 'Останнє оновлення',
		user: 'Користувач',
		typv: 'Тип / Версія',
	},
	zh: {
		ms: '监控服务器',
		instv: '已安装版本',
		sysup: '系统更新',
		newncv: '新的 Nextcloud 版本',
		appupa: '有可用的应用更新',
		activeu: '活跃用户 (最近5分钟)',
		db: '数据库',
		size: '容量',
		ws: 'Web服务器',
		st: '存储',
		fsum: '文件总数',
		freesp: '可用空间',
		sys: '系统',
		cpuc: 'CPU核心数',
		cpul: 'CPU 负载 (5分钟)',
		fmem: '内存 空闲 / 总计',
		yes: '是',
		no: '否',
		act: '当前',
		newv: '新版本',
		lastUpd: '最后更新',
		user: '用户',
		typv: '类型 / 版本',
	},
};
I18N['zh-cn'] = I18N.zh;

/**
 * WidgetGenerator is responsible for generating the HTML content for the Nextcloud monitoring widget.
 */
export class WidgetGenerator {
	/**
	 *
	 * @param data The data object containing Nextcloud and server information
	 * @param config The widget configuration object with settings like font size, dark mode, server name, and language
	 */
	generateHtml(data: any, config: WidgetConfig): string {
		const langKey = config.language === 'zh-cn' ? 'zh' : config.language;
		const lang: LangMap = I18N[langKey] ?? I18N.en;

		const nc = data?.nextcloud;
		const sys = nc?.system;
		const srv = data?.server;
		const au = data?.activeUsers;

		const ncVersion: string = sys?.version ?? '—';
		const systemUpdate = Boolean(sys?.update?.available);
		const availableNew: string | null = sys?.update?.available_version || null;
		const appsUpdates: number | null = sys?.apps?.num_updates_available ?? null;
		const active5: number | null = au?.last5minutes ?? null;

		const dbSizeBytes: number | null = srv?.database?.size != null ? Number(srv.database.size) : null;
		const dbType: string = srv?.database?.type ?? '—';
		const dbVersion: string = srv?.database?.version ?? '';
		const phpVersion: string = srv?.php?.version ?? '—';
		const webserver: string = srv?.webserver ?? '—';

		const numFiles: number | null = nc?.storage?.num_files ?? null;
		const numUsers: number | null = nc?.storage?.num_users ?? null;

		// freespace from Nextcloud API is in bytes (may also be a formatted string)
		const freeSpaceBytes: number | null = this.parseSize(sys?.freespace, 'B');
		// mem values from Nextcloud API are in KB
		const memFreeBytes: number | null = sys?.mem_free != null ? Number(sys.mem_free) * 1024 : null;
		const memTotalBytes: number | null = sys?.mem_total != null ? Number(sys.mem_total) * 1024 : null;

		const cpuNum: number | null = sys?.cpunum ?? null;
		const cpuLoad5: number | null = sys?.cpuload?.[1] ?? null;

		const isNoUpdate = !availableNew || availableNew === '0' || availableNew === 'false';

		const availableNewDisplay = isNoUpdate
			? `<span class="dot ok" title="${this.esc(lang.act)}">●</span> ${this.esc(lang.act)}`
			: `<span class="dot warn" title="${this.esc(lang.newv)}">●</span> ${this.esc(String(availableNew))}`;

		const systemUpdateDisplay = systemUpdate
			? `<span class="badge warn">⬆ ${this.esc(lang.yes)}</span>`
			: `<span class="badge ok">✓ ${this.esc(lang.no)}</span>`;

		const appsUpdatesDisplay = appsUpdates != null ? this.numberFmt(appsUpdates) : '—';
		const timestamp = new Date().toLocaleString();
		const css = this.buildCss(config.fontSize, config.darkMode);

		return `<div class="nc-monitor">
  <style>
${css}
  </style>
  <div class="card header-card">
    <div class="logo"><img src="https://raw.githubusercontent.com/H5N1v2/ioBroker.nextcloud-monitoring/refs/heads/main/admin/nextcloud_monitoring.png" alt="nc-logo" style="height:70px"></div>
    <div>
      <div class="title">Nextcloud Monitoring</div>
      <div class="subtitle">${this.esc(lang.ms)}: ${this.esc(config.serverName)}</div>
    </div>
    <div style="margin-left:auto;text-align:right" class="muted">${this.esc(lang.lastUpd)}<br>${this.esc(timestamp)}</div>
  </div>
  <div class="grid">
    <div class="card">
      <div class="section-title">Nextcloud</div>
      <div class="row">
        <div class="icon cloud">☁️</div>
        <div class="kpi">
          <div class="stat">${this.esc(ncVersion)}</div>
          <div class="small">${this.esc(lang.instv)}</div>
        </div>
      </div>
      <div style="margin-top:10px" class="flex-between">
        <div class="muted">${this.esc(lang.sysup)}</div>
        <div>${systemUpdateDisplay}</div>
      </div>
      <div style="margin-top:8px" class="flex-between">
        <div class="muted">${this.esc(lang.newncv)}</div>
        <div>${availableNewDisplay}</div>
      </div>
      <div style="margin-top:8px" class="flex-between">
        <div class="muted">${this.esc(lang.appupa)}</div>
        <div class="muted">${appsUpdatesDisplay}</div>
      </div>
      <div style="margin-top:8px" class="flex-between">
        <div class="muted">${this.esc(lang.activeu)}</div>
        <div class="muted">${active5 !== null ? this.numberFmt(active5) : '—'}</div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">${this.esc(lang.db)}</div>
      <div class="row">
        <div class="icon db">🗄️</div>
        <div style="flex:1">
          <div class="muted">${this.esc(lang.typv)}</div>
          <div class="stat">${this.esc(dbType)}${dbVersion ? ` (${this.esc(dbVersion)})` : ''}</div>
          <div style="margin-top:8px" class="muted">${this.esc(lang.size)}</div>
          <div class="stat">${this.humanBytes(dbSizeBytes)}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">${this.esc(lang.ws)} / PHP</div>
      <div class="row">
        <div class="icon server">🌐</div>
        <div style="flex:1">
          <div class="muted">${this.esc(lang.ws)}</div>
          <div class="stat">${this.esc(webserver)}</div>
          <div style="margin-top:8px" class="muted">PHP</div>
          <div class="stat">${this.esc(phpVersion)}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">${this.esc(lang.st)}</div>
      <div class="row">
        <div class="icon storage">💾</div>
        <div style="flex:1">
          <div class="muted">${this.esc(lang.fsum)}</div>
          <div class="stat">${numFiles !== null ? this.numberFmt(numFiles) : '—'}</div>
          <div style="margin-top:8px" class="muted">${this.esc(lang.user)}</div>
          <div class="stat">${numUsers !== null ? this.numberFmt(numUsers) : '—'}</div>
          <div style="margin-top:8px" class="muted">${this.esc(lang.freesp)}</div>
          <div class="stat">${this.humanBytes(freeSpaceBytes)}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">${this.esc(lang.sys)}</div>
      <div class="row">
        <div class="icon cpu">⚙️</div>
        <div style="flex:1">
          <div class="muted">${this.esc(lang.cpuc)}</div>
          <div class="stat">${cpuNum !== null ? String(cpuNum) : '—'}</div>
          <div style="margin-top:8px" class="muted">${this.esc(lang.cpul)}</div>
          <div class="stat">${cpuLoad5 !== null ? String(cpuLoad5) : '—'}</div>
          <div style="margin-top:8px" class="muted">${this.esc(lang.fmem)}</div>
          <div class="stat">${memFreeBytes !== null ? this.humanBytes(memFreeBytes) : '—'} / ${memTotalBytes !== null ? this.humanBytes(memTotalBytes) : '—'}</div>
        </div>
      </div>
    </div>
  </div>
</div>`;
	}

	private esc(s: string): string {
		return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}

	private humanBytes(bytes: number | null): string {
		if (bytes === null || bytes === undefined || isNaN(bytes)) {
			return '—';
		}
		const units = ['B', 'KB', 'MB', 'GB', 'TB'];
		let i = 0;
		let n = Number(bytes);
		while (n >= 1024 && i < units.length - 1) {
			n /= 1024;
			i++;
		}
		return `${n.toFixed(n >= 10 ? 0 : 1)} ${units[i]}`;
	}

	private parseSize(val: any, assumedUnit?: string): number | null {
		if (val === null || val === undefined || val === '') {
			return null;
		}
		if (typeof val === 'number') {
			if (!assumedUnit) {
				return val;
			}
			const u = assumedUnit.toUpperCase();
			if (u === 'B') {
				return val;
			}
			if (u === 'KB') {
				return val * 1024;
			}
			if (u === 'MB') {
				return val * 1024 * 1024;
			}
			if (u === 'GB') {
				return val * 1024 * 1024 * 1024;
			}
			if (u === 'TB') {
				return val * 1024 * 1024 * 1024 * 1024;
			}
			return val;
		}
		if (typeof val === 'string') {
			const s = val.trim();
			const m = s.match(/^([0-9.,]+)\s*([a-zA-Z]+)?$/);
			if (!m) {
				return null;
			}
			const num = parseFloat(m[1].replace(',', '.'));
			const unit = (m[2] || '').toUpperCase();
			if (isNaN(num)) {
				return null;
			}
			if (!unit) {
				return assumedUnit ? this.parseSize(num, assumedUnit) : num;
			}
			if (unit === 'B') {
				return num;
			}
			if (unit === 'KB' || unit === 'KIB') {
				return num * 1024;
			}
			if (unit === 'MB' || unit === 'MIB') {
				return num * 1024 * 1024;
			}
			if (unit === 'GB' || unit === 'GIB') {
				return num * 1024 * 1024 * 1024;
			}
			if (unit === 'TB' || unit === 'TIB') {
				return num * 1024 * 1024 * 1024 * 1024;
			}
			return num;
		}
		return null;
	}

	private numberFmt(n: number | null): string {
		if (n === null || n === undefined || isNaN(n)) {
			return '—';
		}
		return n.toLocaleString('de-DE');
	}

	private buildCss(fontSize: number, darkMode: boolean): string {
		if (darkMode) {
			return `    .nc-monitor{font-family:Inter,Roboto,Arial,sans-serif;font-size:${fontSize}px;color:#e2e8f0}
    .card{background:linear-gradient(180deg,#1e293b 0%,#1a2236 100%);border-radius:12px;padding:16px;margin:8px;box-shadow:0 6px 18px rgba(0,0,0,0.4);border:1px solid rgba(255,255,255,0.06)}
    .header-card{display:flex;align-items:center;gap:12px}
    .logo{width:56px;height:56px;flex:0 0 56px;border-radius:12px;background:linear-gradient(135deg,#6ad1ff,#7b61ff);display:flex;align-items:center;justify-content:center}
    .title{font-size:18px;font-weight:700;color:#f1f5f9}
    .subtitle{font-size:12px;color:#94a3b8}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:12px}
    .row{display:flex;align-items:center;gap:12px}
    .muted{color:#64748b;font-size:12px}
    .badge{display:inline-block;padding:4px 8px;border-radius:8px;font-size:12px;color:white}
    .badge.ok{background:#10b981}.badge.warn{background:#f59e0b}
    .dot.ok{color:#10b981;margin-right:6px}.dot.warn{color:#f59e0b;margin-right:6px}
    .section-title{font-weight:600;color:#f1f5f9;margin-bottom:6px}
    .stat{font-size:16px;font-weight:700;color:#f1f5f9}
    .small{font-size:12px;color:#64748b}
    .flex-between{display:flex;justify-content:space-between;align-items:center}
    .kpi{display:flex;flex-direction:column}
    .icon{width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;border-radius:8px}
    .icon.cloud{background:linear-gradient(90deg,#06b6d4,#7c3aed)}
    .icon.db{background:linear-gradient(90deg,#f97316,#ef4444)}
    .icon.server{background:linear-gradient(90deg,#06b6d4,#0284c7)}
    .icon.storage{background:linear-gradient(90deg,#a78bfa,#60a5fa)}
    .icon.cpu{background:linear-gradient(90deg,#f43f5e,#f97316)}`;
		}
		return `    .nc-monitor{font-family:Inter,Roboto,Arial,sans-serif;font-size:${fontSize}px;color:#222}
    .card{background:linear-gradient(180deg,#fff 0%,#f7fbff 100%);border-radius:12px;padding:16px;margin:8px;box-shadow:0 6px 18px rgba(20,40,80,0.08);border:1px solid rgba(0,0,0,0.04)}
    .header-card{display:flex;align-items:center;gap:12px}
    .logo{width:56px;height:56px;flex:0 0 56px;border-radius:12px;background:linear-gradient(135deg,#6ad1ff,#7b61ff);display:flex;align-items:center;justify-content:center}
    .title{font-size:18px;font-weight:700}
    .subtitle{font-size:12px;color:#666}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:12px}
    .row{display:flex;align-items:center;gap:12px}
    .muted{color:#7b7b7b;font-size:12px}
    .badge{display:inline-block;padding:4px 8px;border-radius:8px;font-size:12px;color:white}
    .badge.ok{background:#10b981}.badge.warn{background:#f59e0b}
    .dot.ok{color:#10b981;margin-right:6px}.dot.warn{color:#f59e0b;margin-right:6px}
    .section-title{font-weight:600;color:#0f172a;margin-bottom:6px}
    .stat{font-size:16px;font-weight:700}
    .small{font-size:12px;color:#475569}
    .flex-between{display:flex;justify-content:space-between;align-items:center}
    .kpi{display:flex;flex-direction:column}
    .icon{width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;border-radius:8px}
    .icon.cloud{background:linear-gradient(90deg,#06b6d4,#7c3aed)}
    .icon.db{background:linear-gradient(90deg,#f97316,#ef4444)}
    .icon.server{background:linear-gradient(90deg,#06b6d4,#0284c7)}
    .icon.storage{background:linear-gradient(90deg,#a78bfa,#60a5fa)}
    .icon.cpu{background:linear-gradient(90deg,#f43f5e,#f97316)}`;
	}
}
