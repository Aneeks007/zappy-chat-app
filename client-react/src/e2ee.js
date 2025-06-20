// client-react/src/utils/e2ee.js

export async function generateKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
  const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

  return {
    publicKey: btoa(String.fromCharCode(...new Uint8Array(publicKey))),
    privateKey: btoa(String.fromCharCode(...new Uint8Array(privateKey))),
  };
}

export async function importPublicKey(pem) {
  const binary = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  return window.crypto.subtle.importKey(
    "spki",
    binary,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"]
  );
}

export async function importPrivateKey(pem) {
  const binary = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  return window.crypto.subtle.importKey(
    "pkcs8",
    binary,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["decrypt"]
  );
}

export async function generateAESKey() {
  const key = await window.crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
  const raw = await window.crypto.subtle.exportKey("raw", key);
  return {
    key,
    raw: btoa(String.fromCharCode(...new Uint8Array(raw))),
  };
}

export async function encryptWithAES(key, data) {
  const enc = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(data)
  );
  return {
    ciphertext: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
    iv: btoa(String.fromCharCode(...iv)),
  };
}

export async function decryptWithAES(key, ciphertext, iv) {
  const dec = new TextDecoder();
  const data = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));
  const ivBytes = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBytes },
    key,
    data
  );
  return dec.decode(decrypted);
}

export async function encryptAESKeyWithRSA(publicKeyPem, aesRawKey) {
  const pubKey = await importPublicKey(publicKeyPem);
  const encrypted = await window.crypto.subtle.encrypt("RSA-OAEP", pubKey, Uint8Array.from(atob(aesRawKey), c => c.charCodeAt(0)));
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
}

export async function decryptAESKeyWithRSA(privateKeyPem, encryptedAES) {
  const privKey = await importPrivateKey(privateKeyPem);
  const data = Uint8Array.from(atob(encryptedAES), (c) => c.charCodeAt(0));
  const decrypted = await window.crypto.subtle.decrypt("RSA-OAEP", privKey, data);
  return await window.crypto.subtle.importKey("raw", decrypted, "AES-GCM", true, ["encrypt", "decrypt"]);
}
