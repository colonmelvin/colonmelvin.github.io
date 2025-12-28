'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

type Phase = 'ready' | 'inhale1' | 'inhale2' | 'exhale' | 'complete';

export default function PhysiologicalSigh({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>('ready');
  const [breathCount, setBreathCount] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (phase === 'ready' || phase === 'complete') return;

    const timings: Record<string, number> = {
      inhale1: 2500,  // 2.5s first inhale
      inhale2: 1000,  // 1s second sip
      exhale: 7000,   // 7s long exhale (longer than combined inhales)
    };

    const timer = setTimeout(() => {
      if (phase === 'inhale1') {
        setPhase('inhale2');
        setScale(1.35);
      } else if (phase === 'inhale2') {
        setPhase('exhale');
        setScale(1);
      } else if (phase === 'exhale') {
        const newCount = breathCount + 1;
        setBreathCount(newCount);
        if (newCount >= 3) {
          setPhase('complete');
        } else {
          setPhase('inhale1');
          setScale(1.2);
        }
      }
    }, timings[phase]);

    return () => clearTimeout(timer);
  }, [phase, breathCount]);

  const start = useCallback(() => {
    setBreathCount(0);
    setPhase('inhale1');
    setScale(1.2);
  }, []);

  const reset = useCallback(() => {
    setPhase('ready');
    setScale(1);
    setBreathCount(0);
  }, []);

  const getLabel = () => {
    switch (phase) {
      case 'inhale1': return 'inhale';
      case 'inhale2': return 'sip more';
      case 'exhale': return 'long exhale';
      default: return '';
    }
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-light text-emerald-100/80 mb-2">physiological sigh</h3>
      <p className="text-sm text-emerald-200/40 mb-8">fastest way to calm - double inhale, long exhale</p>

      {/* Breathing circle */}
      <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
        <motion.div
          className="absolute w-32 h-32 rounded-full border-2 border-emerald-500/30"
          animate={{ scale }}
          transition={{ duration: phase === 'exhale' ? 7 : phase === 'inhale2' ? 1 : 2.5, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-emerald-500/10"
          animate={{ scale }}
          transition={{ duration: phase === 'exhale' ? 7 : phase === 'inhale2' ? 1 : 2.5, ease: 'easeInOut' }}
        />
        
        <div className="relative z-10 text-center">
          {phase !== 'ready' && phase !== 'complete' && (
            <motion.span
              key={phase}
              className="text-emerald-300/80 text-lg font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {getLabel()}
            </motion.span>
          )}
          {phase === 'complete' && (
            <span className="text-emerald-400/70 text-sm">done</span>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="flex justify-center gap-2 mb-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-colors ${
              i < breathCount ? 'bg-emerald-500/60' : 'bg-emerald-900/40'
            }`}
          />
        ))}
      </div>

      {/* Instructions */}
      <p className="text-xs text-emerald-200/30 mb-6 max-w-xs mx-auto">
        Inhale through nose, quick second inhale to fully expand lungs, then slow exhale through mouth
      </p>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {phase === 'ready' && (
          <motion.button
            onClick={start}
            className="px-8 py-3 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors font-light"
            whileTap={{ scale: 0.98 }}
          >
            begin
          </motion.button>
        )}
        {phase === 'complete' && (
          <motion.button
            onClick={reset}
            className="px-8 py-3 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors font-light"
            whileTap={{ scale: 0.98 }}
          >
            again
          </motion.button>
        )}
      </div>
    </div>
  );
}
