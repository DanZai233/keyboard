import * as Tone from 'tone';

class AudioService {
  private synth: Tone.PolySynth | null = null;
  private initialized = false;

  async init() {
    if (this.initialized) return;
    
    await Tone.start();
    
    // Create a polyphonic synth with a pleasant sound
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: "triangle"
      },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 1
      }
    }).toDestination();
    
    // Add some reverb for that "dreamy" feel
    const reverb = new Tone.Reverb({ decay: 2, wet: 0.3 }).toDestination();
    this.synth.connect(reverb);
    
    this.initialized = true;
  }

  playNote(note: string) {
    if (!this.initialized || !this.synth) return;
    this.synth.triggerAttack(note);
  }

  stopNote(note: string) {
    if (!this.initialized || !this.synth) return;
    this.synth.triggerRelease(note);
  }

  playClick() {
    // Mechanical switch sound simulation
    if (!this.initialized) return;
    const click = new Tone.MembraneSynth({
      envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.01 },
      volume: -20
    }).toDestination();
    click.triggerAttackRelease("C2", "32n");
  }
}

export const audioService = new AudioService();