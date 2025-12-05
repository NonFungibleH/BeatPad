import { useState, useEffect, useRef } from 'react';
import { drumKits } from '../config/drumKits';
import { audioEngine } from '../utils/audioEngine';
import './MPCSampler.css';

export default function MPCSampler() {
  const [selectedKit, setSelectedKit] = useState('hiphop');
  const [activePads, setActivePads] = useState<Record<number, boolean>>({});
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);
  const [showKitSelector, setShowKitSelector] = useState(false);
  const [volume, setVolume] = useState(80);
  const [tempo, setTempo] = useState(120);
  const [metronomeOn, setMetronomeOn] = useState(false);
  const lastTriggerTime = useRef<Map<number, number>>(new Map());
  const [equalizerBars, setEqualizerBars] = useState<number[]>(Array(16).fill(0));
  const metronomeInterval = useRef<number | null>(null);
  const clickAudio = useRef<HTMLAudioElement | null>(null);

  // Create metronome click sound
  useEffect(() => {
    clickAudio.current = new Audio();
    clickAudio.current.src = '/samples/rim.wav'; // Use rim sample for click
    clickAudio.current.volume = 0.3;
  }, []);

  // Metronome
  useEffect(() => {
    if (metronomeOn && audioEngine.isReady()) {
      const interval = (60 / tempo) * 1000;
      metronomeInterval.current = window.setInterval(() => {
        // Play click sound
        if (clickAudio.current) {
          clickAudio.current.currentTime = 0;
          clickAudio.current.play().catch(() => {});
        }
        
        // Visual
        setEqualizerBars(Array(16).fill(60));
        
        // Haptic
        if ('vibrate' in navigator) {
          navigator.vibrate(5);
        }
        
        setTimeout(() => setEqualizerBars(Array(16).fill(0)), 100);
      }, interval);
    } else {
      if (metronomeInterval.current) {
        clearInterval(metronomeInterval.current);
      }
      setEqualizerBars(Array(16).fill(0));
    }

    return () => {
      if (metronomeInterval.current) {
        clearInterval(metronomeInterval.current);
      }
    };
  }, [metronomeOn, tempo]);

  const enableAudio = async () => {
    try {
      await audioEngine.initialize();
      setShowAudioPrompt(false);
    } catch (error) {
      console.error('Audio enable error:', error);
    }
  };

  const handlePadTrigger = (padIndex: number) => {
    const now = Date.now();
    const lastTime = lastTriggerTime.current.get(padIndex) || 0;
    
    if (now - lastTime < 100) {
      return;
    }
    
    lastTriggerTime.current.set(padIndex, now);
    
    if (!audioEngine.isReady()) {
      return;
    }

    const pad = drumKits[selectedKit].pads[padIndex];
    setActivePads(prev => ({ ...prev, [padIndex]: true }));

    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    audioEngine.playSound(pad.sample);

    // Spike equalizer
    setEqualizerBars(Array(16).fill(0).map(() => 50 + Math.random() * 50));
    setTimeout(() => {
      if (!metronomeOn) {
        setEqualizerBars(Array(16).fill(0));
      }
    }, 150);

    setTimeout(() => {
      setActivePads(prev => {
        const newState = { ...prev };
        delete newState[padIndex];
        return newState;
      });
    }, 150);
  };

  const handleKitSelect = (kitKey: string) => {
    setSelectedKit(kitKey);
    setShowKitSelector(false);
  };

  const currentKit = drumKits[selectedKit];

  return (
    <div className="mpc-fullscreen">
      {showAudioPrompt && (
        <div className="audio-prompt-overlay">
          <div className="audio-prompt-card">
            <div className="prompt-icon">🔥</div>
            <h2>BeatPad</h2>
            <p>Tap to start making beats</p>
            <button className="audio-enable-btn" onClick={enableAudio}>
              Enable Audio
            </button>
          </div>
        </div>
      )}

      {showKitSelector && (
        <div className="kit-selector-modal" onClick={() => setShowKitSelector(false)}>
          <div className="kit-selector-content" onClick={(e) => e.stopPropagation()}>
            <h2>Choose Drum Kit</h2>
            <div className="kit-options">
              {Object.entries(drumKits).map(([key, kit]) => (
                <button
                  key={key}
                  className={`kit-option ${selectedKit === key ? 'selected' : ''}`}
                  onClick={() => handleKitSelect(key)}
                >
                  <span className="kit-name">{kit.name}</span>
                  {selectedKit === key && <span className="check-mark">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="beatpad-logo">
        <span className="logo-fire">🔥</span>
        <span className="logo-text">BeatPad</span>
      </div>

      <div className="lcd-screen-equalizer" onClick={() => setShowKitSelector(true)}>
        <div className="equalizer-container">
          {equalizerBars.map((height, i) => (
            <div key={i} className="eq-bar-wrapper">
              <div 
                className="eq-bar" 
                style={{ 
                  height: `${height}%`,
                  opacity: height > 0 ? 0.8 : 0.1
                }}
              />
            </div>
          ))}
        </div>
        <div className="lcd-overlay-text">
          <div className="kit-name-overlay">{currentKit.name.toUpperCase()}</div>
          <div className="tap-hint">TAP TO CHANGE KIT</div>
        </div>
      </div>

      <div className="pad-grid-large">
        {currentKit.pads.map((pad, index) => (
          <button
            key={index}
            className={`pad-large ${activePads[index] ? 'active' : ''}`}
            onTouchStart={(e) => {
              e.preventDefault();
              handlePadTrigger(index);
            }}
          >
            <span className="pad-number-large">{(index + 1).toString().padStart(2, '0')}</span>
            <span className="pad-name-large">{pad.name}</span>
          </button>
        ))}
      </div>

      <div className="control-panel">
        <div className="control-knob">
          <div className="knob-container">
            <div className="knob" style={{ transform: `rotate(${(volume / 100) * 270 - 135}deg)` }}>
              <div className="knob-indicator" />
            </div>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={volume} 
            onChange={(e) => setVolume(Number(e.target.value))}
            className="knob-slider"
          />
          <div className="knob-label">VOLUME</div>
          <div className="knob-value">{volume}</div>
        </div>

        <div className="control-knob">
          <div className="knob-container">
            <div className="knob" style={{ transform: `rotate(${((tempo - 60) / 180) * 270 - 135}deg)` }}>
              <div className="knob-indicator" />
            </div>
          </div>
          <input 
            type="range" 
            min="60" 
            max="240" 
            value={tempo} 
            onChange={(e) => setTempo(Number(e.target.value))}
            className="knob-slider"
          />
          <div className="knob-label">BPM</div>
          <div className="knob-value">{tempo}</div>
        </div>

        <button 
          className={`control-button ${metronomeOn ? 'active' : ''}`}
          onClick={() => setMetronomeOn(!metronomeOn)}
        >
          <span className="button-icon">{metronomeOn ? '⏸️' : '▶️'}</span>
          <span className="button-text">METRO</span>
        </button>

        <button className="control-button" onClick={() => setShowKitSelector(true)}>
          <span className="button-icon">🎛️</span>
          <span className="button-text">KITS</span>
        </button>
      </div>
    </div>
  );
}
