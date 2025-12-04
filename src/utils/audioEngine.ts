// Simple HTML5 Audio with aggressive preloading

class SimpleAudioEngine {
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    const samples = ['kick', 'snare', 'hihat', 'clap', 'tom', 'perc', 'crash', 'rim'];
    
    // Create and preload audio elements
    for (const sample of samples) {
      const audio = new Audio(`/samples/${sample}.wav`);
      audio.preload = 'auto';
      audio.load(); // Force load
      this.audioElements.set(sample, audio);
    }

    // Wait for all to load
    const loadPromises = Array.from(this.audioElements.values()).map(audio => {
      return new Promise((resolve) => {
        if (audio.readyState >= 2) {
          resolve(true);
        } else {
          audio.addEventListener('canplaythrough', () => resolve(true), { once: true });
          audio.addEventListener('error', () => resolve(false), { once: true });
        }
        // Timeout after 3 seconds
        setTimeout(() => resolve(true), 3000);
      });
    });

    await Promise.all(loadPromises);

    // Play silent audio to unlock
    const unlock = new Audio('/samples/kick.wav');
    unlock.volume = 0.01;
    try {
      await unlock.play();
      unlock.pause();
    } catch (e) {
      // Ignore
    }

    this.initialized = true;
    alert(`✅ Loaded ${this.audioElements.size} samples!`);
  }

  playSound(sampleName: string) {
    if (!this.initialized) {
      alert('Not initialized!');
      return;
    }

    const audio = this.audioElements.get(sampleName);
    if (!audio) {
      alert(`Sample ${sampleName} not found!`);
      return;
    }

    // Clone and play for instant response
    const sound = audio.cloneNode() as HTMLAudioElement;
    sound.volume = 0.8;
    sound.play().catch(err => {
      alert(`Play error: ${err.message}`);
    });
  }

  isReady() {
    return this.initialized;
  }
}

export const audioEngine = new SimpleAudioEngine();

export const createAudioContext = () => new AudioContext();
export const playSound = (_ctx: AudioContext, _freq: number, _type: string) => {};
