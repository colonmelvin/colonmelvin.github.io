import { create } from 'zustand';
import { audioManager } from './audio-manager';

// Helper function to convert HSL to RGB
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = h / 360;
  s = s / 100;
  l = l / 100;
  
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export interface VibeState {
  // Vibe control values
  ambiance: number; // 0-100 (dark to light)
  colorHue: number; // 0-360 (color wheel)
  animationSpeed: number; // 0.1-3 (speed multiplier)
  focusMode: number; // 0-100 (minimal to rich)
  soundLevel: number; // 0-100 (volume)
  soundEnabled: boolean; // Whether sound is enabled at all
  
  // Audio state
  currentAmbientSound: string | null;
  
  // UI state
  isPanelOpen: boolean;
  isMobile: boolean;
  
  // Actions
  setAmbiance: (value: number) => void;
  setColorHue: (value: number) => void;
  setAnimationSpeed: (value: number) => void;
  setFocusMode: (value: number) => void;
  setSoundLevel: (value: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  togglePanel: () => void;
  setIsMobile: (value: boolean) => void;
  applyPreset: (preset: VibePreset) => void;
  updateCSSVariables: () => void;
  updateAmbientSound: () => void;
}

export type VibePreset = 'focus' | 'chill' | 'energy' | 'midnight';

const presets: Record<VibePreset, Partial<VibeState>> = {
  focus: {
    ambiance: 30,
    colorHue: 200,
    animationSpeed: 0.5,
    focusMode: 20,
    soundLevel: 15,
    currentAmbientSound: 'keyboard',
    // Note: soundEnabled is NOT set here - preserves user's choice
  },
  chill: {
    ambiance: 60,
    colorHue: 180,
    animationSpeed: 0.8,
    focusMode: 70,
    soundLevel: 40,
    currentAmbientSound: 'rain',
  },
  energy: {
    ambiance: 80,
    colorHue: 320,
    animationSpeed: 2.0,
    focusMode: 90,
    soundLevel: 60,
    currentAmbientSound: 'cafe',
  },
  midnight: {
    ambiance: 10,
    colorHue: 240,
    animationSpeed: 1.2,
    focusMode: 60,
    soundLevel: 25,
    currentAmbientSound: 'forest',
  },
};

export const useVibeStore = create<VibeState>((set, get) => ({
  // Initial values
  ambiance: 50,
  colorHue: 240,
  animationSpeed: 1.0,
  focusMode: 50,
  soundLevel: 30, // Default volume when enabled
  soundEnabled: false, // Sound starts OFF
  currentAmbientSound: null,
  isPanelOpen: false,
  isMobile: false,

  // Actions
  setAmbiance: (value: number) => {
    set({ ambiance: value });
    get().updateCSSVariables();
  },

  setColorHue: (value: number) => {
    set({ colorHue: value });
    get().updateCSSVariables();
  },

  setAnimationSpeed: (value: number) => {
    set({ animationSpeed: value });
    get().updateCSSVariables();
  },

  setFocusMode: (value: number) => {
    set({ focusMode: value });
    get().updateCSSVariables();
  },

  setSoundLevel: (value: number) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔊 setSoundLevel called with value:', value);
    }
    set({ soundLevel: value });
    get().updateCSSVariables();
    get().updateAmbientSound();
  },

  setSoundEnabled: (enabled: boolean) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔊 setSoundEnabled called with:', enabled);
    }
    set({ soundEnabled: enabled });
    get().updateAmbientSound();
  },

  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),

  setIsMobile: (value: boolean) => set({ isMobile: value }),

  applyPreset: (preset: VibePreset) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🎨 applyPreset called with:', preset);
    }
    const presetValues = presets[preset];
    if (process.env.NODE_ENV === 'development') {
      console.log('🎨 Preset values:', presetValues);
    }
    
    // Apply preset but preserve soundEnabled state
    const currentSoundEnabled = get().soundEnabled;
    set((state) => ({ 
      ...state, 
      ...presetValues,
      soundEnabled: currentSoundEnabled // Preserve user's sound preference
    }));
    
    get().updateCSSVariables();
    get().updateAmbientSound();
  },

  updateCSSVariables: () => {
    if (typeof window === 'undefined') return; // Skip on server
    
    const state = get();
    const root = document.documentElement;
    
    root.style.setProperty('--vibe-ambiance', state.ambiance.toString());
    root.style.setProperty('--vibe-hue', state.colorHue.toString());
    root.style.setProperty('--vibe-speed', state.animationSpeed.toString());
    root.style.setProperty('--vibe-focus', state.focusMode.toString());
    root.style.setProperty('--vibe-sound', state.soundLevel.toString());
    
    // Convert HSL to RGB for rgba() usage
    const hue = state.colorHue;
    const primaryRgb = hslToRgb(hue, 70, 60);
    const accentRgb = hslToRgb((hue + 60) % 360, 70, 60);
    
    root.style.setProperty('--color-primary-rgb', primaryRgb.join(', '));
    root.style.setProperty('--color-accent-rgb', accentRgb.join(', '));
  },

  updateAmbientSound: () => {
    const state = get();
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔊 updateAmbientSound called:', {
        soundEnabled: state.soundEnabled,
        soundLevel: state.soundLevel,
        currentAmbientSound: state.currentAmbientSound
      });
    }
    
    // Only play sound if explicitly enabled
    if (!state.soundEnabled || state.soundLevel === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔇 Stopping all audio (sound disabled or volume = 0)');
      }
      audioManager.stopAll();
      return;
    }

    // Determine which ambient sound to play based on other vibe settings
    let soundType: 'rain' | 'keyboard' | 'cafe' | 'forest' = 'rain';
    
    if (state.currentAmbientSound) {
      soundType = state.currentAmbientSound as 'rain' | 'keyboard' | 'cafe' | 'forest';
    } else {
      // Auto-select based on vibe settings
      if (state.focusMode < 30) {
        soundType = 'keyboard'; // Focus mode
      } else if (state.ambiance < 30) {
        soundType = 'rain'; // Dark, moody
      } else if (state.focusMode > 70) {
        soundType = 'cafe'; // Social, energetic
      } else {
        soundType = 'forest'; // Natural, balanced
      }
    }

    const volume = state.soundLevel / 100;
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎵 Playing ${soundType} at ${Math.round(volume * 100)}% volume`);
    }
    audioManager.createProceduralAmbient(soundType, volume);
  },
}));
