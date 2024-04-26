import Wallet from './Wallet';
import Transfer from './Transfer';
import './App.scss';
import { useState } from 'react';

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState();
  const [publicKey, setPublicKey] = useState();
  const [signature, setSignature] = useState();

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        signature={signature}
        setSignature={setSignature}
        setPublicKey={setPublicKey}
      />
      <Transfer
        setBalance={setBalance}
        address={address}
        signature={signature}
        publicKey={publicKey}
      />
    </div>
  );
}

export default App;
