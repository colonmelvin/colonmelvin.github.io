'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const BODY_PARTS = [
  { name: 'head', label: 'Head & face', y: 8 },
  { name: 'neck', label: 'Neck & shoulders', y: 18 },
  { name: 'chest', label: 'Chest & heart', y: 30 },
  { name: 'stomach', label: 'Stomach & core', y: 42 },
  { name: 'hips', label: 'Hips & lower back', y: 54 },
  { name: 'legs', label: 'Legs & thighs', y: 72 },
  { name: 'feet', label: 'Feet & toes', y: 90 },
];

export default function BodyScan({ onClose }: { onClose: () => void }) {
  const [currentPart, setCurrentPart] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);
  const [autoProgress, setAutoProgress] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

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
      <div className="flex items-center justify-center gap-2 mb-2">
        <h3 className="text-xl font-light text-emerald-100/80">body scan</h3>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="w-5 h-5 rounded-full border border-emerald-500/30 text-emerald-400/60 text-xs hover:border-emerald-400/60 transition-colors"
        >
          ?
        </button>
      </div>
      
      {showInfo ? (
        <div className="text-sm text-emerald-200/50 mb-6 max-w-xs mx-auto text-left">
          <p className="mb-2">
            Systematically focusing attention on body parts activates the parasympathetic nervous system, reducing muscle tension and shifting from stress to relaxation mode.
          </p>
          <a 
            href="https://www.happiness.com/magazine/health-body/body-scan-meditation-script-benefits/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-400/70 hover:text-emerald-400 underline"
          >
            Learn more — Happiness.com
          </a>
        </div>
      ) : (
        <p className="text-sm text-emerald-200/40 mb-6">release tension, return to your body</p>
      )}

      <div className="flex gap-8 items-start justify-center mb-6">
        {/* Vertical body part list */}
        <div className="flex flex-col gap-1">
          {BODY_PARTS.map((bp, i) => (
            <motion.div
              key={bp.name}
              className={`text-sm py-1.5 px-3 rounded-full transition-all ${
                i === currentPart
                  ? 'text-emerald-300 bg-emerald-500/20'
                  : i < currentPart
                  ? 'text-emerald-500/40'
                  : 'text-emerald-200/20'
              }`}
              animate={i === currentPart ? { opacity: [0.7, 1, 0.7] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {bp.label}
            </motion.div>
          ))}
        </div>

        {/* Instructions / status */}
        <div className="flex-1 text-left h-48 flex items-center">
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
              <p className="text-sm text-emerald-200/50">
                Breathe into this area.<br />
                Notice any tension.<br />
                Let it soften.
              </p>
            </motion.div>
          )}

          {isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-lg font-light text-emerald-100/70 block mb-1">
                whole body
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
