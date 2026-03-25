"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var utils = __toESM(require("@iobroker/adapter-core"));
var import_nextcloudApi = require("./lib/nextcloudApi");
var import_words = require("./lib/words");
class NextcloudMonitoring extends utils.Adapter {
  updateInterval;
  createdStates = /* @__PURE__ */ new Set();
  constructor(options = {}) {
    super({ ...options, name: "nextcloud-monitoring" });
    this.on("ready", this.onReady.bind(this));
    this.on("unload", this.onUnload.bind(this));
  }
  /**
   * Initialisiert den Adapter und startet die Abfragen für alle konfigurierten Server.
   */
  async onReady() {
    const config = this.config;
    this.log.debug("onReady: starting initialization");
    if (!config.servers || !Array.isArray(config.servers) || config.servers.length === 0) {
      this.log.error("Configuration incomplete: No servers found in the table!");
      return;
    }
    await this.extendForeignObjectAsync(this.namespace, {
      type: "meta",
      common: {
        name: {
          en: "Nextcloud Monitoring Service",
          de: "Nextcloud-\xDCberwachungsdienst",
          ru: "\u0421\u043B\u0443\u0436\u0431\u0430 \u043C\u043E\u043D\u0438\u0442\u043E\u0440\u0438\u043D\u0433\u0430 Nextcloud",
          pt: "Servi\xE7o de monitoramento do Nextcloud",
          nl: "Nextcloud-monitoringservice",
          fr: "Service de surveillance Nextcloud",
          it: "Servizio di monitoraggio Nextcloud",
          es: "Servicio de monitoreo de Nextcloud",
          pl: "Us\u0142uga monitorowania Nextcloud",
          uk: "\u0421\u0435\u0440\u0432\u0456\u0441 \u043C\u043E\u043D\u0456\u0442\u043E\u0440\u0438\u043D\u0433\u0443 Nextcloud",
          "zh-cn": "Nextcloud \u76D1\u63A7\u670D\u52A1"
        }
      }
    });
    await this.updateAllServers();
    const minutes = config.interval || 10;
    const intervalMs = minutes * 60 * 1e3;
    this.updateInterval = this.setInterval(async () => {
      await this.updateAllServers();
    }, intervalMs);
    this.log.debug(`onReady: scheduled updates every ${minutes} minutes`);
  }
  /**
   * Iteriert über alle Server in der Liste und führt die API-Abfrage aus.
   */
  async updateAllServers() {
    const config = this.config;
    this.log.debug("updateAllServers: starting update for all servers");
    for (const server of config.servers) {
      if (!server.domain || !server.token) {
        this.log.warn(`Server "${server.name || "Unknown"}" skipped: Domain or token is missing.`);
        continue;
      }
      this.log.debug(`updateAllServers: processing server ${server.name || server.domain}`);
      const cleanId = (server.name || server.domain).replace(this.FORBIDDEN_CHARS, "_").replace(/\s|\./g, "_");
      this.log.info(`Query running for: ${server.name} (${server.domain})`);
      const apiClient = new import_nextcloudApi.NextcloudApiClient(
        server.domain,
        server.token.trim(),
        config.skipApps,
        config.skipUpdate
      );
      await this.setObjectNotExistsAsync(cleanId, {
        type: "device",
        common: {
          name: server.name || server.domain
        },
        native: {}
      });
      await this.updateNextcloudData(cleanId, apiClient);
      this.log.debug(`updateAllServers: finished processing ${cleanId}`);
    }
    this.log.debug("updateAllServers: completed all servers");
  }
  /**
   * Hauptfunktion zum Abrufen und Verarbeiten aller Datenpunkte eines spezifischen Servers.
   *
   * @param serverId ID of the server used as the root folder in the object tree
   * @param apiClient Instance of the NextcloudApiClient for this specific server
   */
  async updateNextcloudData(serverId, apiClient) {
    var _a, _b;
    try {
      this.log.debug(`updateNextcloudData: fetching data for ${serverId}`);
      const response = await apiClient.fetchData();
      const config = this.config;
      let channels = [
        {
          id: "activeUsers",
          name: {
            en: "Active users",
            de: "Aktive Benutzer",
            pl: "Aktywni u\u017Cytkownicy",
            ru: "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438",
            it: "Utenti attivi",
            es: "Usuarios activos",
            "zh-cn": "\u6D3B\u8DC3\u7528\u6237",
            fr: "Utilisateurs actifs",
            pt: "Usu\xE1rios ativos",
            nl: "Actieve gebruikers",
            uk: "\u0410\u043A\u0442\u0438\u0432\u043D\u0456 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0438"
          }
        },
        {
          id: "apps",
          name: {
            en: "Applications",
            de: "Anwendungen",
            pl: "Aplikacje",
            ru: "\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F",
            it: "Applicazioni",
            es: "Aplicaciones",
            "zh-cn": "\u5E94\u7528\u7A0B\u5E8F",
            fr: "Applications",
            pt: "Aplicativos",
            nl: "Applicaties",
            uk: "\u041F\u0440\u043E\u0433\u0440\u0430\u043C\u0438"
          }
        },
        {
          id: "server",
          name: {
            en: "Server",
            de: "Server",
            pl: "Serwer",
            ru: "\u0421\u0435\u0440\u0432\u0435\u0440",
            it: "Server",
            es: "Servidor",
            "zh-cn": "\u670D\u52A1\u5668",
            fr: "Serveur",
            pt: "Servidor",
            nl: "Server",
            uk: "\u0421\u0435\u0440\u0432\u0435\u0440"
          }
        },
        {
          id: "server.database",
          name: {
            en: "Database",
            de: "Datenbank",
            pl: "Baza danych",
            ru: "\u0411\u0430\u0437\u0430 \u0434\u0430\u043D\u043D\u044B\u0445",
            it: "Database",
            es: "Base de datos",
            "zh-cn": "\u6570\u636E\u5E93",
            fr: "Base de donn\xE9es",
            pt: "Banco de dados",
            nl: "Database",
            uk: "\u0411\u0430\u0437\u0430 \u0434\u0430\u043D\u0438\u0445"
          }
        },
        {
          id: "server.fpm",
          name: {
            en: "PHP-FPM",
            de: "PHP-FPM",
            pl: "PHP-FPM",
            ru: "PHP-FPM",
            it: "PHP-FPM",
            es: "PHP-FPM",
            "zh-cn": "PHP-FPM",
            fr: "PHP-FPM",
            pt: "PHP-FPM",
            nl: "PHP-FPM",
            uk: "PHP-FPM"
          }
        },
        {
          id: "server.php",
          name: {
            en: "PHP Settings",
            de: "PHP-Einstellungen",
            pl: "Ustawienia PHP",
            ru: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 PHP",
            it: "Impostazioni PHP",
            es: "Ajustes de PHP",
            "zh-cn": "PHP \u8BBE\u7F6E",
            fr: "Param\xE8tres PHP",
            pt: "Configura\xE7\xF5es do PHP",
            nl: "PHP-instellingen",
            uk: "\u041D\u0430luftungen PHP"
          }
        },
        {
          id: "server.php.apcu",
          name: {
            en: "PHP APCu Cache",
            de: "PHP APCu Cache",
            pl: "Pami\u0119\u0107 podr\u0119czna PHP APCu",
            ru: "\u041A\u044D\u0448 PHP APCu",
            it: "Cache PHP APCu",
            es: "Cach\xE9 PHP APCu",
            "zh-cn": "PHP APCu \u7F13\u5B58",
            fr: "Cache PHP APCu",
            pt: "Cache APCu do PHP",
            nl: "PHP APCu-cache",
            uk: "\u041A\u0435\u0448 PHP APCu"
          }
        },
        {
          id: "server.php.opcache",
          name: {
            en: "PHP OPcache",
            de: "PHP OPcache",
            pl: "PHP OPcache",
            ru: "PHP OPcache",
            it: "PHP OPcache",
            es: "PHP OPcache",
            "zh-cn": "PHP OPcache",
            fr: "PHP OPcache",
            pt: "PHP OPcache",
            nl: "PHP OPcache",
            uk: "PHP OPcache"
          }
        },
        {
          id: "shares",
          name: {
            en: "Shares",
            de: "Freigaben",
            pl: "Udzia\u0142y",
            ru: "\u041E\u0431\u0449\u0438\u0435 \u0440\u0435\u0441\u0443\u0440\u0441\u044B",
            it: "Condivisioni",
            es: "Recursos compartidos",
            "zh-cn": "\u5171\u4EAB",
            fr: "Partages",
            pt: "Compartilhamentos",
            nl: "Gedeelde mappen",
            uk: "\u0421\u043F\u0456\u043B\u044C\u043D\u0456 \u0440\u0435\u0441\u0443\u0440\u0441\u0438"
          }
        },
        {
          id: "storage",
          name: {
            en: "Storage",
            de: "Speicher",
            pl: "Magazyn danych",
            ru: "\u0425\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435",
            it: "Archiviazione",
            es: "Almacenamiento",
            "zh-cn": "\u5B58\u50A8",
            fr: "Stockage",
            pt: "Armazenamento",
            nl: "Opslag",
            uk: "\u0421\u0445\u043E\u0432\u0438\u0449\u0435"
          }
        },
        {
          id: "system",
          name: {
            en: "System",
            de: "System",
            pl: "System",
            ru: "\u0421\u0438\u0441\u0442\u0435\u043C\u0430",
            it: "Sistema",
            es: "Sistema",
            "zh-cn": "\u7CFB\u7EDF",
            fr: "Syst\xE8me",
            pt: "Sistema",
            nl: "Systeem",
            uk: "\u0421\u0438\u0441\u0442\u0435\u043C\u0430"
          }
        }
      ];
      if (config.skipApps) {
        this.log.debug(`Filtering out App details for ${serverId}`);
      }
      if (config.skipUpdate) {
        this.log.debug(`Filtering out Update details for ${serverId}`);
      }
      if (config.skipApps && config.skipUpdate) {
        this.log.debug(`Skipping entire Apps channel`);
        channels = channels.filter((chan) => !chan.id.startsWith("apps"));
      }
      const sortedChannels = [...channels].sort((a, b) => a.id.localeCompare(b.id));
      for (const chan of sortedChannels) {
        const channelId = `${serverId}.${chan.id}`;
        if (!this.createdStates.has(channelId)) {
          await this.setObjectNotExistsAsync(channelId, {
            type: "channel",
            common: {
              name: chan.name,
              role: "info"
            },
            native: {}
          });
          this.createdStates.add(channelId);
        }
      }
      if (!((_a = response == null ? void 0 : response.ocs) == null ? void 0 : _a.data)) {
        this.log.warn(`Unexpected API response from Nextcloud (${serverId})`);
        return;
      }
      const data = response.ocs.data;
      const nc = data.nextcloud;
      this.log.debug(`updateNextcloudData: received data keys for ${serverId}: ${Object.keys(data).join(", ")}`);
      if (nc == null ? void 0 : nc.system) {
        const sys = nc.system;
        await this.setAndCreateState(
          `${serverId}.system.current_version`,
          "Current Version",
          sys.version,
          "string",
          "info.firmware"
        );
        await this.setAndCreateState(
          `${serverId}.system.cpuload_1`,
          "CPU Load 1min",
          sys.cpuload[0],
          "number",
          "value"
        );
        await this.setAndCreateState(
          `${serverId}.system.cpuload_5`,
          "CPU Load 5min",
          sys.cpuload[1],
          "number",
          "value"
        );
        await this.setAndCreateState(
          `${serverId}.system.cpuload_15`,
          "CPU Load 15min",
          sys.cpuload[2],
          "number",
          "value"
        );
        await this.setAndCreateState(`${serverId}.system.cpunum`, "CPU Cores", sys.cpunum, "number", "value");
        const memTotal = this.parseStorageValue(sys.mem_total, true);
        await this.setAndCreateState(
          `${serverId}.system.mem_total`,
          "RAM Total",
          memTotal.value,
          "number",
          "value.storage",
          memTotal.unit
        );
        const memFree = this.parseStorageValue(sys.mem_free, true);
        await this.setAndCreateState(
          `${serverId}.system.mem_free`,
          "RAM Free",
          memFree.value,
          "number",
          "value.storage",
          memFree.unit
        );
        const swapTotal = this.parseStorageValue(sys.swap_total, true);
        await this.setAndCreateState(
          `${serverId}.system.swap_total`,
          "Swap Total",
          swapTotal.value,
          "number",
          "value.storage",
          swapTotal.unit
        );
        const freespace = this.parseStorageValue(sys.freespace);
        await this.setAndCreateState(
          `${serverId}.system.freespace`,
          "Free Disk Space",
          freespace.value,
          "number",
          "value.storage",
          freespace.unit
        );
        await this.setAndCreateState(
          `${serverId}.system.memcache_local`,
          "Memcache Local",
          sys["memcache.local"],
          "string",
          "text"
        );
        await this.setAndCreateState(
          `${serverId}.system.memcache_locking`,
          "Memcache Locking",
          sys["memcache.locking"],
          "string",
          "text"
        );
        if (sys.apps) {
          await this.setAndCreateState(
            `${serverId}.apps.num_installed`,
            "Installed Apps",
            sys.apps.num_installed,
            "number",
            "value"
          );
          await this.setAndCreateState(
            `${serverId}.apps.updates_available`,
            "App Updates available",
            sys.apps.num_updates_available,
            "number",
            "value"
          );
          if (sys.apps.app_updates && typeof sys.apps.app_updates === "object") {
            const updateList = Object.entries(sys.apps.app_updates).map(([appName, version]) => `${String(appName)} = "${String(version)}"`).join(" & ");
            await this.setAndCreateState(
              `${serverId}.apps.new_updates_for_apps`,
              "New Updates for apps",
              updateList || "none",
              "string",
              "text"
            );
          }
        }
        if (sys.update) {
          await this.setAndCreateState(
            `${serverId}.apps.update_available`,
            "System Update available",
            sys.update.available,
            "boolean",
            "indicator"
          );
          await this.setAndCreateState(
            `${serverId}.apps.last_update_check`,
            "Last Update Check",
            new Date(sys.update.lastupdatedat * 1e3).toLocaleString(),
            "string",
            "value.datetime"
          );
          await this.setAndCreateState(
            `${serverId}.apps.available_new_version`,
            "Available New Version",
            (_b = sys.update.available_version) != null ? _b : "0",
            "string",
            "info.firmware"
          );
        }
      }
      if (nc == null ? void 0 : nc.storage) {
        const st = nc.storage;
        await this.setAndCreateState(
          `${serverId}.storage.num_users`,
          "Total Users",
          st.num_users,
          "number",
          "value"
        );
        await this.setAndCreateState(
          `${serverId}.storage.num_files`,
          "Total Files",
          st.num_files,
          "number",
          "value"
        );
        await this.setAndCreateState(
          `${serverId}.storage.num_storages`,
          "Total Storages",
          st.num_storages,
          "number",
          "value"
        );
        await this.setAndCreateState(
          `${serverId}.storage.num_files_appdata`,
          "Appdata Files",
          st.num_files_appdata,
          "number",
          "value"
        );
        await this.setAndCreateState(
          `${serverId}.storage.num_disabled_users`,
          "Num Disabled Users",
          st.num_disabled_users,
          "number",
          "value"
        );
      }
      if (nc == null ? void 0 : nc.shares) {
        const sh = nc.shares;
        await this.setAndCreateState(
          `${serverId}.shares.num_shares`,
          "Total Shares",
          sh.num_shares,
          "number",
          "value"
        );
        await this.setAndCreateState(
          `${serverId}.shares.num_shares_link`,
          "Link Shares",
          sh.num_shares_link,
          "number",
          "value"
        );
        await this.setAndCreateState(
          `${serverId}.shares.num_shares_room`,
          "Talk Rooms",
          sh.num_shares_room,
          "number",
          "value"
        );
        await this.setAndCreateState(
          `${serverId}.shares.num_fed_shares_sent`,
          "Federated Sent",
          sh.num_fed_shares_sent,
          "number",
          "value"
        );
      }
      if (data.server) {
        const srv = data.server;
        await this.setAndCreateState(
          `${serverId}.server.webserver`,
          "Webserver Type",
          srv.webserver,
          "string",
          "text"
        );
        if (srv.php) {
          await this.setAndCreateState(
            `${serverId}.server.php.version`,
            "PHP Version",
            srv.php.version,
            "string",
            "info.firmware"
          );
          const phpMemLimit = this.parseStorageValue(srv.php.memory_limit);
          await this.setAndCreateState(
            `${serverId}.server.php.memory_limit`,
            "PHP Memory Limit",
            phpMemLimit.value,
            "number",
            "value.storage",
            phpMemLimit.unit
          );
          const phpUploadMax = this.parseStorageValue(srv.php.upload_max_filesize);
          await this.setAndCreateState(
            `${serverId}.server.php.upload_max`,
            "Max Upload Size",
            phpUploadMax.value,
            "number",
            "value.storage",
            phpUploadMax.unit
          );
          const opcache = srv.php.opcache || srv.opcache;
          if (opcache) {
            const stats = opcache.opcache_statistics;
            const mem = opcache.memory_usage;
            if (stats) {
              const hitRate = stats.opcache_hit_rate ? `${parseFloat(stats.opcache_hit_rate).toFixed(2)}` : "0";
              await this.setAndCreateState(
                `${serverId}.server.php.opcache.hit_rate`,
                "Opcache Hit Rate",
                hitRate,
                "number",
                "value",
                "%"
              );
            }
            if (mem) {
              const opcacheUsedMem = this.parseStorageValue(mem.used_memory || 0);
              await this.setAndCreateState(
                `${serverId}.server.php.opcache.used_mem`,
                "Opcache RAM used",
                opcacheUsedMem.value,
                "number",
                "value.storage",
                opcacheUsedMem.unit
              );
            }
          }
          const apcu = srv.php.apcu || srv.apcu;
          if (apcu == null ? void 0 : apcu.cache) {
            await this.setAndCreateState(
              `${serverId}.server.php.apcu.entries`,
              "APCu Entries",
              apcu.cache.num_entries,
              "number",
              "value"
            );
            const apcuMemSize = this.parseStorageValue(apcu.cache.mem_size);
            await this.setAndCreateState(
              `${serverId}.server.php.apcu.mem_size`,
              "APCu Cache Size",
              apcuMemSize.value,
              "number",
              "value.storage",
              apcuMemSize.unit
            );
            await this.setAndCreateState(
              `${serverId}.server.php.apcu.hits`,
              "APCu Hits",
              apcu.cache.num_hits,
              "number",
              "value"
            );
          }
        }
        if (srv.fpm) {
          const fpm = srv.fpm;
          await this.setAndCreateState(
            `${serverId}.server.fpm.active_processes`,
            "FPM Active Processes",
            fpm["active-processes"],
            "number",
            "value"
          );
          await this.setAndCreateState(
            `${serverId}.server.fpm.total_processes`,
            "FPM Total Processes",
            fpm["total-processes"],
            "number",
            "value"
          );
          await this.setAndCreateState(
            `${serverId}.server.fpm.idle_processes`,
            "FPM Idle Processes",
            fpm["idle-processes"],
            "number",
            "value"
          );
          await this.setAndCreateState(
            `${serverId}.server.fpm.accepted_conn`,
            "FPM Accepted Conn",
            fpm["accepted-conn"],
            "number",
            "value"
          );
          await this.setAndCreateState(
            `${serverId}.server.fpm.max_active`,
            "FPM Max Active",
            fpm["max-active-processes"],
            "number",
            "value"
          );
        }
        if (srv.database) {
          await this.setAndCreateState(
            `${serverId}.server.database.type`,
            "DB Type",
            srv.database.type,
            "string",
            "text"
          );
          await this.setAndCreateState(
            `${serverId}.server.database.version`,
            "DB Version",
            srv.database.version,
            "string",
            "info.firmware"
          );
          const dbSizeMB = Math.round(srv.database.size / 1024 / 1024 * 100) / 100;
          await this.setAndCreateState(
            `${serverId}.server.database.size`,
            "DB Size",
            dbSizeMB,
            "number",
            "value.storage",
            "MB"
          );
        }
      }
      if (data.activeUsers) {
        const au = data.activeUsers;
        await this.setAndCreateState(
          `${serverId}.activeUsers.last5min`,
          "Active Users (5 min)",
          au.last5minutes,
          "number",
          "value"
        );
        await this.setAndCreateState(
          `${serverId}.activeUsers.last1h`,
          "Active Users (1 h)",
          au.last1hour,
          "number",
          "value"
        );
        await this.setAndCreateState(
          `${serverId}.activeUsers.last24h`,
          "Active Users (24 h)",
          au.last24hours,
          "number",
          "value"
        );
        await this.setAndCreateState(
          `${serverId}.activeUsers.last1month`,
          "Active Users (1 month)",
          au.last1month,
          "number",
          "value"
        );
        await this.setAndCreateState(
          `${serverId}.activeUsers.last3month`,
          "Active Users (3 month)",
          au.last3months,
          "number",
          "value"
        );
        await this.setAndCreateState(
          `${serverId}.activeUsers.last6month`,
          "Active Users (6 month)",
          au.last6months,
          "number",
          "value"
        );
        await this.setAndCreateState(
          `${serverId}.activeUsers.lastyear`,
          "Active Users (Last Year)",
          au.lastyear,
          "number",
          "value"
        );
      }
      this.log.debug(`Monitoring (${serverId}): All data updated successfully.`);
    } catch (error) {
      if (error.response && error.response.status === 503) {
        this.log.info(`Nextcloud (${serverId}) is in maintenance mode.`);
      } else {
        this.log.error(`Error on server "${serverId}": ${error.message}`);
      }
      this.log.debug(`updateNextcloudData error for ${serverId}: ${error.stack || error}`);
    }
  }
  async setAndCreateState(id, nameKey, value, type, role, unit) {
    const translatedName = import_words.words[nameKey] || nameKey;
    this.log.debug(`setAndCreateState: ${id} value=${String(value)}`);
    if (!this.createdStates.has(id)) {
      await this.setObjectNotExistsAsync(id, {
        type: "state",
        common: {
          name: translatedName,
          type,
          role,
          read: true,
          write: false,
          ...unit !== void 0 ? { unit } : {}
        },
        native: {}
      });
      this.createdStates.add(id);
    }
    await this.setState(id, { val: value, ack: true });
  }
  /**
   * Wandelt einen Rohwert (Bytes oder Kilobytes) in einen numerischen Wert mit Einheit um.
   * Verarbeitet auch bereits formatierte Strings wie "495.72 MB".
   *
   * @param val The raw value (number in bytes/KB or already formatted string)
   * @param isKilobytes Whether the raw numerical value is in kilobytes
   */
  parseStorageValue(val, isKilobytes = false) {
    if (typeof val === "string") {
      const match = val.match(/^([\d.]+)\s*(\w+)$/);
      if (match) {
        return { value: parseFloat(match[1]), unit: match[2] };
      }
    }
    const numericValue = typeof val === "string" ? parseFloat(val) : Number(val);
    if (isNaN(numericValue) || numericValue <= 0) {
      return { value: 0, unit: "MB" };
    }
    const bytes = isKilobytes ? numericValue * 1024 : numericValue;
    const mb = bytes / (1024 * 1024);
    if (mb >= 1024) {
      return { value: parseFloat((mb / 1024).toFixed(2)), unit: "GB" };
    }
    return { value: parseFloat(mb.toFixed(2)), unit: "MB" };
  }
  onUnload(callback) {
    try {
      this.log.debug("onUnload: adapter is stopping, clearing interval");
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
  module.exports = (options) => new NextcloudMonitoring(options);
} else {
  (() => new NextcloudMonitoring())();
}
//# sourceMappingURL=main.js.map
