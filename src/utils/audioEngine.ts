// Ultra-low latency Web Audio API engine with debugging

class WebAudioEngine {
  private context: AudioContext | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private initialized = false;

  async initialize() {
    if (this.initialized) {
      alert('Already initialized');
      return;
    }

    alert('Starting Web Audio initialization...');

    try {
      // Create AudioContext
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      alert(`AudioContext created. State: ${this.context.state}`);

      // Resume if suspended
      if (this.context.state === 'suspended') {
        await this.context.resume();
        alert(`Resumed. New state: ${this.context.state}`);
      }

      // Load all samples
      const samples = ['kick', 'snare', 'hihat', 'clap', 'tom', 'perc', 'crash', 'rim'];
      alert(`Loading ${samples.length} samples...`);
      
      const loadPromises = samples.map(async (sample) => {
        try {
          const url = `/samples/${sample}.wav`;
          alert(`Fetching ${url}...`);
          
          const response = await fetch(url);
          
          if (!response.ok) {
            alert(`Failed to fetch ${sample}: ${response.status}`);
            return;
          }
          
          const arrayBuffer = await response.arrayBuffer();
          alert(`Got ${sample} data: ${arrayBuffer.byteLength} bytes`);
          
          const audioBuffer = await this.context!.decodeAudioData(arrayBuffer);
          this.buffers.set(sample, audioBuffer);
          alert(`✅ Decoded ${sample}: ${audioBuffer.duration.toFixed(2)}s`);
          
        } catch (err) {
          alert(`❌ Error loading ${sample}: ${err}`);
        }
      });

      await Promise.all(loadPromises);

      this.initialized = true;
      alert(`✅ Ready! Loaded ${this.buffers.size} of ${samples.length} samples`);
      
    } catch (error) {
      alert(`❌ Init failed: ${error}`);
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
      alert(`Sample "${sampleName}" not found! Available: ${Array.from(this.buffers.keys()).join(', ')}`);
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
      
      console.log(`🔊 Playing ${sampleName}`);
      
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
export const playSound = (_ctx: AudioContext, _freq: number, _type: string) => {};
