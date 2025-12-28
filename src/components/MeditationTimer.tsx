'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BoxBreathing from './BoxBreathing';
import Grounding54321 from './Grounding54321';
import ColdExposure from './ColdExposure';
import PhysiologicalSigh from './PhysiologicalSigh';
import StopTechnique from './StopTechnique';
import BodyScan from './BodyScan';

type Tab = 'timer' | 'sigh' | 'box' | 'stop' | 'grounding' | 'body' | 'cold';

const PRESETS = [
  { label: '1', minutes: 1 },
  { label: '3', minutes: 3 },
  { label: '5', minutes: 5 },
  { label: '10', minutes: 10 },
  { label: '15', minutes: 15 },
];

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'timer', label: 'timer', icon: '○' },
  { id: 'sigh', label: 'sigh', icon: '~' },
  { id: 'box', label: 'box', icon: '□' },
  { id: 'stop', label: 'stop', icon: '·' },
  { id: 'grounding', label: '54321', icon: '5' },
  { id: 'body', label: 'scan', icon: '|' },
  { id: 'cold', label: 'cold', icon: '*' },
];

export default function MeditationTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('timer');
  const [duration, setDuration] = useState(5 * 60);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bellRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;
    
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIsRunning(false);
          setIsComplete(true);
          bellRef.current?.play();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const startTimer = useCallback(() => {
    setTimeLeft(duration);
    setIsRunning(true);
    setIsComplete(false);
    audioRef.current?.play();
  }, [duration]);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
    audioRef.current?.pause();
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setIsComplete(false);
    setTimeLeft(duration);
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
  }, [duration]);

  const selectDuration = useCallback((minutes: number) => {
    const secs = minutes * 60;
    setDuration(secs);
    setTimeLeft(secs);
    setIsComplete(false);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = 1 - timeLeft / duration;

  const handleClose = () => {
    if (!isRunning) {
      setIsOpen(false);
      setActiveTab('timer');
    }
  };

  return (
    <>
      <audio ref={audioRef} loop preload="none">
        <source src="/audio/ambient.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={bellRef} preload="none">
        <source src="/audio/bell.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating trigger - breathing circle */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-3 group"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-12 h-12 rounded-full border border-emerald-500/30 flex items-center justify-center backdrop-blur-sm group-hover:border-emerald-400/50 transition-colors"
          style={{ background: 'rgba(4, 7, 4, 0.6)' }}
          animate={{ 
            scale: [1, 1.08, 1],
            boxShadow: [
              '0 0 0 0 rgba(52, 211, 153, 0)',
              '0 0 20px 2px rgba(52, 211, 153, 0.15)',
              '0 0 0 0 rgba(52, 211, 153, 0)'
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div 
            className="w-2 h-2 rounded-full bg-emerald-400/60"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
        <span className="text-emerald-200/40 text-xs tracking-widest uppercase group-hover:text-emerald-200/60 transition-colors">ground</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={handleClose}
            />

            <motion.div
              className="relative z-10 w-full max-w-md rounded-3xl border border-emerald-900/40 overflow-hidden"
              style={{ background: 'rgba(4, 7, 4, 0.95)' }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              {/* Tabs - scrollable on mobile */}
              <div className="flex overflow-x-auto border-b border-emerald-900/30 scrollbar-hide">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => !isRunning && setActiveTab(tab.id)}
                    className={`flex-shrink-0 px-4 py-3 text-xs tracking-wider transition-colors ${
                      activeTab === tab.id
                        ? 'text-emerald-300 border-b border-emerald-500/50'
                        : 'text-emerald-200/30 hover:text-emerald-200/50'
                    } ${isRunning && tab.id !== 'timer' ? 'opacity-30 cursor-not-allowed' : ''}`}
                  >
                    <span className="block text-lg font-light mb-1 opacity-60">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Close button */}
              {!isRunning && (
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-emerald-200/30 hover:text-emerald-200/60 transition-colors z-10"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Content */}
              <div className="p-8">
                <AnimatePresence mode="wait">
                  {activeTab === 'timer' && (
                    <motion.div
                      key="timer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      {/* Timer display */}
                      <div className="relative flex items-center justify-center mb-8">
                        <svg className="w-48 h-48 -rotate-90">
                          <circle cx="96" cy="96" r="88" fill="none" stroke="rgba(52, 211, 153, 0.1)" strokeWidth="2" />
                          <motion.circle
                            cx="96" cy="96" r="88"
                            fill="none"
                            stroke="rgba(52, 211, 153, 0.5)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeDasharray={553}
                            strokeDashoffset={553 * (1 - progress)}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-5xl font-extralight text-emerald-100/90 tracking-wide">
                            {formatTime(timeLeft)}
                          </span>
                          {isComplete && (
                            <motion.span
                              className="text-sm text-emerald-400/60 mt-2"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              complete
                            </motion.span>
                          )}
                        </div>
                      </div>

                      {/* Presets */}
                      {!isRunning && (
                        <div className="flex justify-center gap-2 mb-8">
                          {PRESETS.map((preset) => (
                            <button
                              key={preset.minutes}
                              onClick={() => selectDuration(preset.minutes)}
                              className={`w-10 h-10 rounded-full text-sm font-light transition-all ${
                                duration === preset.minutes * 60
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'text-emerald-200/40 hover:text-emerald-200/70 border border-transparent'
                              }`}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Controls */}
                      <div className="flex justify-center gap-4">
                        {!isRunning ? (
                          <motion.button
                            onClick={startTimer}
                            className="px-8 py-3 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors font-light"
                            whileTap={{ scale: 0.98 }}
                          >
                            {isComplete ? 'again' : 'begin'}
                          </motion.button>
                        ) : (
                          <>
                            <motion.button
                              onClick={stopTimer}
                              className="px-6 py-3 rounded-full text-emerald-200/50 border border-emerald-800/30 hover:border-emerald-600/50 transition-colors font-light"
                              whileTap={{ scale: 0.98 }}
                            >
                              pause
                            </motion.button>
                            <motion.button
                              onClick={resetTimer}
                              className="px-6 py-3 rounded-full text-emerald-200/50 border border-emerald-800/30 hover:border-emerald-600/50 transition-colors font-light"
                              whileTap={{ scale: 0.98 }}
                            >
                              reset
                            </motion.button>
                          </>
                        )}
                      </div>
                      <p className="text-center text-emerald-200/20 text-xs mt-6">minutes</p>
                    </motion.div>
                  )}

                  {activeTab === 'sigh' && (
                    <motion.div
                      key="sigh"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <PhysiologicalSigh onClose={handleClose} />
                    </motion.div>
                  )}

                  {activeTab === 'box' && (
                    <motion.div
                      key="box"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <BoxBreathing onClose={handleClose} />
                    </motion.div>
                  )}

                  {activeTab === 'stop' && (
                    <motion.div
                      key="stop"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <StopTechnique onClose={handleClose} />
                    </motion.div>
                  )}

                  {activeTab === 'grounding' && (
                    <motion.div
                      key="grounding"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <Grounding54321 onClose={handleClose} />
                    </motion.div>
                  )}

                  {activeTab === 'body' && (
                    <motion.div
                      key="body"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <BodyScan onClose={handleClose} />
                    </motion.div>
                  )}

                  {activeTab === 'cold' && (
                    <motion.div
                      key="cold"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <ColdExposure onClose={handleClose} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
