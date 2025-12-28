'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Flowing water canvas - river shape
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

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    // River path function - gentle S curve at bottom
    const getRiverY = (x: number) => {
      const normalized = x / width;
      return height * 0.75 + Math.sin(normalized * Math.PI * 2) * 40;
    };

    const particles: { x: number; yOffset: number; speed: number; size: number; phase: number }[] = [];
    const count = 100;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        yOffset: (Math.random() - 0.5) * 50, // Spread within river width
        speed: 0.5 + Math.random() * 0.8,
        size: 1.5 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.015;
      
      for (const p of particles) {
        p.x += p.speed;
        if (p.x > width + 10) {
          p.x = -10;
          p.yOffset = (Math.random() - 0.5) * 50;
        }
        
        const riverY = getRiverY(p.x);
        const wave = Math.sin(time + p.phase) * 3;
        const y = riverY + p.yOffset + wave;
        
        ctx.beginPath();
        ctx.ellipse(p.x, y, p.size * 1.5, p.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120, 180, 210, ${0.15 + p.speed * 0.06})`;
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
            start: 'top 80%',
            end: 'center center',
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
    <section ref={containerRef} className="relative min-h-[80vh] flex items-center justify-center px-8 pt-24 pb-48 bg-[#040804]">
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
