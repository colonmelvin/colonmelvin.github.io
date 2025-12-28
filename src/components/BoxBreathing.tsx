'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type BreathPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

const PHASES: { phase: BreathPhase; label: string; duration: number }[] = [
  { phase: 'inhale', label: 'inhale', duration: 4 },
  { phase: 'hold1', label: 'hold', duration: 4 },
  { phase: 'exhale', label: 'exhale', duration: 4 },
  { phase: 'hold2', label: 'hold', duration: 4 },
];

export default function BoxBreathing({ onClose }: { onClose: () => void }) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [countdown, setCountdown] = useState(4);
  const [cycles, setCycles] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          setCurrentPhase((p) => {
            const next = (p + 1) % 4;
            if (next === 0) setCycles((cy) => cy + 1);
            return next;
          });
          return PHASES[(currentPhase + 1) % 4].duration;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, currentPhase]);

  const start = useCallback(() => {
    setIsRunning(true);
    setCurrentPhase(0);
    setCountdown(4);
    setCycles(0);
  }, []);

  const phase = PHASES[currentPhase];
  const progress = 1 - countdown / phase.duration;

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <h3 className="text-xl font-light text-emerald-100/80">box breathing</h3>
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
            Used by Navy SEALs to stay calm under pressure. Equal breathing phases activate the parasympathetic nervous system, lowering heart rate and reducing stress hormones.
          </p>
          <a 
            href="https://www.medicinenet.com/why_do_navy_seals_use_box_breathing/article.htm" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-400/70 hover:text-emerald-400 underline"
          >
            Learn more — MedicineNet
          </a>
        </div>
      ) : (
        <p className="text-sm text-emerald-200/40 mb-8">4-4-4-4 rhythm to calm your nervous system</p>
      )}

      {/* Breathing visualization */}
      <div className="relative w-48 h-48 mx-auto mb-8">
        {/* Box outline */}
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <rect
            x="10" y="10" width="80" height="80"
            fill="none"
            stroke="rgba(52, 211, 153, 0.15)"
            strokeWidth="1"
          />
          {isRunning && (
            <motion.rect
              x="10" y="10" width="80" height="80"
              fill="none"
              stroke="rgba(52, 211, 153, 0.6)"
              strokeWidth="2"
              strokeDasharray="80 240"
              strokeDashoffset={-currentPhase * 80 - progress * 80}
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isRunning ? (
            <>
              <motion.span
                key={phase.label}
                className="text-2xl font-light text-emerald-300/80"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {phase.label}
              </motion.span>
              <span className="text-4xl font-extralight text-emerald-100/90 mt-2">
                {countdown}
              </span>
            </>
          ) : (
            <span className="text-emerald-200/40 text-sm">ready</span>
          )}
        </div>
      </div>

      {/* Cycles counter */}
      {cycles > 0 && (
        <p className="text-sm text-emerald-200/30 mb-6">
          {cycles} cycle{cycles > 1 ? 's' : ''} complete
        </p>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {!isRunning ? (
          <motion.button
            onClick={start}
            className="px-8 py-3 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors font-light"
            whileTap={{ scale: 0.98 }}
          >
            begin
          </motion.button>
        ) : (
          <motion.button
            onClick={() => setIsRunning(false)}
            className="px-8 py-3 rounded-full text-emerald-200/50 border border-emerald-800/30 hover:border-emerald-600/50 transition-colors font-light"
            whileTap={{ scale: 0.98 }}
          >
            pause
          </motion.button>
        )}
      </div>
    </div>
  );
}
