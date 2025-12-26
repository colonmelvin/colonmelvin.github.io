'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HorizontalScroll() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      if (!track) return;

      const cards = track.querySelectorAll('.card');
      
      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth + 100),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${track.scrollWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Stagger card reveals
      cards.forEach((card) => {
        gsap.from(card, {
          scale: 0.8,
          opacity: 0,
          rotateY: -15,
          scrollTrigger: {
            trigger: card,
            containerAnimation: gsap.getById('horizontal') || undefined,
            start: 'left 80%',
            end: 'left 50%',
            scrub: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const items = [
    { title: 'Motion', subtitle: 'Fluid animations', color: 'from-violet-500 to-purple-500' },
    { title: 'Design', subtitle: 'Pixel perfect', color: 'from-cyan-500 to-blue-500' },
    { title: 'Code', subtitle: 'Clean & efficient', color: 'from-emerald-500 to-teal-500' },
    { title: 'Create', subtitle: 'Without limits', color: 'from-orange-500 to-red-500' },
    { title: 'Ship', subtitle: 'Launch fast', color: 'from-pink-500 to-rose-500' },
  ];

  return (
    <section ref={containerRef} className="relative bg-zinc-950">
      <div ref={trackRef} className="flex gap-8 px-[10vw] py-20 h-screen items-center">
        {items.map((item, i) => (
          <div
            key={i}
            className="card flex-shrink-0 w-[70vw] md:w-[40vw] h-[60vh] rounded-3xl p-8 flex flex-col justify-end relative overflow-hidden group cursor-pointer"
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-80 group-hover:opacity-100 transition-opacity duration-500`} />
            
            {/* Noise overlay */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay" 
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} 
            />

            {/* Content */}
            <div className="relative z-10">
              <span className="text-white/60 text-sm uppercase tracking-widest">{item.subtitle}</span>
              <h3 className="text-5xl md:text-7xl font-black text-white mt-2">{item.title}</h3>
            </div>

            {/* Hover effect */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
          </div>
        ))}
      </div>
    </section>
  );
}
