'use client';

import { useEffect, useRef, useState } from 'react';

export default function ButtonParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollY < window.innerHeight * 0.5);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Button position (fixed bottom-16, centered)
    const getButtonPos = () => ({
      x: window.innerWidth / 2,
      y: window.innerHeight - 64 - 24 // bottom-16 + half button height
    });

    // Particles
    const particles: { x: number; y: number; vx: number; vy: number; life: number; size: number }[] = [];
    const PARTICLE_COUNT = 25;

    // Spawn particles around edges
    const spawnParticle = () => {
      const side = Math.floor(Math.random() * 4);
      let x, y;
      if (side === 0) { x = Math.random() * canvas.width; y = -10; }
      else if (side === 1) { x = canvas.width + 10; y = Math.random() * canvas.height; }
      else if (side === 2) { x = Math.random() * canvas.width; y = canvas.height + 10; }
      else { x = -10; y = Math.random() * canvas.height; }
      
      particles.push({ x, y, vx: 0, vy: 0, life: 1, size: 1.5 + Math.random() * 2 });
    };

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const btn = getButtonPos();

      // Spawn new particles
      if (particles.length < PARTICLE_COUNT && Math.random() < 0.08) {
        spawnParticle();
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // Attract toward button
        const dx = btn.x - p.x;
        const dy = btn.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist > 5) {
          const force = 0.05;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
        
        // Damping
        p.vx *= 0.96;
        p.vy *= 0.98;
        
        p.x += p.vx;
        p.y += p.vy;

        // Fade when close to button
        if (dist < 60) {
          p.life -= 0.03;
        }

        // Remove dead particles
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167, 243, 208, ${p.life * 0.4})`;
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

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-40 pointer-events-none transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}
