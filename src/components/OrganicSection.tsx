'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const OrganicScene = dynamic(() => import('./OrganicScene'), { ssr: false });

export default function OrganicSection() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        xPercent: -15,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          end: 'top 30%',
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="min-h-screen flex items-center bg-[#040804] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
        <div ref={textRef} className="order-2 md:order-1 z-10">
          <p className="text-emerald-500/60 text-sm tracking-[0.2em] uppercase mb-4">Living systems</p>
          <h2 className="text-4xl md:text-6xl font-light text-emerald-50/90 mb-6 leading-tight">
            Growth is<br />
            <span className="font-semibold text-emerald-400">never linear</span>
          </h2>
          <p className="text-lg text-emerald-200/40 leading-relaxed max-w-md">
            Like roots finding water in darkness, the best paths reveal themselves through patience and persistence.
          </p>
        </div>
        
        <div className="h-[450px] md:h-[550px] order-1 md:order-2">
          <OrganicScene />
        </div>
      </div>
    </section>
  );
}
