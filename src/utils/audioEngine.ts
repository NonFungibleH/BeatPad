import { audioSamples } from './audioSamples';

class WebAudioEngine {
  private context: AudioContext | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    console.log('🎵 Initializing Web Audio API...');

    try {
      // Create AudioContext during user interaction
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('📊 Context state:', this.context.state);

      // Resume if suspended (mobile requirement)
      if (this.context.state === 'suspended') {
        await this.context.resume();
        console.log('📊 Context resumed:', this.context.state);
      }

      // Decode all samples
      const decodePromises = Object.entries(audioSamples).map(async ([name, dataUrl]) => {
        try {
          console.log(`🔄 Decoding ${name}...`);
          
          // Extract base64 data
          const base64Data = dataUrl.split(',')[1];
          
          // Convert base64 to binary
          const binaryString = atob(base64Data);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          // Decode audio data
          const audioBuffer = await this.context!.decodeAudioData(bytes.buffer);
          this.buffers.set(name, audioBuffer);
          console.log(`✅ Loaded ${name} (${audioBuffer.duration.toFixed(2)}s)`);
        } catch (err) {
          console.error(`❌ Failed to decode ${name}:`, err);
        }
      });

      await Promise.all(decodePromises);

      this.initialized = true;
      console.log(`✅ Audio engine ready! Loaded ${this.buffers.size} samples`);
      
      // Play silent test to fully unlock
      this.playTestSound();
      
    } catch (error) {
      console.error('❌ Audio engine initialization failed:', error);
      throw error;
    }
  }

  private playTestSound() {
    if (!this.context) return;
    
    try {
      const oscillator = this.context.createOscillator();
      const gainNode = this.context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.context.destination);
      
      gainNode.gain.value = 0.01; // Very quiet
      oscillator.frequency.value = 440;
      
      oscillator.start();
      oscillator.stop(this.context.currentTime + 0.01);
      
      console.log('🔊 Test sound played');
    } catch (err) {
      console.warn('⚠️ Test sound failed:', err);
    }
  }

  playSound(sampleName: string) {
    if (!this.context || !this.initialized) {
      console.warn('⚠️ Audio not initialized');
      return;
    }

    const buffer = this.buffers.get(sampleName);
    if (!buffer) {
      console.warn(`⚠️ Sample not found: ${sampleName}`);
      console.log('Available samples:', Array.from(this.buffers.keys()));
      return;
    }

    try {
      // Create source node (instant playback)
      const source = this.context.createBufferSource();
      const gainNode = this.context.createGain();
      
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(this.context.destination);
      
      gainNode.gain.value = 0.8;
      
      source.start(0);
      console.log(`🔊 Playing ${sampleName}`);
    } catch (err) {
      console.error(`❌ Playback error for ${sampleName}:`, err);
    }
  }

  isReady() {
    return this.initialized;
  }
}

export const audioEngine = new WebAudioEngine();

// Legacy exports
export const createAudioContext = () => new AudioContext();
export const playSound = (_ctx: AudioContext, _freq: number, _type: string) => {
  // Deprecated
};
