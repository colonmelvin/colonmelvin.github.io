export interface AmbientSound {
  id: string;
  name: string;
  url: string;
  loop: boolean;
  volume: number;
}

// Ambient sound options - using web-based sources for now
export const ambientSounds: AmbientSound[] = [
  {
    id: 'keyboard',
    name: 'Keyboard Typing',
    url: '/sounds/keyboard-typing.mp3', // We'll create this
    loop: true,
    volume: 0.3,
  },
  {
    id: 'rain',
    name: 'Rain',
    url: '/sounds/rain.mp3',
    loop: true,
    volume: 0.4,
  },
  {
    id: 'cafe',
    name: 'Coffee Shop',
    url: '/sounds/cafe-ambience.mp3',
    loop: true,
    volume: 0.3,
  },
  {
    id: 'forest',
    name: 'Forest',
    url: '/sounds/forest.mp3',
    loop: true,
    volume: 0.4,
  },
];

class AudioManager {
  private audioContext: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private gainNode: GainNode | null = null;
  private isInitialized = false;
  private keyboardInterval: NodeJS.Timeout | null = null;
  private chatterInterval: NodeJS.Timeout | null = null;
  private birdInterval: NodeJS.Timeout | null = null;

  async initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;

    try {
      // Create audio context
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioContextClass();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.isInitialized = true;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Audio context initialized successfully');
      }
    } catch (error) {
      console.error('❌ Audio context initialization failed:', error);
      this.isInitialized = false;
    }
  }

  async playAmbientSound(soundId: string, volume: number = 0.5) {
    await this.initialize();
    
    if (!this.audioContext || !this.gainNode) {
      console.warn('Audio context not available');
      return;
    }

    // Stop current audio if playing
    this.stopCurrentAudio();

    const sound = ambientSounds.find(s => s.id === soundId);
    if (!sound) {
      console.warn(`Sound ${soundId} not found`);
      return;
    }

    try {
      // For now, let's use a simple approach with HTML Audio
      // We can enhance this later with Web Audio API for better control
      this.currentAudio = new Audio();
      this.currentAudio.src = this.generateAmbientAudio();
      this.currentAudio.loop = sound.loop;
      this.currentAudio.volume = Math.min(volume * sound.volume, 1);
      
      // Resume audio context if suspended (required by browsers)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      await this.currentAudio.play();
    } catch (error) {
      console.warn('Failed to play ambient sound:', error);
    }
  }

  setVolume(volume: number) {
    if (this.currentAudio) {
      this.currentAudio.volume = Math.min(volume, 1);
    }
  }

  stopCurrentAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  // Generate procedural ambient audio using Web Audio API
  private generateAmbientAudio(): string {
    if (!this.audioContext) return '';

    // For now, return empty string - we'll implement procedural generation
    // or use actual audio files
    return '';
  }

  // Simple test method to verify audio is working
  async testAudio() {
    console.log('🧪 Testing audio system...');
    
    await this.initialize();
    
    if (!this.audioContext) {
      console.error('❌ Audio context not available');
      return false;
    }
    
    console.log('✅ Audio context state:', this.audioContext.state);
    
    try {
      // Resume audio context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
        console.log('✅ Audio context resumed');
      }
      
      // Create a simple test tone
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // A4 note
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
      
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.5);
      
      console.log('✅ Test tone played successfully');
      return true;
    } catch (error) {
      console.error('❌ Test audio failed:', error);
      return false;
    }
  }

  // Create simple procedural ambient sounds
  async createProceduralAmbient(type: 'rain' | 'keyboard' | 'cafe' | 'forest', volume: number = 0.5) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎵 AudioManager: Creating ${type} sound at volume ${volume}`);
    }
    
    await this.initialize();
    
    if (!this.audioContext || !this.gainNode) {
      console.error('❌ Audio context not available');
      return;
    }

    // Resume audio context if suspended (required by browsers)
    if (this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Audio context resumed');
        }
      } catch (error) {
        console.error('❌ Failed to resume audio context:', error);
        return;
      }
    }

    this.stopAll();

    try {
      switch (type) {
        case 'rain':
          if (process.env.NODE_ENV === 'development') {
            console.log('🌧️ Creating rain sound');
          }
          this.createRainSound(volume);
          break;
        case 'keyboard':
          if (process.env.NODE_ENV === 'development') {
            console.log('⌨️ Creating keyboard sound');
          }
          this.createKeyboardSound(volume);
          break;
        case 'cafe':
          if (process.env.NODE_ENV === 'development') {
            console.log('☕ Creating cafe sound');
          }
          this.createCafeSound(volume);
          break;
        case 'forest':
          if (process.env.NODE_ENV === 'development') {
            console.log('🌲 Creating forest sound');
          }
          this.createForestSound(volume);
          break;
      }
    } catch (error) {
      console.error(`❌ Error creating ${type} sound:`, error);
    }
  }

  private createRainSound(volume: number) {
    if (!this.audioContext || !this.gainNode) {
      console.error('❌ Audio context not available for rain sound');
      return;
    }

    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('🌧️ Creating rain sound with volume:', volume);
      }

      // Create white noise for rain effect
      const bufferSize = this.audioContext.sampleRate * 2;
      const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.audioContext.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter for rain-like sound
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.audioContext.currentTime);

      const gainNode = this.audioContext.createGain();
      gainNode.gain.setValueAtTime(volume * 0.3, this.audioContext.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      whiteNoise.start();

      // Store reference to stop later
      (this as { currentSource?: AudioBufferSourceNode }).currentSource = whiteNoise;
      
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Rain sound started successfully');
      }
    } catch (error) {
      console.error('❌ Error creating rain sound:', error);
    }
  }

  private createKeyboardSound(volume: number) {
    if (!this.audioContext || !this.gainNode) return;

    if (process.env.NODE_ENV === 'development') {
      console.log('⌨️ Setting up keyboard clicks');
    }

    // Create periodic keyboard click sounds
    const createClick = () => {
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(800 + Math.random() * 400, this.audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.1, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.1);

      // Schedule next click
      this.keyboardInterval = setTimeout(createClick, 100 + Math.random() * 300);
    };

    createClick();
  }

  private createCafeSound(volume: number) {
    // Combine low-frequency rumble with occasional higher frequency sounds
    this.createRainSound(volume * 0.3); // Base ambient
    
    if (!this.audioContext) return;

    if (process.env.NODE_ENV === 'development') {
      console.log('☕ Setting up cafe chatter');
    }

    // Add occasional "chatter" sounds
    const createChatter = () => {
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(200 + Math.random() * 300, this.audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.05, this.audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.5);

      this.chatterInterval = setTimeout(createChatter, 2000 + Math.random() * 5000);
    };

    createChatter();
  }

  private createForestSound(volume: number) {
    // Similar to rain but with different filtering and occasional bird sounds
    this.createRainSound(volume * 0.2);

    if (!this.audioContext) return;

    if (process.env.NODE_ENV === 'development') {
      console.log('🌲 Setting up forest birds');
    }

    const createBirdSound = () => {
      if (!this.audioContext) return;
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = 'sine';
      const baseFreq = 800 + Math.random() * 1200;
      oscillator.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
      oscillator.frequency.linearRampToValueAtTime(baseFreq * 1.5, this.audioContext.currentTime + 0.1);
      oscillator.frequency.linearRampToValueAtTime(baseFreq, this.audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume * 0.1, this.audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.3);

      this.birdInterval = setTimeout(createBirdSound, 3000 + Math.random() * 10000);
    };

    createBirdSound();
  }

  stopAll() {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔇 AudioManager: Stopping all audio');
    }
    this.stopCurrentAudio();
    
    const currentSource = (this as { currentSource?: AudioBufferSourceNode }).currentSource;
    if (currentSource) {
      try {
        currentSource.stop();
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Stopped current audio source');
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Error stopping audio source:', error);
        }
      }
      (this as { currentSource?: AudioBufferSourceNode }).currentSource = undefined;
    }
    
    // Also stop any scheduled sounds
    if (this.keyboardInterval) {
      clearTimeout(this.keyboardInterval);
      this.keyboardInterval = null;
    }
    if (this.chatterInterval) {
      clearTimeout(this.chatterInterval);
      this.chatterInterval = null;
    }
    if (this.birdInterval) {
      clearTimeout(this.birdInterval);
      this.birdInterval = null;
    }
  }
}

export const audioManager = new AudioManager();

// Initialize on first import (client-side only)
if (typeof window !== 'undefined') {
  audioManager.initialize().catch(console.error);
}
