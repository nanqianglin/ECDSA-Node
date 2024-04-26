const express = require('express');
const { keccak256 } = require('ethereum-cryptography/keccak');
const {
  utf8ToBytes,
  hexToBytes,
  toHex,
} = require('ethereum-cryptography/utils');
const { secp256k1 } = require('ethereum-cryptography/secp256k1');

const app = express();
const cors = require('cors');
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  '0x2d20563f7df726ecac293d32584b35823bf31ebe': 100,
  '0x58e8070da67231f62df9f68fd3aa2bc3f3235705': 50,
  '0x70ce539e35196b64d9d91de5d8eb1b46db8ff483': 75,
};

function hashMessage(message) {
  const bytes = utf8ToBytes(message);
  const hash = keccak256(bytes);
  return hash;
}

const MSG = 'send token';
const HASH_MSG = hashMessage(MSG);

app.get('/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const { sender, recipient, amount, signature } = req.body;
  if (!(!!sender && !!recipient && !!amount && !!signature)) {
    return res.status(400).send({ message: 'Invalid parameters!' });
  }

  const userAddress = getAddressFromSignature(signature);

  if (userAddress === sender) {
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: 'Not enough funds!' });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(400).send({ message: 'Invalid signature!' });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function getAddressFromSignature(signature) {
  const pubKey = secp256k1.Signature.fromCompact(signature)
    .addRecoveryBit(0)
    .recoverPublicKey(HASH_MSG);
  const hash = keccak256(hexToBytes(pubKey.toHex()).slice(1));
  return '0x' + toHex(hash.slice(-20));
}
