// HTML5 Audio-based engine (works in all mobile WebViews)

class AudioSampleEngine {
  private audioPool: Map<string, HTMLAudioElement[]> = new Map();
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    console.log('🎵 Initializing audio samples...');

    // List of samples to load (only ones we have)
    const samples = [
      'kick', 'snare', 'hihat', 'clap', 
      'tom', 'perc', 'crash', 'rim'
    ];

    // Create audio pool for each sample (5 instances for polyphony)
    for (const sample of samples) {
      const pool: HTMLAudioElement[] = [];
      
      for (let i = 0; i < 5; i++) {
        const audio = new Audio();
        audio.src = `/samples/${sample}.wav`;
        audio.preload = 'auto';
        audio.volume = 0.8;
        pool.push(audio);
      }
      
      this.audioPool.set(sample, pool);
    }

    // Unlock audio on iOS/WebView by playing silent audio
    try {
      const unlock = new Audio();
      unlock.src = '/samples/kick.wav';
      unlock.volume = 0.01;
      const playPromise = unlock.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        unlock.pause();
        unlock.currentTime = 0;
      }
      
      console.log('✅ Audio unlocked');
    } catch (e) {
      console.warn('⚠️ Audio unlock attempt:', e);
    }

    this.initialized = true;
    console.log('✅ Audio engine ready');
  }

  playSound(sampleName: string) {
    if (!this.initialized) {
      console.warn('⚠️ Audio not initialized');
      return;
    }

    const pool = this.audioPool.get(sampleName);
    if (!pool) {
      console.warn(`⚠️ Sample not found: ${sampleName}`);
      return;
    }

    // Find available audio element or use first one
    const audio = pool.find(a => a.paused || a.ended) || pool[0];
    
    audio.currentTime = 0;
    audio.play().catch(err => {
      console.error('❌ Play failed:', err);
    });
  }

  isReady() {
    return this.initialized;
  }
}

export const audioEngine = new AudioSampleEngine();

// Legacy exports (kept for backwards compatibility but not used)
export const createAudioContext = () => new AudioContext();
export const playSound = (_ctx: AudioContext, _freq: number, _type: string) => {
  // Deprecated - now using audioEngine.playSound()
};
