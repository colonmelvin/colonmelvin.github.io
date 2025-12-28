'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  { letter: 'S', word: 'Stop', desc: 'Pause. Step back from the screen.' },
  { letter: 'T', word: 'Take a breath', desc: 'One deep breath. Feel your feet on the ground.' },
  { letter: 'O', word: 'Observe', desc: 'What am I feeling? What story am I telling myself?' },
  { letter: 'P', word: 'Proceed', desc: 'Choose your next action mindfully.' },
];

export default function StopTechnique({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const start = useCallback(() => {
    setCurrentStep(0);
    setIsComplete(false);
  }, []);

  const next = useCallback(() => {
    if (currentStep < 3) {
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

  const step = currentStep >= 0 ? STEPS[currentStep] : null;

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <h3 className="text-xl font-light text-emerald-100/80">STOP technique</h3>
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
            A DBT skill that interrupts automatic reactions by re-engaging the prefrontal cortex. The pause prevents emotional hijacking and allows for mindful decision-making.
          </p>
          <a 
            href="https://manhattancbt.com/dbt-stop-skill/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-400/70 hover:text-emerald-400 underline"
          >
            Learn more — Manhattan CBT
          </a>
        </div>
      ) : (
        <p className="text-sm text-emerald-200/40 mb-8">interrupt impulsive reactions</p>
      )}

      {/* STOP letters */}
      <div className="flex justify-center gap-1 mb-8">
        {STEPS.map((s, i) => (
          <div
            key={i}
            className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-light transition-all duration-300 ${
              i < currentStep
                ? 'bg-emerald-500/30 text-emerald-300'
                : i === currentStep
                ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/50 scale-110'
                : 'bg-emerald-900/20 text-emerald-200/30'
            }`}
          >
            {s.letter}
          </div>
        ))}
      </div>

      {/* Current step */}
      <div className="h-28 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {currentStep === -1 && !isComplete && (
            <motion.p
              key="ready"
              className="text-emerald-200/40 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              use before making any decision
            </motion.p>
          )}

          {step && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="text-center"
            >
              <span className="text-2xl font-light text-emerald-300/90 block mb-2">
                {step.word}
              </span>
              <p className="text-sm text-emerald-200/50 max-w-xs mx-auto">
                {step.desc}
              </p>
            </motion.div>
          )}

          {isComplete && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <p className="text-lg text-emerald-100/70 font-light mb-1">
                clear mind
              </p>
              <p className="text-sm text-emerald-200/40">
                now decide with intention
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
            {currentStep < 3 ? 'next' : 'finish'}
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
