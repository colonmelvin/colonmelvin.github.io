'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useVibeStore, VibePreset } from '@/lib/vibe-store';
import { audioManager } from '@/lib/audio-manager';

interface VibeControlsProps {
  showTrigger?: boolean;
}

export default function VibeControls({ showTrigger = true }: VibeControlsProps) {
  const {
    ambiance,
    colorHue,
    animationSpeed,
    focusMode,
    soundLevel,
    soundEnabled,
    currentAmbientSound,
    isPanelOpen,
    setAmbiance,
    setColorHue,
    setAnimationSpeed,
    setFocusMode,
    setSoundLevel,
    setSoundEnabled,
    togglePanel,
    applyPreset,
  } = useVibeStore();

  const presets: { key: VibePreset; label: string; emoji: string }[] = [
    { key: 'focus', label: 'Focus', emoji: '🎯' },
    { key: 'chill', label: 'Chill', emoji: '😌' },
    { key: 'energy', label: 'Energy', emoji: '⚡' },
    { key: 'midnight', label: 'Midnight', emoji: '🌙' },
  ];

  return (
    <>
      {/* Toggle Button - Only show if showTrigger is true */}
      {showTrigger && (
        <motion.button
          className="relative z-50 p-3 rounded-full glass-effect focus-ring"
          onClick={togglePanel}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{ borderColor: 'var(--color-primary)' }}
        >
          <motion.span
            className="text-2xl"
            animate={{ rotate: isPanelOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            🎛️
          </motion.span>
        </motion.button>
      )}

      {/* Control Panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={togglePanel}
            />

            {/* Panel */}
            <motion.div
              className="fixed top-0 right-0 h-full w-full max-w-md bg-opacity-95 glass-effect z-50 overflow-y-auto"
              style={{ backgroundColor: 'var(--bg-elevated)' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    Vibe Controls
                  </h2>
                  <motion.button
                    className="p-2 rounded-full hover:bg-opacity-20 focus-ring"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                    onClick={togglePanel}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <span className="text-xl">×</span>
                  </motion.button>
                </div>

                {/* Controls */}
                <div className="space-y-8">
                  {/* Ambiance Control */}
                  <VibeSlider
                    label="Ambiance"
                    value={ambiance}
                    onChange={setAmbiance}
                    min={0}
                    max={100}
                    leftIcon="🌙"
                    rightIcon="☀️"
                    unit="%"
                  />

                  {/* Color Hue Control */}
                  <VibeSlider
                    label="Color Vibe"
                    value={colorHue}
                    onChange={setColorHue}
                    min={0}
                    max={360}
                    leftIcon="🔵"
                    rightIcon="🔴"
                    unit="°"
                  />

                  {/* Animation Speed Control */}
                  <VibeSlider
                    label="Animation Speed"
                    value={animationSpeed}
                    onChange={setAnimationSpeed}
                    min={0.1}
                    max={3}
                    step={0.1}
                    leftIcon="🐌"
                    rightIcon="⚡"
                    unit="x"
                  />

                  {/* Focus Mode Control */}
                  <VibeSlider
                    label="Focus Mode"
                    value={focusMode}
                    onChange={setFocusMode}
                    min={0}
                    max={100}
                    leftIcon="🎪"
                    rightIcon="🎯"
                    unit="%"
                  />

                  {/* Sound Controls */}
                  <div className="space-y-4">
                    {/* Sound Enable/Disable Checkbox */}
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        Ambient Sound
                      </label>
                      <motion.button
                        className={`w-12 h-6 rounded-full p-1 transition-colors focus-ring ${
                          soundEnabled ? 'bg-opacity-30' : 'bg-opacity-10'
                        }`}
                        style={{ 
                          backgroundColor: soundEnabled ? 'var(--color-primary)' : 'var(--text-muted)',
                        }}
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.div
                          className="w-4 h-4 rounded-full"
                          style={{ 
                            backgroundColor: soundEnabled ? 'var(--color-primary)' : 'var(--text-muted)',
                          }}
                          animate={{ x: soundEnabled ? 20 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </motion.button>
                    </div>

                    {/* Sound Level Slider - Only show when enabled */}
                    {soundEnabled && (
                      <VibeSlider
                        label="Volume"
                        value={soundLevel}
                        onChange={setSoundLevel}
                        min={0}
                        max={100}
                        leftIcon="🔇"
                        rightIcon="🔊"
                        unit="%"
                      />
                    )}

                    {/* Sound Type Selection - Only show when enabled */}
                    {soundEnabled && (
                      <div className="mt-4">
                        <label className="text-sm font-medium mb-3 block" style={{ color: 'var(--text-primary)' }}>
                          Ambient Type
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { id: 'keyboard', label: 'Keyboard', emoji: '⌨️' },
                            { id: 'rain', label: 'Rain', emoji: '🌧️' },
                            { id: 'cafe', label: 'Cafe', emoji: '☕' },
                            { id: 'forest', label: 'Forest', emoji: '🌲' },
                          ].map((sound) => (
                            <motion.button
                              key={sound.id}
                              className={`p-3 rounded-lg text-center focus-ring transition-all ${
                                currentAmbientSound === sound.id 
                                  ? 'glass-effect' 
                                  : 'hover:bg-opacity-10'
                              }`}
                              style={{ 
                                borderColor: currentAmbientSound === sound.id 
                                  ? 'var(--color-primary)' 
                                  : 'transparent',
                                backgroundColor: currentAmbientSound === sound.id 
                                  ? 'var(--bg-glass)' 
                                  : 'transparent'
                              }}
                              onClick={() => {
                                useVibeStore.setState({ currentAmbientSound: sound.id });
                                useVibeStore.getState().updateAmbientSound();
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div className="text-lg mb-1">{sound.emoji}</div>
                              <div className="text-xs" style={{ color: 'var(--text-primary)' }}>
                                {sound.label}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Presets */}
                <div className="mt-12">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
                    Quick Presets
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {presets.map((preset) => (
                      <motion.button
                        key={preset.key}
                        className="p-4 rounded-lg glass-effect text-center focus-ring"
                        style={{ borderColor: 'var(--color-primary)' }}
                        onClick={() => applyPreset(preset.key)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="text-2xl mb-1">{preset.emoji}</div>
                        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {preset.label}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-glass)' }}>
                  <p className="text-sm mb-2" style={{ color: 'var(--text-muted)' }}>
                    💡 Move your cursor around to see interactive effects. 
                    All changes apply instantly to create your perfect coding vibe.
                  </p>
                  {soundEnabled && (
                    <p className="text-xs mt-2 opacity-75" style={{ color: 'var(--text-muted)' }}>
                      🔊 Ambient sounds are generated procedurally using Web Audio API. 
                      If you don&apos;t hear anything, try adjusting your browser&apos;s audio settings.
                    </p>
                  )}
                  
                  {/* Debug Test Button - Development Only */}
                  {process.env.NODE_ENV === 'development' && (
                    <motion.button
                      className="mt-3 px-4 py-2 text-xs rounded glass-effect focus-ring"
                      style={{ 
                        color: 'var(--color-primary)',
                        borderColor: 'var(--color-primary)'
                      }}
                      onClick={async () => {
                        console.log('🧪 Test button clicked');
                        const store = useVibeStore.getState();
                        console.log('Current state:', {
                          soundEnabled: store.soundEnabled,
                          soundLevel: store.soundLevel,
                          currentAmbientSound: store.currentAmbientSound
                        });
                        
                        // Test audio system
                        const audioWorking = await audioManager.testAudio();
                        
                        if (audioWorking && store.soundEnabled && store.soundLevel > 0) {
                          console.log('🎵 Triggering ambient sound...');
                          store.updateAmbientSound();
                        } else if (!store.soundEnabled) {
                          console.log('⚠️ Sound is disabled, enable it first');
                        } else if (store.soundLevel === 0) {
                          console.log('⚠️ Sound level is 0, increase it first');
                        } else {
                          console.log('❌ Audio system not working');
                        }
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      🧪 Test Audio
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

interface VibeSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  leftIcon: string;
  rightIcon: string;
  unit: string;
}

function VibeSlider({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1, 
  leftIcon, 
  rightIcon, 
  unit 
}: VibeSliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {label}
        </label>
        <span className="text-sm font-mono" style={{ color: 'var(--color-primary)' }}>
          {value.toFixed(unit === 'x' ? 1 : 0)}{unit}
        </span>
      </div>
      
      <div className="flex items-center space-x-3">
        <span className="text-lg">{leftIcon}</span>
        
        <div className="flex-1 relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, 
                var(--color-primary) 0%, 
                var(--color-primary) ${((value - min) / (max - min)) * 100}%, 
                var(--bg-elevated) ${((value - min) / (max - min)) * 100}%, 
                var(--bg-elevated) 100%)`
            }}
          />
          <style jsx>{`
            .slider::-webkit-slider-thumb {
              appearance: none;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: var(--color-primary);
              cursor: pointer;
              box-shadow: 0 0 10px var(--color-primary);
              transition: all 0.2s ease;
            }
            .slider::-webkit-slider-thumb:hover {
              transform: scale(1.2);
              box-shadow: 0 0 15px var(--color-primary);
            }
            .slider::-moz-range-thumb {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background: var(--color-primary);
              cursor: pointer;
              border: none;
              box-shadow: 0 0 10px var(--color-primary);
            }
          `}</style>
        </div>
        
        <span className="text-lg">{rightIcon}</span>
      </div>
    </div>
  );
}
