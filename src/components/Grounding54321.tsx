'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SENSES = [
  { count: 5, sense: 'see', prompt: 'Name 5 things you can see' },
  { count: 4, sense: 'hear', prompt: 'Name 4 things you can hear' },
  { count: 3, sense: 'touch', prompt: 'Name 3 things you can feel' },
  { count: 2, sense: 'smell', prompt: 'Name 2 things you can smell' },
  { count: 1, sense: 'taste', prompt: 'Name 1 thing you can taste' },
];

export default function Grounding54321({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(-1); // -1 = not started
  const [isComplete, setIsComplete] = useState(false);

  const start = useCallback(() => {
    setCurrentStep(0);
    setIsComplete(false);
  }, []);

  const next = useCallback(() => {
    if (currentStep < 4) {
      setCurrentStep((s) => s + 1);
    } else {
      setIsComplete(true);
      setCurrentStep(-1);
    }
  }, [currentStep]);

  const reset = useCallback(() => {
    setCurrentStep(-1);
    setIsComplete(false);
  }, []);

  const step = currentStep >= 0 ? SENSES[currentStep] : null;

  return (
    <div className="text-center">
      <h3 className="text-xl font-light text-emerald-100/80 mb-2">5-4-3-2-1 grounding</h3>
      <p className="text-sm text-emerald-200/40 mb-8">anchor yourself to the present moment</p>

      {/* Progress dots */}
      <div className="flex justify-center gap-3 mb-8">
        {SENSES.map((s, i) => (
          <div
            key={i}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-light transition-all duration-300 ${
              i < currentStep
                ? 'bg-emerald-500/30 text-emerald-300'
                : i === currentStep
                ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/50 scale-110'
                : 'bg-emerald-900/20 text-emerald-200/30'
            }`}
          >
            {s.count}
          </div>
        ))}
      </div>

      {/* Current prompt */}
      <div className="h-32 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentStep === -1 && !isComplete && (
            <motion.p
              key="ready"
              className="text-emerald-200/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              take a moment to look around
            </motion.p>
          )}
          
          {step && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <span className="text-5xl font-extralight text-emerald-300/80 block mb-4">
                {step.count}
              </span>
              <p className="text-lg text-emerald-100/70 font-light">
                {step.prompt}
              </p>
              <p className="text-sm text-emerald-200/30 mt-2">
                take your time
              </p>
            </motion.div>
          )}

          {isComplete && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <span className="text-3xl mb-4 block">🌿</span>
              <p className="text-lg text-emerald-100/70 font-light">
                you are here, now
              </p>
              <p className="text-sm text-emerald-200/30 mt-2">
                grounded in this moment
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mt-4">
        {currentStep === -1 && !isComplete && (
          <motion.button
            onClick={start}
            className="px-8 py-3 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors font-light"
            whileTap={{ scale: 0.98 }}
          >
            begin
          </motion.button>
        )}
        
        {step && (
          <motion.button
            onClick={next}
            className="px-8 py-3 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors font-light"
            whileTap={{ scale: 0.98 }}
          >
            {currentStep < 4 ? 'next' : 'finish'}
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
