// Optimized HTML5 Audio - single play, minimal latency

class OptimizedAudioEngine {
  private audioPools: Map<string, HTMLAudioElement[]> = new Map();
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    const samples = ['kick', 'snare', 'hihat', 'clap', 'tom', 'perc', 'crash', 'rim'];
    
    // Create pool of 3 audio elements per sample for polyphony
    for (const sample of samples) {
      const pool: HTMLAudioElement[] = [];
      
      for (let i = 0; i < 3; i++) {
        const audio = new Audio(`/samples/${sample}.wav`);
        audio.preload = 'auto';
        audio.volume = 0.8;
        audio.load();
        pool.push(audio);
      }
      
      this.audioPools.set(sample, pool);
    }

    // Wait a moment for preloading
    await new Promise(resolve => setTimeout(resolve, 300));

    // Unlock audio with silent play
    const unlock = new Audio('/samples/kick.wav');
    unlock.volume = 0.01;
    try {
      await unlock.play();
      unlock.pause();
    } catch (e) {
      // Ignore unlock errors
    }

    this.initialized = true;
    // REMOVED: alert(`✅ Ready! ${samples.length} samples loaded`);
  }

  playSound(sampleName: string) {
    if (!this.initialized) {
      return;
    }

    const pool = this.audioPools.get(sampleName);
    if (!pool) {
      return;
    }

    // Find a paused audio element (not currently playing)
    let audio = pool.find(a => a.paused);
    
    // If all are playing, use the first one (will cut it off)
    if (!audio) {
      audio = pool[0];
    }

    // Reset to start and play
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Silently fail
    });
  }

  isReady() {
    return this.initialized;
  }
}

export const audioEngine = new OptimizedAudioEngine();

export const createAudioContext = () => new AudioContext();
export const playSound = (_ctx: AudioContext, _freq: number, _type: string) => {};
