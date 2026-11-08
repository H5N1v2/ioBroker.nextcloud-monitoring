/// <reference types="mocha" />

import assert from 'node:assert/strict';
import { AES_PREFIX, isEncryptedToken, isPlainTextToken, resolveServerToken } from './serverToken';

describe('serverToken', () => {
	describe('isEncryptedToken', () => {
		it('erkennt einen von ioBroker verschlüsselten Wert', () => {
			assert.equal(isEncryptedToken(`${AES_PREFIX}0123456789abcdef0123456789abcdef:abcdef`), true);
		});

		it('erkennt Klartext nicht als verschlüsselt', () => {
			assert.equal(isEncryptedToken('abcdefghijklmnopqrstuvwxyz0123456789'), false);
		});

		it('erkennt fehlende und leere Werte nicht als verschlüsselt', () => {
			assert.equal(isEncryptedToken(undefined), false);
			assert.equal(isEncryptedToken(null), false);
			assert.equal(isEncryptedToken(''), false);
		});
	});

	describe('isPlainTextToken', () => {
		it('erkennt einen Klartext-Token', () => {
			assert.equal(isPlainTextToken('AbCdEf1234567890'), true);
		});

		it('erkennt einen verschlüsselten Wert nicht als Klartext', () => {
			assert.equal(isPlainTextToken(`${AES_PREFIX}0123456789abcdef0123456789abcdef:abcdef`), false);
		});

		it('erkennt den alten XOR-Wert nicht als Klartext', () => {
			assert.equal(isPlainTextToken('ab\u0001cd\u00ffef'), false);
		});

		it('erkennt leere Werte nicht als Klartext', () => {
			assert.equal(isPlainTextToken(''), false);
			assert.equal(isPlainTextToken(undefined), false);
		});
	});

	describe('resolveServerToken', () => {
		it('verwendet einen unverschlüsselt gespeicherten Token und markiert ihn zur Verschlüsselung', () => {
			assert.deepEqual(resolveServerToken('unbrauchbarer-wert', 'KlartextToken123'), {
				token: 'KlartextToken123',
				needsEncryption: true,
			});
		});

		it('verwendet den entschlüsselten Token, wenn der gespeicherte Wert verschlüsselt ist', () => {
			assert.deepEqual(resolveServerToken('KlartextToken123', `${AES_PREFIX}0123456789abcdef:abcdef`), {
				token: 'KlartextToken123',
				needsEncryption: false,
			});
		});

		it('verschlüsselt einen bereits verschlüsselten Wert nicht erneut', () => {
			const resolution = resolveServerToken('KlartextToken123', `${AES_PREFIX}0123456789abcdef:abcdef`);
			assert.equal(resolution.needsEncryption, false);
		});

		it('verschlüsselt einen alten XOR-Wert nicht erneut', () => {
			assert.deepEqual(resolveServerToken('KlartextToken123', 'ab\u0001cd\u00ffef'), {
				token: 'KlartextToken123',
				needsEncryption: false,
			});
		});

		it('verwendet den entschlüsselten Token, wenn kein gespeicherter Wert vorhanden ist', () => {
			assert.deepEqual(resolveServerToken('KlartextToken123', undefined), {
				token: 'KlartextToken123',
				needsEncryption: false,
			});
		});

		it('schneidet Leerzeichen des gespeicherten Klartext-Tokens ab', () => {
			assert.deepEqual(resolveServerToken(undefined, '  KlartextToken123  '), {
				token: 'KlartextToken123',
				needsEncryption: true,
			});
		});

		it('verschlüsselt einen nur aus Leerzeichen bestehenden Wert nicht', () => {
			assert.deepEqual(resolveServerToken(undefined, '   '), { token: '', needsEncryption: false });
		});

		it('liefert einen leeren Token, wenn keine Konfiguration vorhanden ist', () => {
			assert.deepEqual(resolveServerToken(undefined, undefined), { token: '', needsEncryption: false });
		});
	});
});
