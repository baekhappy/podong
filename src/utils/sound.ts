type AudioCtxType = typeof AudioContext;

function getAudioContext(): AudioContext | null {
  try {
    const Ctx = (window.AudioContext || (window as unknown as { webkitAudioContext: AudioCtxType }).webkitAudioContext) as AudioCtxType;
    return new Ctx();
  } catch {
    return null;
  }
}

function playTone(ctx: AudioContext, freq: number, type: OscillatorType, duration: number, gain = 0.3, delay = 0) {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.connect(gainNode);
  gainNode.connect(ctx.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
  gainNode.gain.setValueAtTime(gain, ctx.currentTime + delay);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
  osc.start(ctx.currentTime + delay);
  osc.stop(ctx.currentTime + delay + duration);
}

function playNoise(ctx: AudioContext, duration: number, gain = 0.2, filterFreq = 2000, delay = 0) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = filterFreq;

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(gain, ctx.currentTime + delay);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);
  source.start(ctx.currentTime + delay);
  source.stop(ctx.currentTime + delay + duration);
}

const soundGenerators: Record<string, (ctx: AudioContext) => void> = {
  bark: (ctx) => {
    playNoise(ctx, 0.1, 0.4, 600);
    playTone(ctx, 180, 'sawtooth', 0.15, 0.2, 0.05);
  },
  meow: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(700, ctx.currentTime + 0.1);
    osc.frequency.linearRampToValueAtTime(500, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
  },
  oink: (ctx) => {
    playTone(ctx, 220, 'sawtooth', 0.1, 0.25);
    playTone(ctx, 180, 'sawtooth', 0.1, 0.2, 0.1);
    playTone(ctx, 160, 'sawtooth', 0.15, 0.2, 0.2);
  },
  moo: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.7);
  },
  tweet: (ctx) => {
    playTone(ctx, 1200, 'sine', 0.1, 0.2);
    playTone(ctx, 1600, 'sine', 0.1, 0.2, 0.12);
    playTone(ctx, 1400, 'sine', 0.1, 0.15, 0.24);
  },
  quack: (ctx) => {
    playTone(ctx, 350, 'sawtooth', 0.1, 0.3);
    playTone(ctx, 300, 'sawtooth', 0.1, 0.25, 0.12);
  },
  roar: (ctx) => {
    playNoise(ctx, 0.5, 0.4, 200);
    playTone(ctx, 80, 'sawtooth', 0.5, 0.35);
  },
  neigh: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(500, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(700, ctx.currentTime + 0.15);
    osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.4);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  },
  rain: (ctx) => {
    for (let i = 0; i < 8; i++) {
      playNoise(ctx, 0.05, 0.15, 1000 + Math.random() * 2000, i * 0.07);
    }
  },
  snow: (ctx) => {
    playTone(ctx, 600, 'sine', 0.3, 0.1);
    playTone(ctx, 800, 'sine', 0.3, 0.08, 0.1);
    playTone(ctx, 500, 'sine', 0.3, 0.06, 0.2);
  },
  shine: (ctx) => {
    playTone(ctx, 1000, 'sine', 0.25, 0.15);
    playTone(ctx, 1500, 'sine', 0.25, 0.12, 0.15);
    playTone(ctx, 2000, 'sine', 0.25, 0.1, 0.3);
  },
  patter: (ctx) => {
    for (let i = 0; i < 6; i++) {
      playNoise(ctx, 0.04, 0.2, 800 + Math.random() * 1200, i * 0.06);
    }
  },
  wind: (ctx) => {
    playNoise(ctx, 0.6, 0.25, 400);
    playNoise(ctx, 0.6, 0.15, 800, 0.1);
  },
  trickle: (ctx) => {
    for (let i = 0; i < 5; i++) {
      playTone(ctx, 800 + i * 100, 'sine', 0.08, 0.1, i * 0.1);
    }
  },
  gush: (ctx) => {
    playNoise(ctx, 0.5, 0.35, 600);
    playNoise(ctx, 0.4, 0.2, 1200, 0.1);
  },
  thunder: (ctx) => {
    playNoise(ctx, 0.3, 0.5, 150);
    playTone(ctx, 60, 'sawtooth', 0.4, 0.4);
    playNoise(ctx, 0.5, 0.3, 300, 0.15);
  },
  heartbeat: (ctx) => {
    playTone(ctx, 80, 'sine', 0.12, 0.4);
    playTone(ctx, 70, 'sine', 0.1, 0.1, 0.15);
    playTone(ctx, 80, 'sine', 0.12, 0.1, 0.5);
    playTone(ctx, 70, 'sine', 0.1, 0.1, 0.65);
  },
  bang: (ctx) => {
    playNoise(ctx, 0.2, 0.6, 300);
    playTone(ctx, 60, 'sine', 0.2, 0.5);
  },
  tap: (ctx) => {
    playNoise(ctx, 0.05, 0.4, 2000);
    playTone(ctx, 800, 'sine', 0.05, 0.2);
  },
  hammer: (ctx) => {
    playNoise(ctx, 0.08, 0.4, 500);
    playTone(ctx, 200, 'sawtooth', 0.1, 0.3);
    playNoise(ctx, 0.08, 0.4, 500, 0.3);
    playTone(ctx, 200, 'sawtooth', 0.1, 0.3, 0.4);
  },
  clang: (ctx) => {
    playTone(ctx, 1200, 'sawtooth', 0.15, 0.25);
    playTone(ctx, 800, 'sawtooth', 0.15, 0.2, 0.05);
    playTone(ctx, 1500, 'sawtooth', 0.12, 0.2, 0.3);
    playTone(ctx, 900, 'sawtooth', 0.1, 0.2, 0.35);
  },
  rustle: (ctx) => {
    playNoise(ctx, 0.3, 0.15, 3000);
    playNoise(ctx, 0.2, 0.1, 4000, 0.2);
  },
  bubble: (ctx) => {
    for (let i = 0; i < 5; i++) {
      playTone(ctx, 300 + i * 80, 'sine', 0.12, 0.12, i * 0.1);
    }
  },
  sizzle: (ctx) => {
    playNoise(ctx, 0.5, 0.3, 4000);
    playNoise(ctx, 0.4, 0.2, 6000, 0.1);
  },
  swish: (ctx) => {
    playNoise(ctx, 0.3, 0.15, 1500);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  },
  twinkle: (ctx) => {
    const notes = [1047, 1319, 1568, 2093];
    notes.forEach((freq, i) => playTone(ctx, freq, 'sine', 0.2, 0.15, i * 0.1));
  },
  flash: (ctx) => {
    playTone(ctx, 1800, 'square', 0.08, 0.05);
    playTone(ctx, 2400, 'square', 0.06, 0.05, 0.06);
  },
  spin: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.3);
    osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
  },
  crisp: (ctx) => {
    playNoise(ctx, 0.06, 0.3, 5000);
    playNoise(ctx, 0.06, 0.25, 5000, 0.08);
  },
  crunch: (ctx) => {
    playNoise(ctx, 0.08, 0.35, 3000);
    playNoise(ctx, 0.07, 0.3, 4000, 0.1);
  },
  slurp: (ctx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  },
  correct: (ctx) => {
    [523, 659, 784, 1047].forEach((f, i) => playTone(ctx, f, 'sine', 0.2, 0.25, i * 0.1));
  },
  wrong: (ctx) => {
    playTone(ctx, 300, 'sawtooth', 0.15, 0.3);
    playTone(ctx, 250, 'sawtooth', 0.15, 0.25, 0.2);
  },
  default: (ctx) => {
    playTone(ctx, 523, 'sine', 0.3, 0.2);
    playTone(ctx, 659, 'sine', 0.25, 0.2, 0.1);
  },
};

export function playSound(soundType: string): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  try {
    const generator = soundGenerators[soundType] ?? soundGenerators.default;
    generator(ctx);
  } catch {
    // silently fail
  }
}
