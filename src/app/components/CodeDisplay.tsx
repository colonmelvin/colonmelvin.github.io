'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVibeStore } from '@/lib/vibe-store';

const codeSnippets = [
  {
    title: 'vibe.js',
    language: 'javascript',
    code: `// Initializing the vibe...
const vibe = {
  ambiance: 50,
  colorHue: 240,
  animationSpeed: 1.0,
  focusMode: 50,
  soundLevel: 0
};

function setVibe(settings) {
  // Magic happens here ✨
  document.documentElement.style.setProperty(
    '--vibe-hue', settings.colorHue + 'deg'
  );
  
  // Update the atmosphere
  updateBackground(settings.ambiance);
  adjustAnimations(settings.animationSpeed);
  
  return 'Vibe updated! 🎉';
}`
  },
  {
    title: 'atmosphere.css',
    language: 'css',
    code: `:root {
  --vibe-hue: 240deg;
  --color-primary: hsl(var(--vibe-hue), 70%, 60%);
  --bg-base: hsl(var(--vibe-hue), 20%, 8%);
}

.neon-glow {
  box-shadow: 
    0 0 5px var(--color-primary),
    0 0 10px var(--color-primary),
    0 0 15px var(--color-primary);
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}`
  },
  {
    title: 'experience.tsx',
    language: 'typescript',
    code: `interface VibeState {
  ambiance: number;
  colorHue: number;
  animationSpeed: number;
  focusMode: number;
  soundLevel: number;
}

const useVibeStore = create<VibeState>((set) => ({
  ambiance: 50,
  colorHue: 240,
  animationSpeed: 1.0,
  focusMode: 50,
  soundLevel: 0,
  
  setVibe: (newVibe: Partial<VibeState>) => 
    set((state) => ({ ...state, ...newVibe })),
}));

// Creating the perfect coding atmosphere
export default function VibeExperience() {
  const vibe = useVibeStore();
  
  return <div className="vibe-coding">✨</div>;
}`
  }
];

export default function CodeDisplay() {
  const { animationSpeed, focusMode } = useVibeStore();
  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const currentCode = codeSnippets[currentSnippet];

  // Typing animation effect
  useEffect(() => {
    if (focusMode < 20) return; // Skip typing animation in high focus mode

    setIsTyping(true);
    setTypedText('');
    
    const text = currentCode.code;
    let index = 0;
    
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setTypedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 50 / animationSpeed);

    return () => clearInterval(typeInterval);
  }, [currentSnippet, animationSpeed, focusMode, currentCode.code]);

  // Auto-cycle through code snippets
  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setCurrentSnippet((prev) => (prev + 1) % codeSnippets.length);
    }, 8000 / animationSpeed);

    return () => clearInterval(cycleInterval);
  }, [animationSpeed]);

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Code Window */}
      <div className="glass-effect rounded-lg overflow-hidden neon-glow">
        {/* Window Header */}
        <div 
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ 
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--color-primary)'
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <motion.div 
                className="w-3 h-3 rounded-full bg-red-500"
                whileHover={{ scale: 1.2 }}
              />
              <motion.div 
                className="w-3 h-3 rounded-full bg-yellow-500"
                whileHover={{ scale: 1.2 }}
              />
              <motion.div 
                className="w-3 h-3 rounded-full bg-green-500"
                whileHover={{ scale: 1.2 }}
              />
            </div>
            <span 
              className="text-sm font-mono font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              {currentCode.title}
            </span>
          </div>
          
          {/* Language Badge */}
          <motion.span
            className="px-2 py-1 text-xs font-mono rounded"
            style={{ 
              backgroundColor: 'var(--color-primary)',
              color: 'var(--bg-base)'
            }}
            whileHover={{ scale: 1.05 }}
          >
            {currentCode.language}
          </motion.span>
        </div>

        {/* Code Content */}
        <div 
          className="p-6 font-mono text-sm leading-relaxed overflow-x-auto"
          style={{ backgroundColor: 'var(--bg-base)' }}
        >
          <AnimatePresence mode="wait">
            <motion.pre
              key={currentSnippet}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="whitespace-pre-wrap"
            >
              <code style={{ color: 'var(--text-primary)' }}>
                {focusMode >= 20 ? (
                  <>
                    {typedText}
                    {isTyping && (
                      <motion.span
                        className="inline-block w-2 h-5 ml-1"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ 
                          duration: 0.8 / animationSpeed, 
                          repeat: Infinity 
                        }}
                      />
                    )}
                  </>
                ) : (
                  currentCode.code
                )}
              </code>
            </motion.pre>
          </AnimatePresence>
        </div>

        {/* Code Navigation */}
        <div 
          className="flex items-center justify-between px-4 py-3 border-t"
          style={{ 
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--color-primary)'
          }}
        >
          <div className="flex space-x-2">
            {codeSnippets.map((_, index) => (
              <motion.button
                key={index}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: index === currentSnippet 
                    ? 'var(--color-primary)' 
                    : 'var(--text-muted)'
                }}
                onClick={() => setCurrentSnippet(index)}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.8 }}
              />
            ))}
          </div>
          
          <motion.div
            className="text-xs font-mono opacity-60"
            style={{ color: 'var(--text-muted)' }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isTyping ? 'Typing...' : 'Live coding ✨'}
          </motion.div>
        </div>
      </div>

      {/* Code Stats */}
      <motion.div
        className="mt-4 flex justify-center space-x-6 text-sm"
        style={{ color: 'var(--text-secondary)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center space-x-2">
          <span>📝</span>
          <span>{currentCode.code.split('\n').length} lines</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>⚡</span>
          <span>{animationSpeed.toFixed(1)}x speed</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>🎯</span>
          <span>{focusMode}% focus</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
