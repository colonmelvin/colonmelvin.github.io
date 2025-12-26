'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Scene3D = dynamic(() => import('./Scene3D'), { ssr: false });

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      
      tl.from(titleRef.current?.querySelectorAll('.char') || [], {
        yPercent: 100,
        opacity: 0,
        rotateX: -90,
        stagger: 0.03,
        duration: 1.2,
      })
      .from(subtitleRef.current, {
        yPercent: 50,
        opacity: 0,
        duration: 1,
      }, '-=0.5');

      gsap.to(titleRef.current, {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to(subtitleRef.current, {
        yPercent: -30,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '50% top',
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const title = 'EXPLORE';
  
  return (
    <section 
      ref={containerRef}
      className="relative h-[200vh] flex items-start justify-center overflow-hidden"
    >
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center">
        <Scene3D />

        <h1 
          ref={titleRef}
          className="text-[15vw] font-black tracking-tighter leading-none overflow-hidden relative z-10"
        >
          {title.split('').map((char, i) => (
            <span key={i} className="char inline-block gradient-text">
              {char}
            </span>
          ))}
        </h1>
        
        <p 
          ref={subtitleRef}
          className="mt-8 text-xl md:text-2xl text-zinc-400 max-w-md text-center relative z-10"
        >
          Push the boundaries of what&apos;s possible
        </p>

        <div className="absolute bottom-12 flex flex-col items-center gap-2 z-10">
          <span className="text-xs text-zinc-500 uppercase tracking-widest">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-zinc-500 to-transparent" />
        </div>
      </div>
    </section>
  );
}
