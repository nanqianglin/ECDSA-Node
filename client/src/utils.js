import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { toHex, utf8ToBytes } from 'ethereum-cryptography/utils';
import { keccak256 } from 'ethereum-cryptography/keccak';

export function getAddress(privateKey) {
  if (secp256k1.utils.isValidPrivateKey(privateKey)) {
    const pubKey = secp256k1.getPublicKey(privateKey);
    const hash = keccak256(pubKey.slice(1));
    return '0x' + toHex(hash.slice(-20));
  } else {
    return undefined;
  }
}
export function getPublicKey(privateKey) {
  if (secp256k1.utils.isValidPrivateKey(privateKey)) {
    return secp256k1.getPublicKey(privateKey);
  } else {
    return undefined;
  }
}

function hashMessage(message) {
  const bytes = utf8ToBytes(message);
  const hash = keccak256(bytes);
  return hash;
}

const MSG = 'send token';
export const HASH_MSG = hashMessage(MSG);

export async function signMessage(privateKey) {
  if (secp256k1.utils.isValidPrivateKey(privateKey)) {
    return secp256k1.sign(HASH_MSG, privateKey);
  } else {
    return '';
  }
}
