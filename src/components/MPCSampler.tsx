import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import { drumKits } from '../config/drumKits';
import { createAudioContext, playSound } from '../utils/audioEngine';
import './MPCSampler.css';

interface MPCSamplerProps {
  onBeatCreated?: () => void;
}

export default function MPCSampler({ onBeatCreated }: MPCSamplerProps) {
  const { address } = useAccount();
  const [selectedKit, setSelectedKit] = useState('hiphop');
  const [activePads, setActivePads] = useState<Record<number, boolean>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [beatTitle, setBeatTitle] = useState('');

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    audioContextRef.current = createAudioContext();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handlePadTrigger = (padIndex: number) => {
    if (!audioContextRef.current) return;

    const pad = drumKits[selectedKit].pads[padIndex];
    setActivePads(prev => ({ ...prev, [padIndex]: true }));
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    playSound(audioContextRef.current, pad.frequency, pad.type);

    setTimeout(() => {
      setActivePads(prev => {
        const newState = { ...prev };
        delete newState[padIndex];
        return newState;
      });
    }, 150);
  };

  const startRecording = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = createAudioContext();
      }

      const dest = audioContextRef.current.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(dest.stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        setRecordedAudio(blob);
        setShowShareModal(true);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Error starting recording. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const playRecording = () => {
    if (!recordedAudio) return;

    const audio = new Audio(URL.createObjectURL(recordedAudio));
    audio.play();
    setIsPlaying(true);

    audio.onended = () => {
      setIsPlaying(false);
    };
  };

  const exportRecording = () => {
    if (!recordedAudio) return;

    const url = URL.createObjectURL(recordedAudio);
    const a = document.createElement('a');
    a.href = url;
    a.download = `based-beat-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareToFeed = async () => {
    if (!recordedAudio || !address) return;

    // TODO: Implement API call to backend
    // For now, just close modal and reset
    console.log('Sharing beat:', {
      title: beatTitle || 'Untitled Beat',
      creator: address,
      kit: selectedKit,
    });

    setShowShareModal(false);
    setBeatTitle('');
    if (onBeatCreated) {
      onBeatCreated();
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentKit = drumKits[selectedKit];

  return (
    <div className="mpc-container">
      {/* LCD Screen */}
      <div className="lcd-screen">
        <div className="lcd-content">
          <div className="lcd-text">{currentKit.name.toUpperCase()} KIT</div>
          <div className="lcd-status">
            {isRecording && (
              <>
                <span className="rec-indicator">●REC</span>
                <span className="rec-time">{formatTime(recordingTime)}</span>
              </>
            )}
            {!isRecording && recordedAudio && <span>READY TO SHARE</span>}
            {!isRecording && !recordedAudio && <span>TAP PADS TO PLAY</span>}
          </div>
        </div>
      </div>

      {/* Kit Selector */}
      <div className="kit-selector">
        <select
          value={selectedKit}
          onChange={(e) => setSelectedKit(e.target.value)}
          disabled={isRecording}
          className="kit-select"
        >
          {Object.entries(drumKits).map(([key, kit]) => (
            <option key={key} value={key}>
              {kit.name}
            </option>
          ))}
        </select>
      </div>

      {/* Pad Grid */}
      <div className="pad-grid">
        {currentKit.pads.map((pad, index) => (
          <button
            key={index}
            className={`pad ${activePads[index] ? 'active' : ''}`}
            onTouchStart={(e) => {
              e.preventDefault();
              handlePadTrigger(index);
            }}
            onMouseDown={() => handlePadTrigger(index)}
          >
            <span className="pad-number">{(index + 1).toString().padStart(2, '0')}</span>
            <span className="pad-name">{pad.name}</span>
          </button>
        ))}
      </div>

      {/* Hardware Controls */}
      <div className="hardware-controls">
        {!isRecording ? (
          <button
            className="hw-button record"
            onClick={startRecording}
            disabled={isPlaying}
          >
            <span className="button-icon">●</span>
            <span className="button-label">REC</span>
          </button>
        ) : (
          <button className="hw-button stop" onClick={stopRecording}>
            <span className="button-icon">■</span>
            <span className="button-label">STOP</span>
          </button>
        )}

        <button
          className="hw-button play"
          onClick={playRecording}
          disabled={!recordedAudio || isRecording || isPlaying}
        >
          <span className="button-icon">▶</span>
          <span className="button-label">PLAY</span>
        </button>

        <button
          className="hw-button export"
          onClick={exportRecording}
          disabled={!recordedAudio || isRecording}
        >
          <span className="button-icon">↓</span>
          <span className="button-label">SAVE</span>
        </button>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Share to Feed? 🔥</h2>
            <input
              type="text"
              placeholder="Beat title (optional)"
              value={beatTitle}
              onChange={(e) => setBeatTitle(e.target.value)}
              className="title-input"
            />
            <div className="modal-buttons">
              <button className="modal-btn primary" onClick={shareToFeed}>
                Share Beat
              </button>
              <button className="modal-btn secondary" onClick={exportRecording}>
                Just Export
              </button>
              <button
                className="modal-btn secondary"
                onClick={() => setShowShareModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
