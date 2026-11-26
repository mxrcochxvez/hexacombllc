/**
 * Cozy Vince Guaraldi–inspired autumn jazz trio synthesizer using the Web Audio API.
 * Zero external files or network requests; plays a warm F-major / D-minor swung
 * piano, upright bass, and brushed-drums Thanksgiving loop.
 */

const NOTE_FREQ: Record<string, number> = {
  C2: 65.41,
  D2: 73.42,
  E2: 82.41,
  F2: 87.31,
  G2: 98.0,
  A2: 110.0,
  Bb2: 116.54,
  B2: 123.47,
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  Bb3: 233.08,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  Bb4: 466.16,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
  A5: 880.0,
};

interface MelodyNote {
  /** Beat offset within the 32-beat (8-bar, 4/4) loop */
  beat: number;
  note: string;
  duration: number;
  velocity?: number;
}

interface ChordHit {
  beat: number;
  notes: string[];
  duration: number;
  velocity?: number;
}

interface BassNote {
  beat: number;
  note: string;
  duration: number;
}

// 8-bar cozy autumn jazz progression in F major (32 beats total)
// Bar 1: Fmaj7 | Bar 2: Dm7 | Bar 3: Gm7 | Bar 4: C9
// Bar 5: Am7   | Bar 6: Dm7 | Bar 7: Bbmaj7 | Bar 8: C13 -> turnaround
const CHORDS: ChordHit[] = [
  // Bar 1 - Fmaj7
  { beat: 0, notes: ["F3", "A3", "C4", "E4"], duration: 2.2, velocity: 0.42 },
  { beat: 2.66, notes: ["F3", "A3", "C4", "E4"], duration: 1.1, velocity: 0.34 },
  // Bar 2 - Dm7
  { beat: 4, notes: ["D3", "F3", "A3", "C4"], duration: 2.2, velocity: 0.4 },
  { beat: 6.66, notes: ["D3", "F3", "A3", "C4"], duration: 1.1, velocity: 0.32 },
  // Bar 3 - Gm7
  { beat: 8, notes: ["G3", "Bb3", "D4", "F4"], duration: 2.2, velocity: 0.4 },
  { beat: 10.66, notes: ["G3", "Bb3", "D4", "F4"], duration: 1.1, velocity: 0.34 },
  // Bar 4 - C9
  { beat: 12, notes: ["E3", "Bb3", "D4", "G4"], duration: 2.2, velocity: 0.42 },
  { beat: 14.66, notes: ["E3", "Bb3", "C4", "G4"], duration: 1.1, velocity: 0.34 },
  // Bar 5 - Am7
  { beat: 16, notes: ["A3", "C4", "E4", "G4"], duration: 2.2, velocity: 0.42 },
  { beat: 18.66, notes: ["A3", "C4", "E4", "G4"], duration: 1.1, velocity: 0.32 },
  // Bar 6 - Dm7
  { beat: 20, notes: ["D3", "F3", "A3", "C4"], duration: 2.2, velocity: 0.4 },
  { beat: 22.66, notes: ["F3", "A3", "C4", "E4"], duration: 1.1, velocity: 0.34 },
  // Bar 7 - Bbmaj7
  { beat: 24, notes: ["Bb3", "D4", "F4", "A4"], duration: 2.2, velocity: 0.44 },
  { beat: 26.66, notes: ["G3", "Bb3", "D4", "F4"], duration: 1.1, velocity: 0.36 },
  // Bar 8 - C13 turnaround
  { beat: 28, notes: ["E3", "Bb3", "D4", "A4"], duration: 2.0, velocity: 0.4 },
  { beat: 30.66, notes: ["E3", "Bb3", "C4", "G4"], duration: 1.1, velocity: 0.34 },
];

// Lilting, nostalgic Peanuts-style right-hand piano melody
const MELODY: MelodyNote[] = [
  // Bar 1 (Fmaj7)
  { beat: 0, note: "A4", duration: 0.85, velocity: 0.62 },
  { beat: 1, note: "C5", duration: 0.55, velocity: 0.68 },
  { beat: 1.66, note: "E5", duration: 0.9, velocity: 0.72 },
  { beat: 2.66, note: "D5", duration: 0.65, velocity: 0.64 },
  { beat: 3.33, note: "C5", duration: 0.6, velocity: 0.6 },
  // Bar 2 (Dm7)
  { beat: 4, note: "A4", duration: 1.5, velocity: 0.65 },
  { beat: 5.66, note: "G4", duration: 0.5, velocity: 0.56 },
  { beat: 6.33, note: "F4", duration: 0.7, velocity: 0.58 },
  { beat: 7.33, note: "A4", duration: 0.6, velocity: 0.62 },
  // Bar 3 (Gm7)
  { beat: 8, note: "Bb4", duration: 0.85, velocity: 0.66 },
  { beat: 9, note: "D5", duration: 0.6, velocity: 0.7 },
  { beat: 9.66, note: "C5", duration: 0.85, velocity: 0.64 },
  { beat: 10.66, note: "Bb4", duration: 0.65, velocity: 0.6 },
  { beat: 11.33, note: "A4", duration: 0.6, velocity: 0.58 },
  // Bar 4 (C9)
  { beat: 12, note: "G4", duration: 1.6, velocity: 0.64 },
  { beat: 14, note: "A4", duration: 0.6, velocity: 0.58 },
  { beat: 14.66, note: "Bb4", duration: 0.6, velocity: 0.62 },
  { beat: 15.33, note: "C5", duration: 0.6, velocity: 0.66 },
  // Bar 5 (Am7)
  { beat: 16, note: "E5", duration: 0.9, velocity: 0.72 },
  { beat: 17, note: "G5", duration: 0.6, velocity: 0.74 },
  { beat: 17.66, note: "E5", duration: 0.85, velocity: 0.68 },
  { beat: 18.66, note: "D5", duration: 0.65, velocity: 0.62 },
  { beat: 19.33, note: "C5", duration: 0.6, velocity: 0.6 },
  // Bar 6 (Dm7)
  { beat: 20, note: "D5", duration: 1.4, velocity: 0.66 },
  { beat: 21.66, note: "C5", duration: 0.55, velocity: 0.6 },
  { beat: 22.33, note: "A4", duration: 0.75, velocity: 0.62 },
  { beat: 23.33, note: "C5", duration: 0.6, velocity: 0.64 },
  // Bar 7 (Bbmaj7)
  { beat: 24, note: "F5", duration: 0.9, velocity: 0.74 },
  { beat: 25, note: "D5", duration: 0.6, velocity: 0.66 },
  { beat: 25.66, note: "C5", duration: 0.85, velocity: 0.64 },
  { beat: 26.66, note: "Bb4", duration: 0.65, velocity: 0.62 },
  { beat: 27.33, note: "A4", duration: 0.6, velocity: 0.6 },
  // Bar 8 (C13 turnaround)
  { beat: 28, note: "G4", duration: 1.2, velocity: 0.64 },
  { beat: 29.66, note: "A4", duration: 0.6, velocity: 0.6 },
  { beat: 30.33, note: "C5", duration: 0.6, velocity: 0.64 },
  { beat: 31.33, note: "G4", duration: 0.55, velocity: 0.54 },
];

// Gentle walking upright bassline
const BASS: BassNote[] = [
  { beat: 0, note: "F2", duration: 0.9 },
  { beat: 1, note: "A2", duration: 0.9 },
  { beat: 2, note: "C3", duration: 0.9 },
  { beat: 3, note: "E2", duration: 0.9 },
  { beat: 4, note: "D2", duration: 0.9 },
  { beat: 5, note: "F2", duration: 0.9 },
  { beat: 6, note: "A2", duration: 0.9 },
  { beat: 7, note: "A2", duration: 0.9 },
  { beat: 8, note: "G2", duration: 0.9 },
  { beat: 9, note: "Bb2", duration: 0.9 },
  { beat: 10, note: "D3", duration: 0.9 },
  { beat: 11, note: "D2", duration: 0.9 },
  { beat: 12, note: "C2", duration: 0.9 },
  { beat: 13, note: "E2", duration: 0.9 },
  { beat: 14, note: "G2", duration: 0.9 },
  { beat: 15, note: "Bb2", duration: 0.9 },
  { beat: 16, note: "A2", duration: 0.9 },
  { beat: 17, note: "C3", duration: 0.9 },
  { beat: 18, note: "E2", duration: 0.9 },
  { beat: 19, note: "G2", duration: 0.9 },
  { beat: 20, note: "D2", duration: 0.9 },
  { beat: 21, note: "F2", duration: 0.9 },
  { beat: 22, note: "A2", duration: 0.9 },
  { beat: 23, note: "C3", duration: 0.9 },
  { beat: 24, note: "Bb2", duration: 0.9 },
  { beat: 25, note: "D3", duration: 0.9 },
  { beat: 26, note: "G2", duration: 0.9 },
  { beat: 27, note: "Bb2", duration: 0.9 },
  { beat: 28, note: "C2", duration: 0.9 },
  { beat: 29, note: "G2", duration: 0.9 },
  { beat: 30, note: "Bb2", duration: 0.9 },
  { beat: 31, note: "C3", duration: 0.9 },
];

const TEMPO_BPM = 112;
const BEAT_SEC = 60 / TEMPO_BPM;
const LOOP_BEATS = 32;
const LOOP_SEC = LOOP_BEATS * BEAT_SEC;

export class ThanksgivingJazzEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private schedulerId: number | null = null;
  private nextLoopStart = 0;
  private volume = 0.45;
  private running = false;

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.volume;

      // Soft warm master filter to give that vintage vinyl/television parlor glow
      const warmth = this.ctx.createBiquadFilter();
      warmth.type = "lowpass";
      warmth.frequency.value = 3400;
      warmth.Q.value = 0.6;

      this.masterGain.connect(warmth);
      warmth.connect(this.ctx.destination);
      this.noiseBuffer = this.createBrushNoiseBuffer(this.ctx);
    }
    return this.ctx;
  }

  private createBrushNoiseBuffer(ctx: AudioContext): AudioBuffer {
    const length = Math.floor(ctx.sampleRate * 0.12);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (length * 0.45));
    }
    return buffer;
  }

  private schedulePianoNote(
    time: number,
    freq: number,
    durationSec: number,
    velocity: number,
  ) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    const oscFundamental = ctx.createOscillator();
    const oscOvertone = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    oscFundamental.type = "triangle";
    oscFundamental.frequency.setValueAtTime(freq, time);

    oscOvertone.type = "sine";
    oscOvertone.frequency.setValueAtTime(freq * 2, time);

    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.22, time);
    overtoneGain.gain.exponentialRampToValueAtTime(0.03, time + 0.18);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(Math.min(freq * 6, 4200), time);
    filter.frequency.exponentialRampToValueAtTime(
      Math.max(freq * 2, 700),
      time + durationSec,
    );

    const peak = Math.max(0.01, velocity * 0.24);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(peak, time + 0.014);
    gain.gain.exponentialRampToValueAtTime(
      peak * 0.42,
      time + Math.min(0.22, durationSec * 0.5),
    );
    gain.gain.exponentialRampToValueAtTime(0.0001, time + durationSec + 0.12);

    oscFundamental.connect(filter);
    oscOvertone.connect(overtoneGain);
    overtoneGain.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    oscFundamental.start(time);
    oscOvertone.start(time);
    oscFundamental.stop(time + durationSec + 0.16);
    oscOvertone.stop(time + durationSec + 0.16);
  }

  private scheduleBassNote(time: number, freq: number, durationSec: number) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, time);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(360, time);
    filter.frequency.exponentialRampToValueAtTime(160, time + durationSec);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(0.24, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + durationSec);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + durationSec + 0.05);
  }

  private scheduleBrushHit(time: number, accent: boolean) {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;
    const ctx = this.ctx;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(accent ? 5200 : 6600, time);
    bandpass.Q.value = 1.4;

    const gain = ctx.createGain();
    const peak = accent ? 0.045 : 0.026;
    gain.gain.setValueAtTime(peak, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + (accent ? 0.09 : 0.05));

    src.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(this.masterGain);
    src.start(time);
  }

  private scheduleLoop(loopStart: number) {
    for (const chord of CHORDS) {
      const t = loopStart + chord.beat * BEAT_SEC;
      const dur = chord.duration * BEAT_SEC;
      chord.notes.forEach((n, idx) => {
        const freq = NOTE_FREQ[n];
        if (freq) {
          // Slight arpeggiated roll like real piano fingers
          this.schedulePianoNote(t + idx * 0.012, freq, dur, chord.velocity ?? 0.36);
        }
      });
    }

    for (const m of MELODY) {
      const freq = NOTE_FREQ[m.note];
      if (!freq) continue;
      this.schedulePianoNote(
        loopStart + m.beat * BEAT_SEC,
        freq,
        m.duration * BEAT_SEC,
        m.velocity ?? 0.65,
      );
    }

    for (const b of BASS) {
      const freq = NOTE_FREQ[b.note];
      if (!freq) continue;
      this.scheduleBassNote(
        loopStart + b.beat * BEAT_SEC,
        freq,
        b.duration * BEAT_SEC,
      );
    }

    // Swung jazz ride/brush pattern across all 32 beats
    for (let beat = 0; beat < LOOP_BEATS; beat++) {
      const t = loopStart + beat * BEAT_SEC;
      const isBackbeat = beat % 2 === 1;
      this.scheduleBrushHit(t, isBackbeat);
      if (isBackbeat) {
        // Swung "skip" beat (2/3 of a beat)
        this.scheduleBrushHit(t + BEAT_SEC * 0.66, false);
      }
    }
  }

  public async start(): Promise<boolean> {
    const ctx = this.ensureContext();
    if (!ctx) return false;

    try {
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
    } catch {
      return false;
    }

    if (ctx.state !== "running") return false;
    if (this.running) return true;

    this.running = true;
    this.nextLoopStart = ctx.currentTime + 0.08;
    this.scheduleLoop(this.nextLoopStart);
    this.nextLoopStart += LOOP_SEC;

    this.schedulerId = window.setInterval(() => {
      if (!this.ctx || !this.running) return;
      if (this.ctx.currentTime + 2.5 >= this.nextLoopStart) {
        this.scheduleLoop(this.nextLoopStart);
        this.nextLoopStart += LOOP_SEC;
      }
    }, 500);

    return true;
  }

  public pause() {
    this.running = false;
    if (this.schedulerId !== null) {
      window.clearInterval(this.schedulerId);
      this.schedulerId = null;
    }
    if (this.ctx && this.ctx.state === "running") {
      void this.ctx.suspend();
    }
  }

  public setVolume(value: number) {
    this.volume = Math.max(0, Math.min(1, value));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        this.volume,
        this.ctx.currentTime,
        0.04,
      );
    }
  }

  public dispose() {
    this.pause();
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
      this.masterGain = null;
    }
  }
}
