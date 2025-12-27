'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const facts = [
  { icon: '☁️', label: 'Building at', value: 'AWS' },
  { icon: '📷', label: 'Capturing', value: 'Moments' },
  { icon: '📈', label: 'Trading', value: 'Markets' },
  { icon: '🏃', label: 'Running', value: 'Trails' },
];

export default function Facts() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.fact-item', {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="min-h-screen flex items-center justify-center px-8 py-32 bg-[#040804]">
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facts.map((fact, i) => (
            <div
              key={i}
              className="fact-item group p-8 rounded-2xl border border-emerald-900/30 bg-emerald-950/20 hover:bg-emerald-950/40 hover:border-emerald-800/50 transition-all duration-500"
            >
              <span className="text-3xl mb-4 block">{fact.icon}</span>
              <p className="text-emerald-200/40 text-sm uppercase tracking-wider mb-1">{fact.label}</p>
              <p className="text-2xl font-semibold text-emerald-100/90">{fact.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
