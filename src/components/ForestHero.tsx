'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

const ForestScene = dynamic(() => import('./ForestScene'), { ssr: false });
const ParticleText = dynamic(() => import('./ParticleText'), { ssr: false });

export default function ForestHero() {
  const containerRef = useRef<HTMLElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Fade in subtitle after particles settle
    const timer = setTimeout(() => {
      if (subtitleRef.current) {
        subtitleRef.current.style.opacity = '1';
        subtitleRef.current.style.transform = 'translateY(0)';
      }
    }, 7500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      <ForestScene />
      <ParticleText text="breathe" />
      
      <div className="relative z-20 text-center pointer-events-none">
        <p 
          ref={subtitleRef}
          className="mt-32 text-base md:text-lg text-emerald-200/30 tracking-[0.4em] uppercase font-light transition-all duration-1000"
          style={{ opacity: 0, transform: 'translateY(20px)' }}
        >
          a moment of stillness
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent" />
      </div>
    </section>
  );
}
