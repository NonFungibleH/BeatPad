import { useEffect, useState } from 'react';
import sdk from '@farcaster/frame-sdk';
import MPCSampler from './components/MPCSampler';
import './App.css';

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        sdk.actions.ready();
        setIsReady(true);
      } catch (e) {
        setIsReady(true);
      }
    };
    init();
  }, []);

  if (!isReady) {
    return <div style={{ background: '#0a0a0a', minHeight: '100vh' }} />;
  }

  return <MPCSampler />;
}

export default App;
