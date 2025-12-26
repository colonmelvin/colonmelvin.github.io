'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const BODY_PARTS = [
  { name: 'head', label: 'Head & face', y: 8 },
  { name: 'neck', label: 'Neck & shoulders', y: 18 },
  { name: 'chest', label: 'Chest & heart', y: 30 },
  { name: 'stomach', label: 'Stomach & core', y: 45 },
  { name: 'hips', label: 'Hips & lower back', y: 58 },
  { name: 'legs', label: 'Legs & thighs', y: 72 },
  { name: 'feet', label: 'Feet & toes', y: 88 },
];

export default function BodyScan({ onClose }: { onClose: () => void }) {
  const [currentPart, setCurrentPart] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);
  const [autoProgress, setAutoProgress] = useState(true);

  useEffect(() => {
    if (!autoProgress || currentPart < 0 || currentPart >= BODY_PARTS.length) return;

    const timer = setTimeout(() => {
      if (currentPart < BODY_PARTS.length - 1) {
        setCurrentPart((p) => p + 1);
      } else {
        setIsComplete(true);
        setCurrentPart(-1);
      }
    }, 5000); // 5 seconds per body part

    return () => clearTimeout(timer);
  }, [currentPart, autoProgress]);

  const start = useCallback(() => {
    setCurrentPart(0);
    setIsComplete(false);
  }, []);

  const reset = useCallback(() => {
    setCurrentPart(-1);
    setIsComplete(false);
  }, []);

  const part = currentPart >= 0 ? BODY_PARTS[currentPart] : null;

  return (
    <div className="text-center">
      <h3 className="text-xl font-light text-emerald-100/80 mb-2">body scan</h3>
      <p className="text-sm text-emerald-200/40 mb-6">release tension, return to your body</p>

      <div className="flex gap-6 items-center justify-center mb-6">
        {/* Body outline */}
        <div className="relative w-16 h-48">
          <svg viewBox="0 0 40 120" className="w-full h-full">
            {/* Simple body silhouette */}
            <ellipse cx="20" cy="10" rx="8" ry="9" fill="none" stroke="rgba(52,211,153,0.2)" strokeWidth="1" />
            <line x1="20" y1="19" x2="20" y2="55" stroke="rgba(52,211,153,0.2)" strokeWidth="1" />
            <line x1="20" y1="25" x2="5" y2="45" stroke="rgba(52,211,153,0.2)" strokeWidth="1" />
            <line x1="20" y1="25" x2="35" y2="45" stroke="rgba(52,211,153,0.2)" strokeWidth="1" />
            <line x1="20" y1="55" x2="10" y2="95" stroke="rgba(52,211,153,0.2)" strokeWidth="1" />
            <line x1="20" y1="55" x2="30" y2="95" stroke="rgba(52,211,153,0.2)" strokeWidth="1" />
            
            {/* Highlight current area */}
            {part && (
              <motion.circle
                cx="20"
                cy={part.y}
                r="6"
                fill="rgba(52,211,153,0.3)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </svg>
        </div>

        {/* Current focus */}
        <div className="flex-1 text-left h-32 flex items-center">
          {currentPart === -1 && !isComplete && (
            <p className="text-emerald-200/40 text-sm">
              Slowly scan from head to toe.<br />
              Notice sensations without judgment.
            </p>
          )}

          {part && (
            <motion.div
              key={currentPart}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-xl font-light text-emerald-300/90 block mb-2">
                {part.label}
              </span>
              <p className="text-sm text-emerald-200/40">
                Breathe into this area.<br />
                Notice any tension. Let it soften.
              </p>
              <div className="flex gap-1 mt-3">
                {BODY_PARTS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      i <= currentPart ? 'bg-emerald-500/60' : 'bg-emerald-900/40'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-lg font-light text-emerald-100/70 block mb-1">
                whole body awareness
              </span>
              <p className="text-sm text-emerald-200/40">
                Feel your entire body as one.<br />
                Present. Grounded. Calm.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {currentPart === -1 && !isComplete && (
          <motion.button
            onClick={start}
            className="px-8 py-3 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors font-light"
            whileTap={{ scale: 0.98 }}
          >
            begin
          </motion.button>
        )}

        {part && (
          <motion.button
            onClick={() => setCurrentPart((p) => Math.min(p + 1, BODY_PARTS.length - 1))}
            className="px-6 py-3 rounded-full text-emerald-200/50 border border-emerald-800/30 hover:border-emerald-600/50 transition-colors font-light text-sm"
            whileTap={{ scale: 0.98 }}
          >
            skip
          </motion.button>
        )}

        {isComplete && (
          <motion.button
            onClick={reset}
            className="px-8 py-3 rounded-full text-emerald-200/50 border border-emerald-800/30 hover:border-emerald-600/50 transition-colors font-light"
            whileTap={{ scale: 0.98 }}
          >
            again
          </motion.button>
        )}
      </div>
    </div>
  );
}
