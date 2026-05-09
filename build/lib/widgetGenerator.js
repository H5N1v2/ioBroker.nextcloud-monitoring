"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var widgetGenerator_exports = {};
__export(widgetGenerator_exports, {
  WidgetGenerator: () => WidgetGenerator
});
module.exports = __toCommonJS(widgetGenerator_exports);
const I18N = {
  de: {
    ms: "\xDCberwachungsserver",
    instv: "Installierte Version",
    sysup: "System Update",
    newncv: "Neue Nextcloud Version",
    appupa: "App-Updates verf\xFCgbar",
    activeu: "aktive Nutzer (letzte 5 min)",
    db: "Datenbank",
    size: "Gr\xF6\xDFe",
    ws: "Webserver",
    st: "Storage",
    fsum: "Dateien gesamt",
    freesp: "Freier Speicher",
    sys: "System",
    cpuc: "CPU Kerne",
    cpul: "CPU Last (5m)",
    fmem: "RAM frei / gesamt",
    yes: "Ja",
    no: "Nein",
    act: "Aktuell",
    newv: "Neue Version",
    lastUpd: "Zuletzt aktualisiert",
    user: "Benutzer",
    typv: "Typ / Version"
  },
  en: {
    ms: "Monitoring Server",
    instv: "Installed Version",
    sysup: "System Update",
    newncv: "New Nextcloud Version",
    appupa: "App updates available",
    activeu: "active users (last 5 min)",
    db: "Database",
    size: "Size",
    ws: "Webserver",
    st: "Storage",
    fsum: "Total files",
    freesp: "Free space",
    sys: "System",
    cpuc: "CPU Cores",
    cpul: "CPU Load (5m)",
    fmem: "RAM free / total",
    yes: "Yes",
    no: "No",
    act: "Current",
    newv: "New Version",
    lastUpd: "Last updated",
    user: "User",
    typv: "Type / Version"
  },
  fr: {
    ms: "Serveur de surveillance",
    instv: "Version install\xE9e",
    sysup: "Mise \xE0 jour syst\xE8me",
    newncv: "Nouvelle version Nextcloud",
    appupa: "Mises \xE0 jour d'applications disponibles",
    activeu: "utilisateurs actifs (derni\xE8res 5 min)",
    db: "Base de donn\xE9es",
    size: "Taille",
    ws: "Serveur web",
    st: "Stockage",
    fsum: "Total des fichiers",
    freesp: "Espace libre",
    sys: "Syst\xE8me",
    cpuc: "C\u0153urs CPU",
    cpul: "Charge CPU (5m)",
    fmem: "RAM libre / totale",
    yes: "Oui",
    no: "Non",
    act: "Actuel",
    newv: "Nouvelle version",
    lastUpd: "Derni\xE8re mise \xE0 jour",
    user: "Utilisateur",
    typv: "Type / Version"
  },
  it: {
    ms: "Server di monitoraggio",
    instv: "Versione installata",
    sysup: "Aggiornamento del sistema",
    newncv: "Nuova versione Nextcloud",
    appupa: "Aggiornamenti app disponibili",
    activeu: "utenti attivi (ultimi 5 min)",
    db: "Database",
    size: "Dimensione",
    ws: "Webserver",
    st: "Archiviazione",
    fsum: "File totali",
    freesp: "Spazio libero",
    sys: "Sistema",
    cpuc: "Core CPU",
    cpul: "Carico CPU (5m)",
    fmem: "RAM libera / totale",
    yes: "S\xEC",
    no: "No",
    act: "Attuale",
    newv: "Nuova versione",
    lastUpd: "Ultimo aggiornamento",
    user: "Utente",
    typv: "Tipo / Versione"
  },
  es: {
    ms: "Servidor de monitoreo",
    instv: "Versi\xF3n instalada",
    sysup: "Actualizaci\xF3n del sistema",
    newncv: "Nueva versi\xF3n de Nextcloud",
    appupa: "Actualizaciones de aplicaciones disponibles",
    activeu: "usuarios activos (\xFAltimos 5 min)",
    db: "Base de datos",
    size: "Tama\xF1o",
    ws: "Servidor web",
    st: "Almacenamiento",
    fsum: "Total de archivos",
    freesp: "Espacio libre",
    sys: "Sistema",
    cpuc: "N\xFAcleos de CPU",
    cpul: "Carga de CPU (5m)",
    fmem: "RAM libre / total",
    yes: "S\xED",
    no: "No",
    act: "Actual",
    newv: "Nueva versi\xF3n",
    lastUpd: "\xDAltima actualizaci\xF3n",
    user: "Usuario",
    typv: "Tipo / Versi\xF3n"
  },
  nl: {
    ms: "Monitoringserver",
    instv: "Ge\xEFnstalleerde versie",
    sysup: "Systeemupdate",
    newncv: "Nieuwe Nextcloud-versie",
    appupa: "App-updates beschikbaar",
    activeu: "actieve gebruikers (laatste 5 min)",
    db: "Database",
    size: "Grootte",
    ws: "Webserver",
    st: "Opslag",
    fsum: "Totaal aantal bestanden",
    freesp: "Vrije ruimte",
    sys: "Systeem",
    cpuc: "CPU-kernen",
    cpul: "CPU-belasting (5m)",
    fmem: "RAM vrij / totaal",
    yes: "Ja",
    no: "Nee",
    act: "Actueel",
    newv: "Nieuwe versie",
    lastUpd: "Laatste update",
    user: "Gebruiker",
    typv: "Type / Versie"
  },
  pl: {
    ms: "Serwer monitoruj\u0105cy",
    instv: "Zainstalowana wersja",
    sysup: "Aktualizacja systemu",
    newncv: "Nowa wersja Nextcloud",
    appupa: "Dost\u0119pne aktualizacje aplikacji",
    activeu: "aktywni u\u017Cytkownicy (ostatnie 5 min)",
    db: "Baza danych",
    size: "Rozmiar",
    ws: "Serwer WWW",
    st: "Pami\u0119\u0107 masowa",
    fsum: "Wszystkich plik\xF3w",
    freesp: "Wolne miejsce",
    sys: "System",
    cpuc: "Rdzenie CPU",
    cpul: "Obci\u0105\u017Cenie CPU (5m)",
    fmem: "RAM wolny / ca\u0142kowity",
    yes: "Tak",
    no: "Nie",
    act: "Aktualnie",
    newv: "Nowa wersja",
    lastUpd: "Ostatnia aktualizacja",
    user: "U\u017Cytkownik",
    typv: "Typ / Wersja"
  },
  pt: {
    ms: "Servidor de monitoramento",
    instv: "Vers\xE3o instalada",
    sysup: "Atualiza\xE7\xE3o do sistema",
    newncv: "Nova vers\xE3o Nextcloud",
    appupa: "Atualiza\xE7\xF5es de aplicativos dispon\xEDveis",
    activeu: "usu\xE1rios ativos (\xFAltimos 5 min)",
    db: "Banco de dados",
    size: "Tamanho",
    ws: "Servidor web",
    st: "Armazenamento",
    fsum: "Total de arquivos",
    freesp: "Espa\xE7o livre",
    sys: "Sistema",
    cpuc: "N\xFAcleos de CPU",
    cpul: "Carga de CPU (5m)",
    fmem: "RAM livre / total",
    yes: "Sim",
    no: "N\xE3o",
    act: "Atual",
    newv: "Nova vers\xE3o",
    lastUpd: "\xDAltima atualiza\xE7\xE3o",
    user: "Usu\xE1rio",
    typv: "Tipo / Vers\xE3o"
  },
  ru: {
    ms: "\u0421\u0435\u0440\u0432\u0435\u0440 \u043C\u043E\u043D\u0438\u0442\u043E\u0440\u0438\u043D\u0433\u0430",
    instv: "\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u0430\u044F \u0432\u0435\u0440\u0441\u0438\u044F",
    sysup: "\u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u0438\u0441\u0442\u0435\u043C\u044B",
    newncv: "\u041D\u043E\u0432\u0430\u044F \u0432\u0435\u0440\u0441\u0438\u044F Nextcloud",
    appupa: "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u044B \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u044F \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0439",
    activeu: "\u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0438 (\u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 5 \u043C\u0438\u043D)",
    db: "\u0411\u0430\u0437\u0430 \u0434\u0430\u043D\u043D\u044B\u0445",
    size: "\u0420\u0430\u0437\u043C\u0435\u0440",
    ws: "\u0412\u0435\u0431-\u0441\u0435\u0440\u0432\u0435\u0440",
    st: "\u0425\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0435",
    fsum: "\u0412\u0441\u0435\u0433\u043E \u0444\u0430\u0439\u043B\u043E\u0432",
    freesp: "\u0421\u0432\u043E\u0431\u043E\u0434\u043D\u043E\u0435 \u043C\u0435\u0441\u0442\u043E",
    sys: "\u0421\u0438\u0441\u0442\u0435\u043C\u0430",
    cpuc: "\u042F\u0434\u0440\u0430 \u0426\u041F",
    cpul: "\u041D\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0426\u041F (5 \u043C\u0438\u043D)",
    fmem: "\u041E\u0417\u0423 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u043E / \u0432\u0441\u0435\u0433\u043E",
    yes: "\u0414\u0430",
    no: "\u041D\u0435\u0442",
    act: "\u0421\u0435\u0439\u0447\u0430\u0441",
    newv: "\u041D\u043E\u0432\u0430\u044F \u0432\u0435\u0440\u0441\u0438\u044F",
    lastUpd: "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0435\u0435 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435",
    user: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",
    typv: "\u0422\u0438\u043F / \u0412\u0435\u0440\u0441\u0438\u044F"
  },
  uk: {
    ms: "\u0421\u0435\u0440\u0432\u0435\u0440 \u043C\u043E\u043D\u0456\u0442\u043E\u0440\u0438\u043D\u0433\u0443",
    instv: "\u0412\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430 \u0432\u0435\u0440\u0441\u0456\u044F",
    sysup: "\u041E\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u0441\u0438\u0441\u0442\u0435\u043C\u0438",
    newncv: "\u041D\u043E\u0432\u0430 \u0432\u0435\u0440\u0441\u0456\u044F Nextcloud",
    appupa: "\u0414\u043E\u0441\u0442\u0443\u043F\u043D\u0456 \u043E\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F \u0434\u043E\u0434\u0430\u0442\u043A\u0456\u0432",
    activeu: "\u0430\u043A\u0442\u0438\u0432\u043D\u0456 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0456 (\u043E\u0441\u0442\u0430\u043D\u043D\u0456 5 \u0445\u0432)",
    db: "\u0411\u0430\u0437\u0430 \u0434\u0430\u043D\u0438\u0445",
    size: "\u0420\u043E\u0437\u043C\u0456\u0440",
    ws: "\u0412\u0435\u0431-\u0441\u0435\u0440\u0432\u0435\u0440",
    st: "\u0421\u0445\u043E\u0432\u0438\u0449\u0435",
    fsum: "\u0412\u0441\u044C\u043E\u0433\u043E \u0444\u0430\u0439\u043B\u0456\u0432",
    freesp: "\u0412\u0456\u043B\u044C\u043D\u0435 \u043C\u0456\u0441\u0446\u0435",
    sys: "\u0421\u0438\u0441\u0442\u0435\u043C\u0430",
    cpuc: "\u042F\u0434\u0440\u0430 \u0426\u041F",
    cpul: "\u041D\u0430\u0432\u0430\u043D\u0442\u0430\u0436\u0435\u043D\u043D\u044F \u0426\u041F (5 \u0445\u0432)",
    fmem: "\u041E\u0417\u041F \u0432\u0456\u043B\u044C\u043D\u043E / \u0432\u0441\u044C\u043E\u0433\u043E",
    yes: "\u0422\u0430\u043A",
    no: "\u041D\u0456",
    act: "\u0417\u0430\u0440\u0430\u0437",
    newv: "\u041D\u043E\u0432\u0430 \u0432\u0435\u0440\u0441\u0456\u044F",
    lastUpd: "\u041E\u0441\u0442\u0430\u043D\u043D\u0454 \u043E\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044F",
    user: "\u041A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447",
    typv: "\u0422\u0438\u043F / \u0412\u0435\u0440\u0441\u0456\u044F"
  },
  zh: {
    ms: "\u76D1\u63A7\u670D\u52A1\u5668",
    instv: "\u5DF2\u5B89\u88C5\u7248\u672C",
    sysup: "\u7CFB\u7EDF\u66F4\u65B0",
    newncv: "\u65B0\u7684 Nextcloud \u7248\u672C",
    appupa: "\u6709\u53EF\u7528\u7684\u5E94\u7528\u66F4\u65B0",
    activeu: "\u6D3B\u8DC3\u7528\u6237 (\u6700\u8FD15\u5206\u949F)",
    db: "\u6570\u636E\u5E93",
    size: "\u5BB9\u91CF",
    ws: "Web\u670D\u52A1\u5668",
    st: "\u5B58\u50A8",
    fsum: "\u6587\u4EF6\u603B\u6570",
    freesp: "\u53EF\u7528\u7A7A\u95F4",
    sys: "\u7CFB\u7EDF",
    cpuc: "CPU\u6838\u5FC3\u6570",
    cpul: "CPU \u8D1F\u8F7D (5\u5206\u949F)",
    fmem: "\u5185\u5B58 \u7A7A\u95F2 / \u603B\u8BA1",
    yes: "\u662F",
    no: "\u5426",
    act: "\u5F53\u524D",
    newv: "\u65B0\u7248\u672C",
    lastUpd: "\u6700\u540E\u66F4\u65B0",
    user: "\u7528\u6237",
    typv: "\u7C7B\u578B / \u7248\u672C"
  }
};
I18N["zh-cn"] = I18N.zh;
class WidgetGenerator {
  /**
   *
   * @param data The data object containing Nextcloud and server information
   * @param config The widget configuration object with settings like font size, dark mode, server name, and language
   */
  generateHtml(data, config) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v;
    const langKey = config.language === "zh-cn" ? "zh" : config.language;
    const lang = (_a = I18N[langKey]) != null ? _a : I18N.en;
    const nc = data == null ? void 0 : data.nextcloud;
    const sys = nc == null ? void 0 : nc.system;
    const srv = data == null ? void 0 : data.server;
    const au = data == null ? void 0 : data.activeUsers;
    const ncVersion = (_b = sys == null ? void 0 : sys.version) != null ? _b : "\u2014";
    const systemUpdate = Boolean((_c = sys == null ? void 0 : sys.update) == null ? void 0 : _c.available);
    const availableNew = ((_d = sys == null ? void 0 : sys.update) == null ? void 0 : _d.available_version) || null;
    const appsUpdates = (_f = (_e = sys == null ? void 0 : sys.apps) == null ? void 0 : _e.num_updates_available) != null ? _f : null;
    const active5 = (_g = au == null ? void 0 : au.last5minutes) != null ? _g : null;
    const dbSizeBytes = ((_h = srv == null ? void 0 : srv.database) == null ? void 0 : _h.size) != null ? Number(srv.database.size) : null;
    const dbType = (_j = (_i = srv == null ? void 0 : srv.database) == null ? void 0 : _i.type) != null ? _j : "\u2014";
    const dbVersion = (_l = (_k = srv == null ? void 0 : srv.database) == null ? void 0 : _k.version) != null ? _l : "";
    const phpVersion = (_n = (_m = srv == null ? void 0 : srv.php) == null ? void 0 : _m.version) != null ? _n : "\u2014";
    const webserver = (_o = srv == null ? void 0 : srv.webserver) != null ? _o : "\u2014";
    const numFiles = (_q = (_p = nc == null ? void 0 : nc.storage) == null ? void 0 : _p.num_files) != null ? _q : null;
    const numUsers = (_s = (_r = nc == null ? void 0 : nc.storage) == null ? void 0 : _r.num_users) != null ? _s : null;
    const freeSpaceBytes = this.parseSize(sys == null ? void 0 : sys.freespace, "B");
    const memFreeBytes = (sys == null ? void 0 : sys.mem_free) != null ? Number(sys.mem_free) * 1024 : null;
    const memTotalBytes = (sys == null ? void 0 : sys.mem_total) != null ? Number(sys.mem_total) * 1024 : null;
    const cpuNum = (_t = sys == null ? void 0 : sys.cpunum) != null ? _t : null;
    const cpuLoad5 = (_v = (_u = sys == null ? void 0 : sys.cpuload) == null ? void 0 : _u[1]) != null ? _v : null;
    const isNoUpdate = !availableNew || availableNew === "0" || availableNew === "false";
    const availableNewDisplay = isNoUpdate ? `<span class="dot ok" title="${this.esc(lang.act)}">\u25CF</span> ${this.esc(lang.act)}` : `<span class="dot warn" title="${this.esc(lang.newv)}">\u25CF</span> ${this.esc(String(availableNew))}`;
    const systemUpdateDisplay = systemUpdate ? `<span class="badge warn">\u2B06 ${this.esc(lang.yes)}</span>` : `<span class="badge ok">\u2713 ${this.esc(lang.no)}</span>`;
    const appsUpdatesDisplay = appsUpdates != null ? this.numberFmt(appsUpdates) : "\u2014";
    const timestamp = (/* @__PURE__ */ new Date()).toLocaleString();
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
        <div class="icon cloud">\u2601\uFE0F</div>
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
        <div class="muted">${active5 !== null ? this.numberFmt(active5) : "\u2014"}</div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">${this.esc(lang.db)}</div>
      <div class="row">
        <div class="icon db">\u{1F5C4}\uFE0F</div>
        <div style="flex:1">
          <div class="muted">${this.esc(lang.typv)}</div>
          <div class="stat">${this.esc(dbType)}${dbVersion ? ` (${this.esc(dbVersion)})` : ""}</div>
          <div style="margin-top:8px" class="muted">${this.esc(lang.size)}</div>
          <div class="stat">${this.humanBytes(dbSizeBytes)}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">${this.esc(lang.ws)} / PHP</div>
      <div class="row">
        <div class="icon server">\u{1F310}</div>
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
        <div class="icon storage">\u{1F4BE}</div>
        <div style="flex:1">
          <div class="muted">${this.esc(lang.fsum)}</div>
          <div class="stat">${numFiles !== null ? this.numberFmt(numFiles) : "\u2014"}</div>
          <div style="margin-top:8px" class="muted">${this.esc(lang.user)}</div>
          <div class="stat">${numUsers !== null ? this.numberFmt(numUsers) : "\u2014"}</div>
          <div style="margin-top:8px" class="muted">${this.esc(lang.freesp)}</div>
          <div class="stat">${this.humanBytes(freeSpaceBytes)}</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">${this.esc(lang.sys)}</div>
      <div class="row">
        <div class="icon cpu">\u2699\uFE0F</div>
        <div style="flex:1">
          <div class="muted">${this.esc(lang.cpuc)}</div>
          <div class="stat">${cpuNum !== null ? String(cpuNum) : "\u2014"}</div>
          <div style="margin-top:8px" class="muted">${this.esc(lang.cpul)}</div>
          <div class="stat">${cpuLoad5 !== null ? String(cpuLoad5) : "\u2014"}</div>
          <div style="margin-top:8px" class="muted">${this.esc(lang.fmem)}</div>
          <div class="stat">${memFreeBytes !== null ? this.humanBytes(memFreeBytes) : "\u2014"} / ${memTotalBytes !== null ? this.humanBytes(memTotalBytes) : "\u2014"}</div>
        </div>
      </div>
    </div>
  </div>
</div>`;
  }
  esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  humanBytes(bytes) {
    if (bytes === null || bytes === void 0 || isNaN(bytes)) {
      return "\u2014";
    }
    const units = ["B", "KB", "MB", "GB", "TB"];
    let i = 0;
    let n = Number(bytes);
    while (n >= 1024 && i < units.length - 1) {
      n /= 1024;
      i++;
    }
    return `${n.toFixed(n >= 10 ? 0 : 1)} ${units[i]}`;
  }
  parseSize(val, assumedUnit) {
    if (val === null || val === void 0 || val === "") {
      return null;
    }
    if (typeof val === "number") {
      if (!assumedUnit) {
        return val;
      }
      const u = assumedUnit.toUpperCase();
      if (u === "B") {
        return val;
      }
      if (u === "KB") {
        return val * 1024;
      }
      if (u === "MB") {
        return val * 1024 * 1024;
      }
      if (u === "GB") {
        return val * 1024 * 1024 * 1024;
      }
      if (u === "TB") {
        return val * 1024 * 1024 * 1024 * 1024;
      }
      return val;
    }
    if (typeof val === "string") {
      const s = val.trim();
      const m = s.match(/^([0-9.,]+)\s*([a-zA-Z]+)?$/);
      if (!m) {
        return null;
      }
      const num = parseFloat(m[1].replace(",", "."));
      const unit = (m[2] || "").toUpperCase();
      if (isNaN(num)) {
        return null;
      }
      if (!unit) {
        return assumedUnit ? this.parseSize(num, assumedUnit) : num;
      }
      if (unit === "B") {
        return num;
      }
      if (unit === "KB" || unit === "KIB") {
        return num * 1024;
      }
      if (unit === "MB" || unit === "MIB") {
        return num * 1024 * 1024;
      }
      if (unit === "GB" || unit === "GIB") {
        return num * 1024 * 1024 * 1024;
      }
      if (unit === "TB" || unit === "TIB") {
        return num * 1024 * 1024 * 1024 * 1024;
      }
      return num;
    }
    return null;
  }
  numberFmt(n) {
    if (n === null || n === void 0 || isNaN(n)) {
      return "\u2014";
    }
    return n.toLocaleString("de-DE");
  }
  buildCss(fontSize, darkMode) {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WidgetGenerator
});
//# sourceMappingURL=widgetGenerator.js.map
