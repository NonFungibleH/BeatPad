import { DrumType } from '../config/drumKits';

export const createAudioContext = (): AudioContext => {
  return new (window.AudioContext || (window as any).webkitAudioContext)();
};

const createNoiseBuffer = (
  audioContext: AudioContext,
  duration: number
): AudioBuffer => {
  const bufferSize = audioContext.sampleRate * duration;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  
  return buffer;
};

export const playSound = (
  audioContext: AudioContext,
  frequency: number,
  type: DrumType,
  duration = 0.3
): void => {
  const now = audioContext.currentTime;

  switch (type) {
    case 'kick':
      {
        const kickOsc = audioContext.createOscillator();
        const kickGain = audioContext.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(frequency * 2, now);
        kickOsc.frequency.exponentialRampToValueAtTime(frequency * 0.5, now + 0.05);
        kickGain.gain.setValueAtTime(1, now);
        kickGain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        kickOsc.connect(kickGain).connect(audioContext.destination);
        kickOsc.start(now);
        kickOsc.stop(now + duration);
      }
      break;

    case 'snare':
      {
        const snareOsc = audioContext.createOscillator();
        const snareNoise = audioContext.createBufferSource();
        const snareGain = audioContext.createGain();
        const snareFilter = audioContext.createBiquadFilter();

        snareOsc.type = 'triangle';
        snareOsc.frequency.setValueAtTime(frequency, now);

        snareNoise.buffer = createNoiseBuffer(audioContext, 0.1);

        snareFilter.type = 'highpass';
        snareFilter.frequency.setValueAtTime(1000, now);

        snareGain.gain.setValueAtTime(0.5, now);
        snareGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        snareOsc.connect(snareGain);
        snareNoise.connect(snareFilter).connect(snareGain);
        snareGain.connect(audioContext.destination);

        snareOsc.start(now);
        snareOsc.stop(now + 0.15);
        snareNoise.start(now);
        snareNoise.stop(now + 0.15);
      }
      break;

    case 'hihat':
    case 'shaker':
      {
        const hatNoise = audioContext.createBufferSource();
        const hatGain = audioContext.createGain();
        const hatFilter = audioContext.createBiquadFilter();

        hatNoise.buffer = createNoiseBuffer(audioContext, 0.05);

        hatFilter.type = 'highpass';
        hatFilter.frequency.setValueAtTime(frequency, now);

        const hatDuration = 0.05;
        hatGain.gain.setValueAtTime(0.3, now);
        hatGain.gain.exponentialRampToValueAtTime(0.01, now + hatDuration);

        hatNoise.connect(hatFilter).connect(hatGain).connect(audioContext.destination);
        hatNoise.start(now);
        hatNoise.stop(now + hatDuration);
      }
      break;

    case 'openhat':
      {
        const hatNoise = audioContext.createBufferSource();
        const hatGain = audioContext.createGain();
        const hatFilter = audioContext.createBiquadFilter();

        hatNoise.buffer = createNoiseBuffer(audioContext, 0.3);

        hatFilter.type = 'highpass';
        hatFilter.frequency.setValueAtTime(frequency, now);

        hatGain.gain.setValueAtTime(0.3, now);
        hatGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        hatNoise.connect(hatFilter).connect(hatGain).connect(audioContext.destination);
        hatNoise.start(now);
        hatNoise.stop(now + 0.3);
      }
      break;

    case 'clap':
      {
        for (let i = 0; i < 3; i++) {
          const clapNoise = audioContext.createBufferSource();
          const clapGain = audioContext.createGain();
          const clapFilter = audioContext.createBiquadFilter();

          clapNoise.buffer = createNoiseBuffer(audioContext, 0.05);

          clapFilter.type = 'bandpass';
          clapFilter.frequency.setValueAtTime(1000, now);

          clapGain.gain.setValueAtTime(0.3, now + i * 0.025);
          clapGain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.025 + 0.05);

          clapNoise.connect(clapFilter).connect(clapGain).connect(audioContext.destination);
          clapNoise.start(now + i * 0.025);
        }
      }
      break;

    case 'bass':
    case 'sub':
      {
        const bassOsc = audioContext.createOscillator();
        const bassGain = audioContext.createGain();
        bassOsc.type = 'sine';
        bassOsc.frequency.setValueAtTime(frequency, now);
        bassGain.gain.setValueAtTime(0.8, now);
        bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        bassOsc.connect(bassGain).connect(audioContext.destination);
        bassOsc.start(now);
        bassOsc.stop(now + 0.6);
      }
      break;

    case 'tom':
      {
        const tomOsc = audioContext.createOscillator();
        const tomGain = audioContext.createGain();
        tomOsc.type = 'sine';
        tomOsc.frequency.setValueAtTime(frequency * 2, now);
        tomOsc.frequency.exponentialRampToValueAtTime(frequency, now + 0.1);
        tomGain.gain.setValueAtTime(0.7, now);
        tomGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        tomOsc.connect(tomGain).connect(audioContext.destination);
        tomOsc.start(now);
        tomOsc.stop(now + 0.4);
      }
      break;

    case 'crash':
    case 'ride':
    case 'china':
    case 'splash':
      {
        const crashNoise = audioContext.createBufferSource();
        const crashGain = audioContext.createGain();
        const crashFilter = audioContext.createBiquadFilter();

        crashNoise.buffer = createNoiseBuffer(audioContext, 2);

        crashFilter.type = 'highpass';
        crashFilter.frequency.setValueAtTime(frequency, now);

        crashGain.gain.setValueAtTime(0.3, now);
        crashGain.gain.exponentialRampToValueAtTime(0.01, now + 2);

        crashNoise.connect(crashFilter).connect(crashGain).connect(audioContext.destination);
        crashNoise.start(now);
      }
      break;

    default:
      {
        const defaultOsc = audioContext.createOscillator();
        const defaultGain = audioContext.createGain();
        defaultOsc.type = 'sine';
        defaultOsc.frequency.setValueAtTime(frequency, now);
        defaultGain.gain.setValueAtTime(0.3, now);
        defaultGain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        defaultOsc.connect(defaultGain).connect(audioContext.destination);
        defaultOsc.start(now);
        defaultOsc.stop(now + duration);
      }
  }
};
