import { useState } from 'react';
import { Beat } from '../types/beat';
import './Feed.css';

// Mock data for development
const mockBeats: Beat[] = [
  {
    id: '1',
    title: 'Fire Trap Beat',
    creatorAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
    creatorName: 'producer.base.eth',
    audioUrl: '',
    kitUsed: 'trap',
    duration: 45,
    plays: 234,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Boom Bap Classic',
    creatorAddress: '0x1234567890123456789012345678901234567890',
    audioUrl: '',
    kitUsed: 'hiphop',
    duration: 60,
    plays: 189,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Acoustic Jam',
    creatorAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
    creatorName: 'drummer.base.eth',
    audioUrl: '',
    kitUsed: 'acoustic',
    duration: 38,
    plays: 156,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function Feed() {
  const [beats] = useState<Beat[]>(mockBeats);
  const [sortBy] = useState<'latest' | 'trending' | 'popular'>('latest');

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getKitColor = (kit: string): string => {
    switch (kit) {
      case 'hiphop':
        return '#ff6b35';
      case 'trap':
        return '#a855f7';
      case 'acoustic':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="feed-container">
      <div className="feed-header">
        <h2 className="feed-title">Community Beats 🔥</h2>
        <div className="feed-sort">
          <button className={sortBy === 'latest' ? 'active' : ''}>Latest</button>
          <button className={sortBy === 'trending' ? 'active' : ''}>Trending</button>
          <button className={sortBy === 'popular' ? 'active' : ''}>Popular</button>
        </div>
      </div>

      <div className="feed-list">
        {beats.length === 0 ? (
          <div className="feed-empty">
            <p>No beats yet. Be the first to create! 🎵</p>
          </div>
        ) : (
          beats.map((beat) => (
            <div key={beat.id} className="beat-card">
              <div className="beat-waveform">
                {/* Placeholder waveform */}
                <div className="waveform-bars">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div
                      key={i}
                      className="waveform-bar"
                      style={{
                        height: `${Math.random() * 80 + 20}%`,
                        backgroundColor: getKitColor(beat.kitUsed),
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="beat-info">
                <div className="beat-header">
                  <h3 className="beat-title">{beat.title}</h3>
                  <span
                    className="beat-kit-badge"
                    style={{ backgroundColor: getKitColor(beat.kitUsed) }}
                  >
                    {beat.kitUsed}
                  </span>
                </div>

                <div className="beat-meta">
                  <span className="beat-creator">
                    {beat.creatorName || formatAddress(beat.creatorAddress)}
                  </span>
                  <span className="beat-separator">•</span>
                  <span className="beat-time">{formatTimeAgo(beat.createdAt)}</span>
                </div>

                <div className="beat-actions">
                  <button className="beat-play-btn">
                    <span className="play-icon">▶</span>
                    <span className="play-label">Play</span>
                  </button>
                  <div className="beat-stats">
                    <span className="stat">
                      <span className="stat-icon">👂</span>
                      {beat.plays}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="feed-cta">
        <p>Ready to create your own beat?</p>
        <button className="cta-button">Make a Beat 🔥</button>
      </div>
    </div>
  );
}
