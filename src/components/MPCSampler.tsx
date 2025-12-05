import { useState, useEffect, useRef } from 'react';
import { drumKits } from '../config/drumKits';
import { audioEngine } from '../utils/audioEngine';
import './MPCSampler.css';

export default function MPCSampler() {
  const [selectedKit, setSelectedKit] = useState('hiphop');
  const [activePads, setActivePads] = useState<Record<number, boolean>>({});
  const [showAudioPrompt, setShowAudioPrompt] = useState(true);
  const [showKitSelector, setShowKitSelector] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [metronomeOn, setMetronomeOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const lastTriggerTime = useRef<Map<number, number>>(new Map());
  const [equalizerBars, setEqualizerBars] = useState<number[]>(Array(16).fill(0));
  const [beatPosition, setBeatPosition] = useState(0); // 0-15 for 4 bars (16 beats)
  const metronomeInterval = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recordedEvents = useRef<Array<{time: number, padIndex: number}>>([]);
  const recordingStartTime = useRef<number>(0);
  const playbackTimeout = useRef<number | null>(null);

  // Create metronome click sounds
  const clickAudioHigh = useRef<HTMLAudioElement | null>(null);
  const clickAudioLow = useRef<HTMLAudioElement | null>(null);

  // Frequency patterns for different drum types
  const frequencyPatterns = {
    kick: [90, 75, 50, 30, 20, 15, 10, 8, 5, 3, 2, 1, 0, 0, 0, 0],
    snare: [20, 30, 60, 80, 90, 75, 50, 35, 20, 15, 10, 8, 5, 3, 2, 1],
    hihat: [5, 10, 20, 40, 60, 80, 90, 95, 85, 70, 55, 40, 25, 15, 8, 3],
    clap: [15, 25, 45, 70, 85, 90, 80, 60, 40, 25, 15, 10, 5, 3, 2, 1],
    tom: [70, 60, 45, 30, 20, 15, 12, 10, 7, 5, 3, 2, 1, 0, 0, 0],
    perc: [10, 20, 35, 50, 65, 75, 80, 70, 55, 40, 25, 15, 10, 5, 3, 1],
    crash: [20, 30, 45, 60, 75, 85, 90, 85, 75, 60, 45, 30, 20, 12, 7, 3],
    rim: [5, 15, 30, 50, 70, 85, 90, 80, 60, 40, 25, 15, 10, 5, 3, 1],
  };

  useEffect(() => {
  // High click for downbeats - use hihat sample for click
  clickAudioHigh.current = new Audio();
  clickAudioHigh.current.src = '/samples/hihat.wav';
  clickAudioHigh.current.volume = 0.5;
  
  // Low click for other beats
  clickAudioLow.current = new Audio();
  clickAudioLow.current.src = '/samples/hihat.wav';
  clickAudioLow.current.volume = 0.2;
}, []);

// Metronome with 16 beat positions
useEffect(() => {
  if (metronomeOn && audioEngine.isReady()) {
    const interval = (60 / tempo) * 1000;
    metronomeInterval.current = window.setInterval(() => {
      const nextPosition = (beatPosition + 1) % 16;
      
      // Play click sound
      const isDownbeat = nextPosition === 0 || nextPosition === 4 || nextPosition === 8 || nextPosition === 12;
      const clickSound = isDownbeat ? clickAudioHigh.current : clickAudioLow.current;
      
      if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
      }
      
      setBeatPosition(nextPosition);
      
      // Visual EQ spike on downbeats
      if (isDownbeat) {
        setEqualizerBars(Array(16).fill(70));
        setTimeout(() => setEqualizerBars(Array(16).fill(0)), 80);
      }
      
      if ('vibrate' in navigator && isDownbeat) {
        navigator.vibrate(5);
      }
    }, interval);
  } else {
    if (metronomeInterval.current) {
      clearInterval(metronomeInterval.current);
    }
    setBeatPosition(0);
    setEqualizerBars(Array(16).fill(0));
  }

  return () => {
    if (metronomeInterval.current) {
      clearInterval(metronomeInterval.current);
    }
  };
}, [metronomeOn, tempo, beatPosition]);

const enableAudio = async () => {
  try {
    await audioEngine.initialize();
    setShowAudioPrompt(false);
  } catch (error) {
    console.error('Audio enable error:', error);
  }
};

  const animateFrequencyPattern = (sampleType: string) => {
    const pattern = frequencyPatterns[sampleType as keyof typeof frequencyPatterns] || 
                    frequencyPatterns.perc;
    
    let frame = 0;
    const animate = () => {
      if (frame < 15) {
        const decay = 1 - (frame / 15);
        setEqualizerBars(pattern.map(val => val * decay));
        frame++;
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        if (!metronomeOn) {
          setEqualizerBars(Array(16).fill(0));
        }
      }
    };
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    animate();
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
    animateFrequencyPattern(pad.sample);

    // Record event if recording
    if (isRecording) {
      const eventTime = Date.now() - recordingStartTime.current;
      recordedEvents.current.push({ time: eventTime, padIndex });
    }

    setTimeout(() => {
      setActivePads(prev => {
        const newState = { ...prev };
        delete newState[padIndex];
        return newState;
      });
    }, 150);
  };

  const startRecording = () => {
    recordedEvents.current = [];
    recordingStartTime.current = Date.now();
    setIsRecording(true);
    setHasRecording(false);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordedEvents.current.length > 0) {
      setHasRecording(true);
    }
  };

  const playRecording = () => {
    if (recordedEvents.current.length === 0 || isPlaying) return;
    
    setIsPlaying(true);
    
    recordedEvents.current.forEach(event => {
      setTimeout(() => {
        handlePadTrigger(event.padIndex);
      }, event.time);
    });

    // Find max time to know when playback ends
    const maxTime = Math.max(...recordedEvents.current.map(e => e.time));
    playbackTimeout.current = window.setTimeout(() => {
      setIsPlaying(false);
    }, maxTime + 500);
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
        <span className="logo-based">Based</span>
        <span className="logo-beatpad">BeatPad</span>
      </div>

      <div className="lcd-screen-new">
        <div className="lcd-top-section" onClick={() => setShowKitSelector(true)}>
          <div className="kit-display">{currentKit.name.toUpperCase()} DRUMS</div>
          <div className="kit-hint">TAP TO CHANGE SAMPLE KIT</div>
        </div>

        <div className="lcd-eq-section">
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

          {/* 16 beat position indicators */}
          <div className="beat-indicators-16">
            {Array(16).fill(0).map((_, i) => (
              <div 
                key={i} 
                className={`beat-dot-16 ${i === beatPosition && metronomeOn ? 'active' : ''} ${
                  i === 0 || i === 4 || i === 8 || i === 12 ? 'downbeat' : ''
                }`}
              />
            ))}
          </div>
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

        <button 
          className={`control-button ${isRecording ? 'recording' : ''}`}
          onClick={isRecording ? stopRecording : startRecording}
        >
          <span className="button-icon">●</span>
          <span className="button-text">{isRecording ? 'STOP' : 'REC'}</span>
        </button>

        <button 
          className="control-button"
          onClick={playRecording}
          disabled={!hasRecording || isPlaying}
          style={{ opacity: hasRecording && !isPlaying ? 1 : 0.5 }}
        >
          <span className="button-icon">▶</span>
          <span className="button-text">PLAY</span>
        </button>
      </div>
    </div>
  );
}
