export type DrumType = 
  | 'kick' | 'snare' | 'hihat' | 'clap' | 'bass' | 'tom' 
  | 'crash' | 'rim' | 'perc' | 'shaker' | 'openhat' | 'cowbell' 
  | 'snap' | 'fx' | 'ride' | 'china' | 'splash' | 'vocal' | 'air' | 'sub';

export interface Pad {
  name: string;
  frequency: number;
  type: DrumType;
}

export interface DrumKit {
  name: string;
  pads: Pad[];
}

export const drumKits: Record<string, DrumKit> = {
  hiphop: {
    name: 'Hip Hop',
    pads: [
      { name: 'KICK', frequency: 60, type: 'kick' },
      { name: 'SNARE', frequency: 200, type: 'snare' },
      { name: 'HI-HAT', frequency: 8000, type: 'hihat' },
      { name: 'CLAP', frequency: 1000, type: 'clap' },
      { name: '808', frequency: 50, type: 'bass' },
      { name: 'TOM 1', frequency: 150, type: 'tom' },
      { name: 'TOM 2', frequency: 120, type: 'tom' },
      { name: 'CRASH', frequency: 6000, type: 'crash' },
      { name: 'RIM', frequency: 800, type: 'rim' },
      { name: 'PERC 1', frequency: 500, type: 'perc' },
      { name: 'PERC 2', frequency: 1500, type: 'perc' },
      { name: 'SHAKER', frequency: 10000, type: 'shaker' },
      { name: 'OPEN HH', frequency: 7000, type: 'openhat' },
      { name: 'COWBELL', frequency: 900, type: 'cowbell' },
      { name: 'SNAP', frequency: 2000, type: 'snap' },
      { name: 'FX', frequency: 300, type: 'fx' }
    ]
  },
  trap: {
    name: 'Trap',
    pads: [
      { name: 'KICK', frequency: 55, type: 'kick' },
      { name: 'SNARE', frequency: 220, type: 'snare' },
      { name: 'HI-HAT', frequency: 9000, type: 'hihat' },
      { name: 'CLAP', frequency: 1100, type: 'clap' },
      { name: '808', frequency: 45, type: 'bass' },
      { name: 'ROLL HH', frequency: 8500, type: 'hihat' },
      { name: 'SNARE 2', frequency: 240, type: 'snare' },
      { name: 'CRASH', frequency: 5500, type: 'crash' },
      { name: 'RIM', frequency: 850, type: 'rim' },
      { name: 'PERC 1', frequency: 600, type: 'perc' },
      { name: 'PERC 2', frequency: 1800, type: 'perc' },
      { name: 'SHAKER', frequency: 11000, type: 'shaker' },
      { name: 'OPEN HH', frequency: 7500, type: 'openhat' },
      { name: 'VOCAL', frequency: 400, type: 'vocal' },
      { name: 'AIR', frequency: 12000, type: 'air' },
      { name: 'SUB', frequency: 40, type: 'sub' }
    ]
  },
  acoustic: {
    name: 'Acoustic',
    pads: [
      { name: 'KICK', frequency: 65, type: 'kick' },
      { name: 'SNARE', frequency: 180, type: 'snare' },
      { name: 'HI-HAT', frequency: 7500, type: 'hihat' },
      { name: 'RIM', frequency: 750, type: 'rim' },
      { name: 'TOM 1', frequency: 140, type: 'tom' },
      { name: 'TOM 2', frequency: 110, type: 'tom' },
      { name: 'TOM 3', frequency: 85, type: 'tom' },
      { name: 'CRASH', frequency: 5000, type: 'crash' },
      { name: 'RIDE', frequency: 4000, type: 'ride' },
      { name: 'CHINA', frequency: 4500, type: 'china' },
      { name: 'SPLASH', frequency: 6500, type: 'splash' },
      { name: 'OPEN HH', frequency: 6800, type: 'openhat' },
      { name: 'PERC 1', frequency: 450, type: 'perc' },
      { name: 'PERC 2', frequency: 700, type: 'perc' },
      { name: 'COWBELL', frequency: 850, type: 'cowbell' },
      { name: 'CLAP', frequency: 950, type: 'clap' }
    ]
  }
};
