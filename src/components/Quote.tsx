'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Flowing water canvas
function FlowingWater() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: { x: number; y: number; speed: number; size: number }[] = [];
    const count = 60;
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.3 + Math.random() * 0.5,
        size: 1 + Math.random() * 2,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      for (const p of particles) {
        // Flow left to right with gentle wave
        p.x += p.speed;
        const wave = Math.sin(p.x * 0.02 + p.y * 0.01) * 0.5;
        
        if (p.x > width + 10) p.x = -10;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y + wave, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(100, 180, 220, ${0.06 + p.speed * 0.04})`;
        ctx.fill();
      }
      
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

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

  const words = [
    { text: 'One', highlight: false },
    { text: 'conscious', highlight: true },
    { text: 'breath', highlight: true },
    { text: 'is', highlight: false },
    { text: 'enough', highlight: false },
    { text: 'to', highlight: false },
    { text: 'make', highlight: false },
    { text: 'some', highlight: false },
    { text: 'space.', highlight: true },
  ];
  
  return (
    <section ref={containerRef} className="relative min-h-[80vh] flex items-center justify-center px-8 py-24 bg-[#040804]">
      <FlowingWater />
      <div className="relative z-10 max-w-4xl">
        <p ref={textRef} className="text-3xl md:text-5xl font-extralight leading-relaxed text-center tracking-wide" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          {words.map((word, i) => (
            <span 
              key={i} 
              className={`word inline-block mr-[0.3em] ${word.highlight ? 'text-emerald-400/90' : 'text-emerald-100/50'}`}
            >
              {word.text}
            </span>
          ))}
        </p>
        <p className="text-center mt-8 text-emerald-200/40 text-sm tracking-widest">— ECKHART TOLLE</p>
      </div>
    </section>
  );
}
