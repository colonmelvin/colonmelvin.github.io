'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxGallery() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = containerRef.current?.querySelectorAll('.parallax-item');
      if (!items) return;

      items.forEach((item, i) => {
        const speed = (i % 3 - 1) * 100; // -100, 0, 100
        
        gsap.to(item, {
          y: speed,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });

        // Scale on scroll
        gsap.fromTo(item.querySelector('.parallax-inner'), 
          { scale: 1.2 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'top top',
              scrub: true,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const images = [
    { aspect: 'aspect-[3/4]', offset: 'mt-0' },
    { aspect: 'aspect-square', offset: 'mt-32' },
    { aspect: 'aspect-[4/5]', offset: 'mt-16' },
    { aspect: 'aspect-[3/4]', offset: 'mt-48' },
    { aspect: 'aspect-[4/3]', offset: 'mt-8' },
    { aspect: 'aspect-[3/4]', offset: 'mt-24' },
  ];

  return (
    <section ref={containerRef} className="py-32 px-8 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-6xl md:text-8xl font-black text-white mb-20">
          Gallery
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {images.map((img, i) => (
            <div 
              key={i} 
              className={`parallax-item ${img.offset} overflow-hidden rounded-2xl`}
            >
              <div className={`parallax-inner ${img.aspect} bg-gradient-to-br from-zinc-800 to-zinc-900 relative overflow-hidden group`}>
                {/* Placeholder gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Number overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-8xl font-black text-white/5 group-hover:text-white/10 transition-colors duration-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
