/**
 * Erkennung von unverschlüsselt gespeicherten OCS-Tokens.
 *
 * ioBroker verschlüsselt die in `encryptedNative` genannten Attribute beim Speichern und
 * entschlüsselt sie beim Adapterstart. Für das Multi-Server-Layout ist das der Pfad
 * `servers.token`. Werte, die vor der Aktivierung dieser Verschlüsselung - oder durch eine
 * Admin-Version ohne Unterstützung für verschachtelte Pfade - als Klartext gespeichert wurden,
 * liefert diese Entschlüsselung als unbrauchbaren Wert. Solche Werte werden hier erkannt,
 * damit sie einmalig in den verschlüsselten Zustand überführt werden können.
 */

/**
 * Präfix, das ioBroker vor einen mit AES-192-CBC verschlüsselten Wert setzt.
 */
export const AES_PREFIX = '$/aes-192-cbc:';

/**
 * Ergebnis der Token-Ermittlung für einen Server.
 */
export interface ServerTokenResolution {
	/** Für die API-Abfrage zu verwendender Token im Klartext */
	token: string;
	/** true, wenn der gespeicherte Wert noch unverschlüsselt ist und verschlüsselt werden muss */
	needsEncryption: boolean;
}

/**
 * Prüft, ob ein gespeicherter Wert bereits von ioBroker verschlüsselt wurde.
 *
 * @param value Rohwert aus dem Instanzobjekt
 * @returns true, wenn der Wert das Präfix der AES-Verschlüsselung trägt
 */
export function isEncryptedToken(value: unknown): boolean {
	return typeof value === 'string' && value.startsWith(AES_PREFIX);
}

/**
 * Prüft, ob ein gespeicherter Wert ein unverschlüsselter Token ist.
 *
 * Nextcloud App-Passwörter bestehen ausschließlich aus darstellbaren ASCII-Zeichen. Die alte
 * XOR-Verschlüsselung von ioBroker liefert dagegen beliebige Bytes, weshalb solche Werte hier
 * nicht als Klartext erkannt und damit auch nicht doppelt verschlüsselt werden.
 *
 * @param value Rohwert aus dem Instanzobjekt
 * @returns true, wenn der Wert als Klartext gespeichert wurde
 */
export function isPlainTextToken(value: unknown): boolean {
	return typeof value === 'string' && value.length > 0 && !isEncryptedToken(value) && /^[\x20-\x7E]+$/.test(value);
}

/**
 * Ermittelt den zu verwendenden Token eines Servers.
 *
 * @param configuredToken Token aus der Adapterkonfiguration, wie ihn ioBroker beim Start entschlüsselt hat
 * @param storedToken Rohwert des Tokens aus dem Instanzobjekt
 * @returns Token für die API-Abfrage und ob der gespeicherte Wert verschlüsselt werden muss
 */
export function resolveServerToken(configuredToken: unknown, storedToken: unknown): ServerTokenResolution {
	if (typeof storedToken === 'string' && isPlainTextToken(storedToken)) {
		const token = storedToken.trim();
		if (token) {
			return { token, needsEncryption: true };
		}
	}

	return { token: typeof configuredToken === 'string' ? configuredToken.trim() : '', needsEncryption: false };
}
