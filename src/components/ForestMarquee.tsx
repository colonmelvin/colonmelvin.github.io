'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ForestMarquee() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['-30%', '0%']);

  return (
    <section ref={containerRef} className="py-24 overflow-hidden bg-[#040804]">
      <motion.div style={{ x: x1 }} className="flex whitespace-nowrap mb-4">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-[12vw] font-black text-emerald-950 mr-8">
            STILLNESS • PRESENCE • PEACE •
          </span>
        ))}
      </motion.div>
      
      <motion.div style={{ x: x2 }} className="flex whitespace-nowrap">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-[12vw] font-black text-transparent mr-8" style={{ WebkitTextStroke: '1px rgba(52, 211, 153, 0.2)' }}>
            BREATHE • OBSERVE • RELEASE •
          </span>
        ))}
      </motion.div>
    </section>
  );
}
