'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Quote() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = textRef.current?.querySelectorAll('.word');
      if (!words) return;

      gsap.fromTo(words, 
        { opacity: 0.1 },
        {
          opacity: 1,
          stagger: 0.08,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 60%',
            end: 'bottom 40%',
            scrub: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const text = "In the midst of movement and chaos, keep stillness inside of you.";
  
  return (
    <section ref={containerRef} className="min-h-screen flex items-center justify-center px-8 py-32 bg-[#040804]">
      <div className="max-w-4xl">
        <p ref={textRef} className="text-3xl md:text-5xl font-light leading-relaxed text-center">
          {text.split(' ').map((word, i) => (
            <span key={i} className="word inline-block mr-[0.3em] text-emerald-100/90">
              {word}
            </span>
          ))}
        </p>
        <p className="text-center mt-8 text-emerald-200/40 text-sm tracking-widest">— DEEPAK CHOPRA</p>
      </div>
    </section>
  );
}
