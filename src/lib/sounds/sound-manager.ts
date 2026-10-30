type SoundName = "click" | "success" | "error" | "warning" | "notification" | "navigation";

class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled = true;
  private volume = 0.5;
  private init() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)(); } catch { this.ctx = null; }
    }
  }
  setEnabled(v: boolean) { this.enabled = v; }
  setVolume(v: number) { this.volume = Math.max(0, Math.min(1, v)); }
  private tone(freq: number, dur: number, type: OscillatorType = "sine") {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const o = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.value = this.volume * 0.2;
      o.connect(g); g.connect(this.ctx.destination);
      o.start();
      o.stop(this.ctx.currentTime + dur);
    } catch {}
  }
  play(name: SoundName) {
    switch (name) {
      case "click": this.tone(800, 0.05); break;
      case "success": this.tone(660, 0.15); break;
      case "error": this.tone(220, 0.2, "square"); break;
      case "warning": this.tone(440, 0.15, "triangle"); break;
      case "notification": this.tone(880, 0.1); break;
      case "navigation": this.tone(520, 0.08); break;
    }
  }
  playClick() { this.play("click"); }
  playNavigation() { this.play("navigation"); }
  playSuccess() { this.play("success"); }
  playError() { this.play("error"); }
  playWarning() { this.play("warning"); }
  playNotification() { this.play("notification"); }
  playPaymentSuccess() { this.play("success"); }
  playPaymentFailure() { this.play("error"); }
  playBookingSuccess() { this.play("success"); }
  playSecurityAlert() { this.play("warning"); }
}
export const soundManager = new SoundManager();
