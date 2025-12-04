import { audioSamples } from './audioSamples';

class WebAudioEngine {
  private context: AudioContext | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private initialized = false;

  async initialize() {
    if (this.initialized) {
      alert('Already initialized');
      return;
    }

    try {
      alert('Starting audio init...');
      
      // Create AudioContext during user interaction
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      alert(`Context created. State: ${this.context.state}`);

      // Resume if suspended
      if (this.context.state === 'suspended') {
        await this.context.resume();
        alert(`Resumed. New state: ${this.context.state}`);
      }

      // Decode all samples
      const sampleNames = Object.keys(audioSamples);
      alert(`Decoding ${sampleNames.length} samples...`);
      
      const decodePromises = Object.entries(audioSamples).map(async ([name, dataUrl]) => {
        try {
          const base64Data = dataUrl.split(',')[1];
          const binaryString = atob(base64Data);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const audioBuffer = await this.context!.decodeAudioData(bytes.buffer);
          this.buffers.set(name, audioBuffer);
        } catch (err) {
          alert(`Failed to decode ${name}: ${err}`);
        }
      });

      await Promise.all(decodePromises);

      this.initialized = true;
      alert(`✅ Ready! Loaded ${this.buffers.size} samples`);
      
      // Play silent test
      try {
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();
        osc.connect(gain);
        gain.connect(this.context.destination);
        gain.gain.value = 0.01;
        osc.start();
        osc.stop(this.context.currentTime + 0.01);
      } catch (e) {
        alert(`Test sound failed: ${e}`);
      }
      
    } catch (error) {
      alert(`Init failed: ${error}`);
      throw error;
    }
  }

  playSound(sampleName: string) {
    if (!this.context || !this.initialized) {
      alert('Audio not ready!');
      return;
    }

    const buffer = this.buffers.get(sampleName);
    if (!buffer) {
      alert(`Sample "${sampleName}" not found!\nAvailable: ${Array.from(this.buffers.keys()).join(', ')}`);
      return;
    }

    try {
      const source = this.context.createBufferSource();
      const gainNode = this.context.createGain();
      
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(this.context.destination);
      
      gainNode.gain.value = 0.8;
      source.start(0);
      
    } catch (err) {
      alert(`Playback error: ${err}`);
    }
  }

  isReady() {
    return this.initialized;
  }
}

export const audioEngine = new WebAudioEngine();

export const createAudioContext = () => new AudioContext();
export const playSound = (_ctx: AudioContext, _freq: number, _type: string) => {
  // Deprecated
};
