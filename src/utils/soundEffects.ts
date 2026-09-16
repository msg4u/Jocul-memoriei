// Web Audio API Sound Effects & Native Romanian Speech Reader Engine
// Calibrated with gentle pace, clear diction, and child-friendly tone (4-7 years old)

class SoundManager {
  private audioCtx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private voiceEnabled: boolean = true;
  private currentAudio: HTMLAudioElement | null = null;
  private clientAudioCache = new Map<string, HTMLAudioElement>();
  private pendingFetches = new Map<string, Promise<HTMLAudioElement | null>>();
  private speakingListeners = new Set<(isSpeaking: boolean, currentText?: string) => void>();
  private activeSpeakingText: string | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const savedSound = localStorage.getItem('aventura_sound_enabled');
      if (savedSound !== null) {
        this.soundEnabled = savedSound === 'true';
      }
      const savedVoice = localStorage.getItem('aventura_voice_enabled');
      if (savedVoice !== null) {
        this.voiceEnabled = savedVoice === 'true';
      }

      // Initialize speech synthesis voices listener early
      if ('speechSynthesis' in window) {
        this.cachedVoices = window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
          this.cachedVoices = window.speechSynthesis.getVoices();
        };
      }
    }
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('aventura_sound_enabled', String(this.soundEnabled));
    }
    return this.soundEnabled;
  }

  public toggleVoice(): boolean {
    this.voiceEnabled = !this.voiceEnabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('aventura_voice_enabled', String(this.voiceEnabled));
    }
    if (!this.voiceEnabled) {
      this.stopSpeaking();
    }
    return this.voiceEnabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public isVoiceEnabled(): boolean {
    return this.voiceEnabled;
  }

  // Playful card flip sound
  public playCardFlip() {
    if (!this.soundEnabled) return;
    this.initAudio();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const now = this.audioCtx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // safe
    }
  }

  // Joyful chime for a successful animal-habitat match
  public playMatchSuccess() {
    if (!this.soundEnabled) return;
    this.initAudio();
    if (!this.audioCtx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = this.audioCtx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();
        const start = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);

        osc.start(start);
        osc.stop(start + 0.36);
      });
    } catch {
      // safe
    }
  }

  // Gentle, friendly bonk for non-matching cards
  public playMismatch() {
    if (!this.soundEnabled) return;
    this.initAudio();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.22);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.23);
    } catch {
      // safe
    }
  }

  // Whimsical wind gust when cards shuffle
  public playWindGust() {
    if (!this.soundEnabled) return;
    this.initAudio();
    if (!this.audioCtx) return;

    try {
      const bufferSize = this.audioCtx.sampleRate * 0.45;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(850, this.audioCtx.currentTime + 0.25);
      filter.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.45);
      filter.Q.value = 3;

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.01, this.audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, this.audioCtx.currentTime + 0.15);
      gain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.45);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      whiteNoise.start();
    } catch {
      // safe
    }
  }

  // Grand celebratory fanfare on victory
  public playVictory() {
    if (!this.soundEnabled) return;
    this.initAudio();
    if (!this.audioCtx) return;

    try {
      const fanfare = [
        { f: 523.25, d: 0.15 }, // C5
        { f: 659.25, d: 0.15 }, // E5
        { f: 783.99, d: 0.15 }, // G5
        { f: 1046.5, d: 0.35 }, // C6
        { f: 880.0, d: 0.18 },  // A5
        { f: 1046.5, d: 0.5 },  // C6
      ];

      let t = this.audioCtx.currentTime;
      fanfare.forEach(note => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note.f, t);

        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

        osc.connect(gain);
        gain.connect(this.audioCtx!.destination);

        osc.start(t);
        osc.stop(t + note.d + 0.05);

        t += note.d * 0.9;
      });
    } catch {
      // safe
    }
  }

  public onSpeakingChange(listener: (isSpeaking: boolean, currentText?: string) => void): () => void {
    this.speakingListeners.add(listener);
    return () => {
      this.speakingListeners.delete(listener);
    };
  }

  private notifySpeakingState(isSpeaking: boolean, text?: string) {
    this.activeSpeakingText = isSpeaking ? (text || null) : null;
    this.speakingListeners.forEach(fn => fn(isSpeaking, this.activeSpeakingText || undefined));
  }

  public isCurrentlySpeaking(): boolean {
    return Boolean(this.activeSpeakingText);
  }

  private normalizeKey(text: string): string {
    return text
      .replace(/[🌪️🐻‍❄️🐪🐬🐒🎴💡✨⭐🎉🎊🏠🍽️❤️✅❌👍🌿]/g, '')
      .replace(/4–7\s*ani/gi, 'patru până la șapte ani')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  }

  // Pre-load audio to ensure INSTANT zero-delay playback upon clicking
  public async preload(text: string): Promise<void> {
    if (!text || typeof window === 'undefined') return;
    const key = this.normalizeKey(text);
    if (this.clientAudioCache.has(key) || this.pendingFetches.has(key)) return;

    const fetchPromise = (async (): Promise<HTMLAudioElement | null> => {
      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        if (!res.ok) return null;
        const data = await res.json();
        if (data && data.audioUrl) {
          const audio = new Audio();
          audio.src = data.audioUrl;
          audio.preload = 'auto';
          this.clientAudioCache.set(key, audio);
          return audio;
        }
        return null;
      } catch {
        return null;
      } finally {
        this.pendingFetches.delete(key);
      }
    })();

    this.pendingFetches.set(key, fetchPromise);
    await fetchPromise;
  }

  // Preload an array of texts sequentially with polite delays
  public async preloadBatch(texts: string[]): Promise<void> {
    for (const text of texts) {
      if (!text) continue;
      const key = this.normalizeKey(text);
      if (!this.clientAudioCache.has(key)) {
        await this.preload(text);
        await new Promise(r => setTimeout(r, 100));
      }
    }
  }

  // Playback using Native Romanian Female Voice with flawless Romanian diction and intonation
  public async speak(text: string, onEnd?: () => void) {
    if (!this.voiceEnabled || typeof window === 'undefined') {
      if (onEnd) onEnd();
      return;
    }

    // Stop any ongoing speech or audio
    this.stopSpeaking();

    const cleanText = text
      .replace(/[🌪️🐻‍❄️🐪🐬🐒🎴💡✨⭐🎉🎊🏠🍽️❤️✅❌👍🌿]/g, '')
      .replace(/4–7\s*ani/gi, 'patru până la șapte ani')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const key = this.normalizeKey(cleanText);
    this.notifySpeakingState(true, cleanText);

    let audioToPlay: HTMLAudioElement | null = null;

    // 1. Instant cache hit check (0 ms latency)
    if (this.clientAudioCache.has(key)) {
      audioToPlay = this.clientAudioCache.get(key)!;
    } else if (this.pendingFetches.has(key)) {
      audioToPlay = await this.pendingFetches.get(key)!;
    } else {
      // Fetch from Romanian neural TTS server endpoint
      const fetchPromise = (async (): Promise<HTMLAudioElement | null> => {
        try {
          const res = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: cleanText }),
          });
          if (!res.ok) return null;
          const data = await res.json();
          if (data && data.audioUrl) {
            const audio = new Audio();
            audio.src = data.audioUrl;
            audio.preload = 'auto';
            this.clientAudioCache.set(key, audio);
            return audio;
          }
          return null;
        } catch {
          return null;
        }
      })();

      this.pendingFetches.set(key, fetchPromise);
      audioToPlay = await fetchPromise;
      this.pendingFetches.delete(key);
    }

    // If native Romanian audio is ready, play directly
    if (audioToPlay) {
      try {
        this.currentAudio = audioToPlay;
        audioToPlay.currentTime = 0;

        const handleEnded = () => {
          this.currentAudio = null;
          this.notifySpeakingState(false);
          audioToPlay?.removeEventListener('ended', handleEnded);
          audioToPlay?.removeEventListener('error', handleError);
          if (onEnd) onEnd();
        };

        const handleError = () => {
          this.currentAudio = null;
          audioToPlay?.removeEventListener('ended', handleEnded);
          audioToPlay?.removeEventListener('error', handleError);
          this.speakWithSpeechSynthesis(cleanText, onEnd);
        };

        audioToPlay.addEventListener('ended', handleEnded);
        audioToPlay.addEventListener('error', handleError);

        const playPromise = audioToPlay.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            this.speakWithSpeechSynthesis(cleanText, onEnd);
          });
        }
        return;
      } catch {
        this.speakWithSpeechSynthesis(cleanText, onEnd);
        return;
      }
    }

    // Fallback to client Romanian speech synthesis if server is unreachable
    this.speakWithSpeechSynthesis(cleanText, onEnd);
  }

  // Find the absolute best Romanian voice available in client browser
  private getBestClientRomanianVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

    let voices = this.cachedVoices;
    if (!voices || voices.length === 0) {
      voices = window.speechSynthesis.getVoices();
      this.cachedVoices = voices;
    }
    if (!voices || voices.length === 0) return null;

    // 1. Natural / Online Romanian voice (Microsoft Alina Natural, Ioana Enhanced, Google română)
    const premiumRo = voices.find(v => {
      const name = v.name.toLowerCase();
      const lang = v.lang.toLowerCase().replace('_', '-');
      const isRo = lang.startsWith('ro') || name.includes('romanian') || name.includes('română');
      return isRo && (name.includes('natural') || name.includes('online') || name.includes('alina') || name.includes('ioana') || name.includes('google'));
    });
    if (premiumRo) return premiumRo;

    // 2. Any Romanian female voice
    const femaleRo = voices.find(v => {
      const name = v.name.toLowerCase();
      const lang = v.lang.toLowerCase().replace('_', '-');
      const isRo = lang.startsWith('ro') || name.includes('romanian') || name.includes('română');
      return isRo && (name.includes('female') || name.includes('maria') || name.includes('alina') || name.includes('ioana') || name.includes('carmen') || name.includes('elena'));
    });
    if (femaleRo) return femaleRo;

    // 3. Any Romanian voice
    const anyRo = voices.find(v => {
      const name = v.name.toLowerCase();
      const lang = v.lang.toLowerCase().replace('_', '-');
      return lang.startsWith('ro') || name.includes('romanian') || name.includes('română');
    });
    if (anyRo) return anyRo;

    return null;
  }

  private speakWithSpeechSynthesis(text: string, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      this.notifySpeakingState(false);
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ro-RO';
      utterance.rate = 0.88; // Gentle, storytelling pace adapted for 4-7 year olds
      utterance.pitch = 1.08; // Warm, friendly maternal intonation

      const roVoice = this.getBestClientRomanianVoice();
      if (roVoice) {
        utterance.voice = roVoice;
      }

      utterance.onend = () => {
        this.notifySpeakingState(false);
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        this.notifySpeakingState(false);
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.notifySpeakingState(false);
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking() {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {
        // Ignore pause errors
      }
      this.currentAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    this.notifySpeakingState(false);
  }
}

export const soundManager = new SoundManager();
