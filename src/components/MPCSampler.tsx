import { useState, useEffect } from 'react';
import { drumKits } from '../config/drumKits';
import { audioEngine } from '../utils/audioEngine';
import './MPCSampler.css';

export default function MPCSampler() {
  const [selectedKit, setSelectedKit] = useState('hiphop');
  const [activePads, setActivePads] = useState<Record<number, boolean>>({});
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
    };
  }, []);

  const enableAudio = async () => {
    try {
      await audioEngine.initialize();
      setShowAudioPrompt(false);
    } catch (error) {
      alert(`Enable error: ${error}`);
    }
  };

  const handlePadTrigger = (padIndex: number) => {
    alert(`Pad ${padIndex} triggered!`); // DEBUG
    
    if (!audioEngine.isReady()) {
      return;
    }

    const pad = drumKits[selectedKit].pads[padIndex];
    setActivePads(prev => ({ ...prev, [padIndex]: true }));

    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    // Play sound
    alert(`Playing: ${pad.sample}`); // DEBUG
    audioEngine.playSound(pad.sample);

    setTimeout(() => {
      setActivePads(prev => {
        const newState = { ...prev };
        delete newState[padIndex];
        return newState;
      });
    }, 150);
  };

  const currentKit = drumKits[selectedKit];

  return (
    <div className="mpc-container">
      {showAudioPrompt && (
        <div className="audio-prompt-banner">
          <span>🔊 Tap to enable sound</span>
          <button className="audio-enable-btn" onClick={enableAudio}>
            Enable
          </button>
        </div>
      )}

      <div className="lcd-screen">
        <div className="lcd-content">
          <div className="lcd-text">{currentKit.name.toUpperCase()} KIT</div>
          <div className="lcd-status">
            <span>TAP PADS TO PLAY</span>
          </div>
        </div>
      </div>

      <div className="kit-selector">
        <select
          value={selectedKit}
          onChange={(e) => setSelectedKit(e.target.value)}
          className="kit-select"
        >
          {Object.entries(drumKits).map(([key, kit]) => (
            <option key={key} value={key}>
              {kit.name}
            </option>
          ))}
        </select>
      </div>

      <div className="pad-grid">
        {currentKit.pads.map((pad, index) => (
          <button
            key={index}
            className={`pad ${activePads[index] ? 'active' : ''}`}
            onTouchStart={(e) => {
              e.preventDefault();
              handlePadTrigger(index);
            }}
            onMouseDown={(e) => {
              e.preventDefault(); // ADDED
              handlePadTrigger(index);
            }}
          >
            <span className="pad-number">{(index + 1).toString().padStart(2, '0')}</span>
            <span className="pad-name">{pad.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
