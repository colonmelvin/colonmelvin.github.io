'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

const TIPS = [
  { title: 'Cold shower', duration: '30-90 sec', desc: 'End your shower with cold water. Start with 30 seconds, build up over time.' },
  { title: 'Face immersion', duration: '15-30 sec', desc: 'Submerge your face in cold water. Triggers the dive reflex, instantly calms.' },
  { title: 'Cold hands', duration: '1-2 min', desc: 'Run cold water over your wrists and hands. Quick reset anywhere.' },
  { title: 'Ice on neck', duration: '30 sec', desc: 'Hold ice or cold pack on the back of your neck. Vagus nerve activation.' },
];

export default function ColdExposure({ onClose }: { onClose: () => void }) {
  const [showInfo, setShowInfo] = useState(false);
  
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <h3 className="text-xl font-light text-emerald-100/80">cold exposure</h3>
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
            Cold activates the vagus nerve and triggers the dive reflex, shifting from sympathetic (stress) to parasympathetic (calm) nervous system dominance. Regular practice builds stress resilience.
          </p>
          <a 
            href="https://www.hubermanlab.com/newsletter/the-science-and-use-of-cold-exposure-for-health-and-performance" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-400/70 hover:text-emerald-400 underline"
          >
            Learn more — Huberman Lab
          </a>
        </div>
      ) : (
        <p className="text-sm text-emerald-200/40 mb-6">activate your vagus nerve, build resilience</p>
      )}

      {/* Benefits */}
      <div className="flex justify-center gap-6 mb-8 text-xs text-emerald-200/30">
        <span>↓ stress</span>
        <span>↑ focus</span>
        <span>↓ inflammation</span>
      </div>

      {/* Tips grid */}
      <div className="grid grid-cols-1 gap-3 text-left max-w-sm mx-auto">
        {TIPS.map((tip, i) => (
          <motion.div
            key={i}
            className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-900/30"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-emerald-200/80 font-medium text-sm">{tip.title}</span>
              <span className="text-emerald-400/50 text-xs">{tip.duration}</span>
            </div>
            <p className="text-emerald-200/40 text-xs leading-relaxed">{tip.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Safety note */}
      <p className="text-xs text-emerald-200/20 mt-6 max-w-xs mx-auto">
        Start gradually. Listen to your body. Avoid if you have heart conditions.
      </p>
    </div>
  );
}
