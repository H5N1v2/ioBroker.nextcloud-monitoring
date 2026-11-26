/// <reference types="mocha" />

import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

/**
 * Log levels of the fake logger.
 */
type FakeLogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Minimaler Ausschnitt der Adapter-Basisklasse, der von den getesteten Code-Pfaden benutzt wird.
 */
interface TestableAdapter {
	config: Record<string, unknown>;
	logs: { level: FakeLogLevel; message: string }[];
	namespace: string;
	onReady: () => Promise<void>;
	updateAllServers: () => Promise<void>;
	updateNextcloudData: (id: string, apiClient: unknown, server: unknown) => Promise<void>;
	setObjectNotExistsAsync: (id: string, obj: unknown) => Promise<void>;
	getForeignObjectAsync: (id: string) => Promise<unknown>;
	extendForeignObjectAsync: (id: string, obj: unknown) => Promise<unknown>;
	repairPlainTextTokens: (servers: unknown[]) => Promise<number>;
	writeServersConfig: (servers: unknown[]) => Promise<void>;
	setInterval: (callback: () => unknown, timeout: number) => ioBroker.Interval;
}

/**
 * Ersatz für die Adapter-Basisklasse aus `@iobroker/adapter-core`.
 *
 * Die Bibliothek beendet den Prozess beim Import, wenn kein js-controller installiert ist
 * (`build/cjs/utils.js` ruft dann `process.exit(10)`). Für diese Unit-Tests genügt ein
 * minimaler Ersatz, der Logging und die Event-Registrierung nachbildet.
 */
class FakeAdapter {
	public namespace = 'nextcloud-monitoring.0';
	public readonly FORBIDDEN_CHARS = /\s|\./g;
	public config: Record<string, unknown> = {};
	public readonly logs: { level: FakeLogLevel; message: string }[] = [];

	public readonly log = {
		debug: (message: string): number => this.logs.push({ level: 'debug', message }),
		info: (message: string): number => this.logs.push({ level: 'info', message }),
		warn: (message: string): number => this.logs.push({ level: 'warn', message }),
		error: (message: string): number => this.logs.push({ level: 'error', message }),
	};

	public on(): this {
		return this;
	}
}

const nodeRequire = createRequire(__filename);
const adapterCorePath = nodeRequire.resolve('@iobroker/adapter-core');

/**
 * Lädt die Adapter-Factory aus `src/main.ts` mit der Fake-Basisklasse.
 *
 * Der Fake liegt nur für die Dauer des Ladevorgangs im Module-Cache und wird anschließend
 * wieder entfernt, damit andere Tests den unveränderten Cache-Zustand vorfinden. Ist
 * `@iobroker/adapter-core` bereits geladen, wird abgebrochen statt still den falschen
 * Kontext zu testen.
 */
function loadCreateAdapter(): (options?: Record<string, unknown>) => unknown {
	const previousEntry = nodeRequire.cache[adapterCorePath];

	if (previousEntry) {
		throw new Error(
			'Fake adapter-core cannot be installed: @iobroker/adapter-core is already loaded in this process.',
		);
	}

	try {
		nodeRequire.cache[adapterCorePath] = {
			id: adapterCorePath,
			filename: adapterCorePath,
			loaded: true,
			children: [],
			paths: [],
			exports: { Adapter: FakeAdapter },
		} as unknown as NodeModule;

		return nodeRequire('../main') as (options?: Record<string, unknown>) => unknown;
	} finally {
		if (previousEntry) {
			nodeRequire.cache[adapterCorePath] = previousEntry;
		} else {
			delete nodeRequire.cache[adapterCorePath];
		}
	}
}

const createAdapter = loadCreateAdapter();

/**
 * Erzeugt eine Adapter-Instanz und setzt die Konfiguration.
 *
 * @param config Adapter-Konfiguration für den Test
 */
function createTestAdapter(config: Record<string, unknown>): TestableAdapter {
	const adapter = createAdapter() as TestableAdapter;
	adapter.config = config;
	return adapter;
}

/**
 * Baut einen Server-Eintrag der Admin-Tabelle nach.
 *
 * @param name Anzeigename und Grundlage der Objekt-ID
 * @param token OCS-Token; absichtlich als `unknown`, um unbrauchbare Konfigurationen zu testen
 */
function testServer(name: string, token: unknown): Record<string, unknown> {
	return {
		name,
		domain: `${name.toLowerCase()}.example.com`,
		token,
		createWidget: false,
		widgetFontSize: 12,
		widgetDarkMode: false,
	};
}

/**
 * Führt einen Lauf aus und liefert eine eventuelle Rejection zurück.
 *
 * @param run Auszuführender Lauf
 */
async function captureFailure(run: () => Promise<void>): Promise<unknown> {
	try {
		await run();
	} catch (error) {
		return error;
	}
	return undefined;
}

describe('updateAllServers (Fehlerisolierung pro Server)', () => {
	it('verarbeitet den zweiten Server weiter, wenn das Device des ersten nicht angelegt werden kann', async () => {
		const adapter = createTestAdapter({
			interval: 5,
			skipApps: true,
			skipUpdate: true,
			servers: [testServer('ServerA', 'token-a'), testServer('ServerB', 'token-b')],
		});

		const objectCalls: string[] = [];
		const processed: string[] = [];

		adapter.setObjectNotExistsAsync = (id: string): Promise<void> => {
			objectCalls.push(id);
			if (id === 'ServerA') {
				return Promise.reject(new Error('Object DB write failed for ServerA'));
			}
			return Promise.resolve();
		};
		adapter.updateNextcloudData = (id: string): Promise<void> => {
			processed.push(id);
			return Promise.resolve();
		};

		const failure = await captureFailure(() => adapter.updateAllServers());

		assert.equal(failure, undefined, 'updateAllServers darf nicht rejecten');
		assert.deepEqual(objectCalls, ['ServerA', 'ServerB'], 'Für beide Server muss die Geräteanlage versucht werden');
		assert.deepEqual(processed, ['ServerB'], 'Der zweite Server muss verarbeitet werden');
		assert.ok(
			adapter.logs.some(entry => entry.level === 'error' && entry.message.includes('ServerA')),
			'Der Fehler muss mit Serverbezug protokolliert werden',
		);
	});

	it('verarbeitet die übrigen Server weiter, wenn die Konfiguration eines Servers unbrauchbar ist', async () => {
		const adapter = createTestAdapter({
			interval: 5,
			skipApps: true,
			skipUpdate: true,
			servers: [testServer('ServerA', 12345), testServer('ServerB', 'token-b')],
		});

		const processed: string[] = [];

		adapter.setObjectNotExistsAsync = (): Promise<void> => Promise.resolve();
		adapter.updateNextcloudData = (id: string): Promise<void> => {
			processed.push(id);
			return Promise.resolve();
		};

		const failure = await captureFailure(() => adapter.updateAllServers());

		assert.equal(failure, undefined, 'updateAllServers darf nicht rejecten');
		assert.deepEqual(processed, ['ServerB'], 'Der zweite Server muss verarbeitet werden');
		assert.ok(
			adapter.logs.some(entry => entry.level === 'error' && entry.message.includes('ServerA')),
			'Der Fehler muss mit Serverbezug protokolliert werden',
		);
	});
});

describe('Intervall-Callback', () => {
	it('fängt eine Rejection des geplanten Laufs ab und protokolliert sie', async () => {
		const adapter = createTestAdapter({
			interval: 5,
			skipApps: true,
			skipUpdate: true,
			servers: [testServer('ServerA', 'token-a')],
		});

		// Diese Pfade greifen auf die Object-DB zu und sind nicht Gegenstand dieses Tests.
		adapter.repairPlainTextTokens = (): Promise<number> => Promise.resolve(0);
		adapter.writeServersConfig = (): Promise<void> => Promise.resolve();
		adapter.getForeignObjectAsync = (): Promise<unknown> => Promise.resolve({ common: { language: 'en' } });
		adapter.extendForeignObjectAsync = (): Promise<unknown> => Promise.resolve();

		let runs = 0;
		adapter.updateAllServers = (): Promise<void> => {
			runs++;
			if (runs > 1) {
				return Promise.reject(new Error('Scheduled update failed'));
			}
			return Promise.resolve();
		};

		let intervalCallback: (() => unknown) | undefined;
		let intervalTimeout: number | undefined;
		adapter.setInterval = (callback: () => unknown, timeout: number): ioBroker.Interval => {
			intervalCallback = callback;
			intervalTimeout = timeout;
			return 0 as unknown as ioBroker.Interval;
		};

		await adapter.onReady();

		assert.equal(runs, 1, 'Der Erstlauf in onReady muss ausgeführt worden sein');
		assert.equal(intervalTimeout, 300000, 'Der Intervall-Callback muss mit 5 Minuten registriert werden');
		assert.equal(typeof intervalCallback, 'function', 'onReady muss einen Intervall-Callback registrieren');

		const failure = await captureFailure(async () => {
			await intervalCallback!();
		});
		// Zeitfenster, damit eine echte unbehandelte Rejection auffallen würde
		// (test/mocha.setup.js lässt unbehandelte Rejections den Test scheitern).
		await new Promise<void>((resolve): void => {
			setImmediate(resolve);
		});

		assert.equal(failure, undefined, 'Der Intervall-Callback darf nicht rejecten');
		assert.ok(
			adapter.logs.some(entry => entry.level === 'error' && entry.message.includes('Scheduled update failed')),
			'Der Fehler muss protokolliert werden',
		);
	});
});
