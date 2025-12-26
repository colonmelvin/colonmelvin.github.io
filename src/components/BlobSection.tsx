'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const BlobScene = dynamic(() => import('./BlobScene'), { ssr: false });

export default function BlobSection() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        xPercent: -20,
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
    <section ref={containerRef} className="min-h-screen flex items-center bg-[#050a05] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full">
        <div ref={textRef} className="order-2 md:order-1">
          <h2 className="text-5xl md:text-7xl font-black text-emerald-100/90 mb-6">
            Fluid<br />
            <span className="text-emerald-400">Motion</span>
          </h2>
          <p className="text-xl text-emerald-200/50 leading-relaxed">
            Organic shapes that breathe and evolve. Every interaction feels alive, 
            responding to the rhythm of your exploration.
          </p>
        </div>
        
        <div className="h-[400px] md:h-[600px] order-1 md:order-2">
          <BlobScene />
        </div>
      </div>
    </section>
  );
}
