/**
 * RentPulse Client-Side Cryptographic Vault & Digital Tenancy Dossier Engine
 * Implements Phase 4 Milestone 4.3
 *
 * Security Standard:
 * - AES-GCM 256-bit symmetric encryption
 * - PBKDF2 key derivation (100,000 iterations, SHA-256)
 * - SHA-256 integrity hash verification
 * - Cross-environment support (Web Crypto API in Browser & Node.js)
 */

export interface TenancyDossierData {
  fullName: string;
  nationalIdNumber: string; // Sensitive NID / Smart Card
  dateOfBirth: string;
  fatherOrGuardianName: string;
  permanentAddressDistrict: string;
  presentAddressDhaka: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  occupation: "student" | "employed" | "freelancer" | "business";
  institutionOrEmployer: string;
  idCardNumberOrRoll: string;
  monthlyIncomeBdt: number;
  previousLandlordName?: string;
  previousLandlordPhone?: string;
  previousRentPaidBdt?: number;
  policeCimsConsentGiven: boolean;
  dossierCreatedAt: string;
}

export interface EncryptedVaultEnvelope {
  dossierId: string;
  dossierHash: string; // SHA-256 hash of plaintext payload
  ciphertextBase64: string;
  ivHex: string;
  saltHex: string;
  keyHint: string;
  isLocked: boolean;
  lockedAt?: string;
  policeCimsReady: boolean;
}

function getCrypto(): Crypto {
  if (typeof globalThis !== "undefined" && globalThis.crypto && globalThis.crypto.subtle) {
    return globalThis.crypto;
  }
  if (typeof window !== "undefined" && window.crypto && window.crypto.subtle) {
    return window.crypto;
  }
  throw new Error("Web Crypto API is not supported in this runtime.");
}

/**
 * Computes SHA-256 cryptographic digest of a string
 */
export async function computeSha256(text: string): Promise<string> {
  const cryptoObj = getCrypto();
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await cryptoObj.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Derives an AES-GCM 256-bit key from a user passphrase using PBKDF2
 */
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const cryptoObj = getCrypto();
  const enc = new TextEncoder();
  const keyMaterial = await cryptoObj.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return cryptoObj.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as unknown as BufferSource,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypts tenant dossier data using client-side AES-256-GCM
 */
export async function encryptDossier(
  data: TenancyDossierData,
  passphrase: string,
  dossierId = "DOS-2026-DHAKA-089"
): Promise<EncryptedVaultEnvelope> {
  const cryptoObj = getCrypto();
  const jsonString = JSON.stringify(data);
  const dossierHash = await computeSha256(jsonString);

  const salt = cryptoObj.getRandomValues(new Uint8Array(16));
  const iv = cryptoObj.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);

  const enc = new TextEncoder();
  const encryptedBuffer = await cryptoObj.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    enc.encode(jsonString)
  );

  const ciphertextBase64 = Buffer.from(encryptedBuffer).toString("base64");
  const ivHex = Array.from(iv).map((b) => b.toString(16).padStart(2, "0")).join("");
  const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, "0")).join("");

  return {
    dossierId,
    dossierHash,
    ciphertextBase64,
    ivHex,
    saltHex,
    keyHint: passphrase.slice(0, 2) + "***",
    isLocked: true,
    lockedAt: new Date().toISOString(),
    policeCimsReady: data.policeCimsConsentGiven,
  };
}

/**
 * Decrypts encrypted dossier payload using the vault key
 */
export async function decryptDossier(
  envelope: EncryptedVaultEnvelope,
  passphrase: string
): Promise<{ success: boolean; data?: TenancyDossierData; error?: string }> {
  try {
    const cryptoObj = getCrypto();

    // Convert hex salt and iv back to Uint8Array
    const saltBytes = new Uint8Array(
      envelope.saltHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );
    const ivBytes = new Uint8Array(
      envelope.ivHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );

    // Reconstruct ciphertext buffer
    const ciphertextBytes = Buffer.from(envelope.ciphertextBase64, "base64");

    const key = await deriveKey(passphrase, saltBytes);

    const decryptedBuffer = await cryptoObj.subtle.decrypt(
      { name: "AES-GCM", iv: ivBytes },
      key,
      ciphertextBytes
    );

    const dec = new TextDecoder();
    const decryptedJson = dec.decode(decryptedBuffer);
    const data: TenancyDossierData = JSON.parse(decryptedJson);

    // Verify hash integrity
    const recomputedHash = await computeSha256(decryptedJson);
    if (recomputedHash !== envelope.dossierHash) {
      return {
        success: false,
        error: "Cryptographic hash mismatch. Dossier data integrity has been tampered with.",
      };
    }

    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: "Decryption failed. Invalid vault passphrase or corrupted cipher payload.",
    };
  }
}

/**
 * Seed Dossier Data for testing and rapid demonstration
 */
export const SEED_TENANT_DOSSIER: TenancyDossierData = {
  fullName: "Abdullah Al Noman",
  nationalIdNumber: "5912-3849-2041-8932",
  dateOfBirth: "2001-08-14",
  fatherOrGuardianName: "Md. Rafiqul Islam",
  permanentAddressDistrict: "Chattogram Sadar",
  presentAddressDhaka: "House 24, Road 4, Block B, Bashundhara R/A, Dhaka",
  emergencyContactPhone: "+880 1711-234567",
  emergencyContactRelation: "Brother / Guardian",
  occupation: "student",
  institutionOrEmployer: "North South University (NSU) / ConceptX Lab",
  idCardNumberOrRoll: "NSU-CSE-2121894",
  monthlyIncomeBdt: 45000,
  previousLandlordName: "Engr. Zahidul Karim",
  previousLandlordPhone: "+880 1819-987654",
  previousRentPaidBdt: 12000,
  policeCimsConsentGiven: true,
  dossierCreatedAt: "2026-10-18T10:00:00.000Z",
};
