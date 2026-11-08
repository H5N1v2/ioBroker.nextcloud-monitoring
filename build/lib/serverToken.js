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
var serverToken_exports = {};
__export(serverToken_exports, {
  AES_PREFIX: () => AES_PREFIX,
  isEncryptedToken: () => isEncryptedToken,
  isPlainTextToken: () => isPlainTextToken,
  resolveServerToken: () => resolveServerToken
});
module.exports = __toCommonJS(serverToken_exports);
const AES_PREFIX = "$/aes-192-cbc:";
function isEncryptedToken(value) {
  return typeof value === "string" && value.startsWith(AES_PREFIX);
}
function isPlainTextToken(value) {
  return typeof value === "string" && value.length > 0 && !isEncryptedToken(value) && /^[\x20-\x7E]+$/.test(value);
}
function resolveServerToken(configuredToken, storedToken) {
  if (typeof storedToken === "string" && isPlainTextToken(storedToken)) {
    const token = storedToken.trim();
    if (token) {
      return { token, needsEncryption: true };
    }
  }
  return { token: typeof configuredToken === "string" ? configuredToken.trim() : "", needsEncryption: false };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AES_PREFIX,
  isEncryptedToken,
  isPlainTextToken,
  resolveServerToken
});
//# sourceMappingURL=serverToken.js.map
