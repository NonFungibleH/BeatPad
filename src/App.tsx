import { useState } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import MPCSampler from './components/MPCSampler';
import Feed from './components/Feed';
import './App.css';

const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
});

const queryClient = new QueryClient();

type Tab = 'create' | 'feed';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('create');

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={import.meta.env.VITE_ONCHAINKIT_API_KEY}
          chain={base}
        >
          <div className="app">
            <header className="app-header">
              <div className="logo">
                <span className="fire">🔥</span>
                <span className="title">BASED BEATS</span>
              </div>
              <div className="subtitle">by 3UILD</div>
            </header>

            <nav className="bottom-nav">
              <button
                className={`nav-button ${activeTab === 'create' ? 'active' : ''}`}
                onClick={() => setActiveTab('create')}
              >
                <span className="nav-icon">🎛️</span>
                <span className="nav-label">Create</span>
              </button>
              <button
                className={`nav-button ${activeTab === 'feed' ? 'active' : ''}`}
                onClick={() => setActiveTab('feed')}
              >
                <span className="nav-icon">📱</span>
                <span className="nav-label">Feed</span>
              </button>
            </nav>

            <main className="app-content">
              {activeTab === 'create' ? <MPCSampler /> : <Feed />}
            </main>
          </div>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
