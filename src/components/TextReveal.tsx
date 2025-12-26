'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function TextReveal() {
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
          stagger: 0.1,
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

  const text = "We craft digital experiences that push creative boundaries and challenge conventional design. Every pixel matters. Every animation tells a story.";
  
  return (
    <section ref={containerRef} className="min-h-screen flex items-center justify-center px-8 py-32 bg-zinc-950">
      <p ref={textRef} className="text-3xl md:text-5xl lg:text-6xl font-medium leading-tight max-w-5xl text-center">
        {text.split(' ').map((word, i) => (
          <span key={i} className="word inline-block mr-[0.25em] text-white">
            {word}
          </span>
        ))}
      </p>
    </section>
  );
}
