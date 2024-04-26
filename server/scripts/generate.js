const { secp256k1 } = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');
const { keccak256 } = require('ethereum-cryptography/keccak');

const privKey = secp256k1.utils.randomPrivateKey();
const pubKey = secp256k1.getPublicKey(privKey);

function getAddress(publicKey) {
  const hash = keccak256(publicKey.slice(1));
  return '0x' + toHex(hash.slice(-20));
}

console.log('private key:', toHex(privKey));
console.log('public key:', toHex(pubKey));
console.log('address: ', getAddress(pubKey));
