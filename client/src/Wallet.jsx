import { useEffect, useState } from 'react';

import server from './server';
import { getAddress, signMessage } from './utils';

BigInt.prototype['toJSON'] = function () {
  return this.toString();
};

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  signature,
  setSignature,
}) {
  const [privateKey, setPrivateKey] = useState('');

  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const address = getAddress(privateKey);
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  useEffect(() => {
    async function update() {
      const sig = await signMessage(privateKey);
      setSignature(sig?.toCompactHex?.());
    }
    update();
  }, [privateKey]);

  return (
    <div className="container wallet">
      <h1>Your Private Key</h1>

      <label>
        Private Key (it's just sign a message for the send transaction and we
        NEVER save your private key)
        <input
          placeholder="Type an private key"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <div className="address">Address: {address}</div>
      <div className="signature">
        Has Signature: {Boolean(signature).toString()}
      </div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
