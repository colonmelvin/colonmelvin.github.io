'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function MarqueeSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x1 = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['-50%', '0%']);

  const text1 = 'CREATIVE • DIGITAL • DESIGN • ';
  const text2 = 'MOTION • INTERACTIVE • WEB • ';

  return (
    <section ref={containerRef} className="py-32 overflow-hidden bg-zinc-950">
      <motion.div style={{ x: x1 }} className="flex whitespace-nowrap mb-8">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-[15vw] font-black text-transparent stroke-text mr-8">
            {text1}
          </span>
        ))}
      </motion.div>
      
      <motion.div style={{ x: x2 }} className="flex whitespace-nowrap">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-[15vw] font-black gradient-text mr-8">
            {text2}
          </span>
        ))}
      </motion.div>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 2px rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </section>
  );
}
