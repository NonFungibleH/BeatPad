// Maximum speed HTML5 Audio engine

class FastAudioEngine {
  private audioPools: Map<string, HTMLAudioElement[]> = new Map();
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    const samples = ['kick', 'snare', 'hihat', 'clap', 'tom', 'perc', 'crash', 'rim'];
    
    // Create LARGER pool for better performance (10 instances per sample)
    for (const sample of samples) {
      const pool: HTMLAudioElement[] = [];
      
      for (let i = 0; i < 10; i++) {
        const audio = new Audio();
        audio.src = `/samples/${sample}.wav`;
        audio.preload = 'auto';
        audio.volume = 0.8;
        
        // Force immediate load
        audio.load();
        
        // Preload by playing silently
        if (i === 0) {
          audio.volume = 0;
          audio.play().then(() => {
            audio.pause();
            audio.currentTime = 0;
            audio.volume = 0.8;
          }).catch(() => {});
        }
        
        pool.push(audio);
      }
      
      this.audioPools.set(sample, pool);
    }

    // Longer preload time to ensure samples are fully loaded
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Aggressive unlock
    const unlock = new Audio('/samples/kick.wav');
    unlock.volume = 0.01;
    try {
      await unlock.play();
      unlock.pause();
    } catch (e) {
      // Ignore
    }

    this.initialized = true;
  }

  playSound(sampleName: string) {
    if (!this.initialized) {
      return;
    }

    const pool = this.audioPools.get(sampleName);
    if (!pool) {
      return;
    }

    // CRITICAL: Find first truly ready audio element
    let audio = pool.find(a => a.paused && a.readyState >= 3); // HAVE_FUTURE_DATA or better
    
    if (!audio) {
      // Fallback to any paused
      audio = pool.find(a => a.paused);
    }
    
    if (!audio) {
      // Last resort - use first one
      audio = pool[0];
    }

    try {
      // Play immediately without resetting currentTime (faster)
      if (audio.paused) {
        audio.currentTime = 0;
      }
      
      // Immediate play
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Retry once if failed
          audio!.currentTime = 0;
          audio!.play().catch(() => {});
        });
      }
    } catch (e) {
      // Silently fail
    }
  }

  isReady() {
    return this.initialized;
  }
}

export const audioEngine = new FastAudioEngine();

export const createAudioContext = () => new AudioContext();
export const playSound = (_ctx: AudioContext, _freq: number, _type: string) => {};
