/**
 * DEVCON17 Web Audio API Cosmic Ambient Soundscape & Visualizer
 */

export class CosmicAudioSynth {
  constructor(toggleBtnId) {
    this.btn = document.getElementById(toggleBtnId);
    this.audioCtx = null;
    this.isPlaying = false;
    this.oscillators = [];
    this.masterGain = null;
    this.analyser = null;
    this.animId = null;

    if (this.btn) {
      this.btn.addEventListener('click', () => this.toggle());
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
  }

  play() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.setValueAtTime(0.01, this.audioCtx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.2, this.audioCtx.currentTime + 2.5);

    // Analyser Node for spectrum visualizer
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 32;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(360, this.audioCtx.currentTime);

    this.masterGain.connect(filter);
    filter.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);

    // C minor 9 space chord frequencies (C3, G3, D4, Eb4, Bb4)
    const freqs = [130.81, 196.00, 293.66, 311.13, 466.16];

    this.oscillators = freqs.map((freq, i) => {
      const osc = this.audioCtx.createOscillator();
      const oscGain = this.audioCtx.createGain();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      osc.detune.setValueAtTime((Math.random() - 0.5) * 14, this.audioCtx.currentTime);

      oscGain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      osc.connect(oscGain);
      oscGain.connect(this.masterGain);

      osc.start();
      return osc;
    });

    this.isPlaying = true;
    if (this.btn) {
      this.btn.classList.add('playing');
      const icon = this.btn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-volume-high';
    }

    this.updateSpectrum();
  }

  updateSpectrum() {
    if (!this.isPlaying || !this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    const bars = document.querySelectorAll('#spectrum-container .spectrum-bar');
    bars.forEach((bar, idx) => {
      const val = dataArray[idx * 2] || 30;
      const heightPercent = Math.max(15, Math.min(100, (val / 255) * 100));
      bar.style.height = `${heightPercent}%`;
    });

    this.animId = requestAnimationFrame(() => this.updateSpectrum());
  }

  stop() {
    if (!this.audioCtx || !this.isPlaying) return;

    if (this.masterGain) {
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1);
      setTimeout(() => {
        this.oscillators.forEach(osc => osc.stop());
        this.oscillators = [];
        this.isPlaying = false;
        if (this.animId) cancelAnimationFrame(this.animId);
      }, 1000);
    } else {
      this.isPlaying = false;
    }

    if (this.btn) {
      this.btn.classList.remove('playing');
      const icon = this.btn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-volume-xmark';
    }
  }
}
