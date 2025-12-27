'use client';

import { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  settled: boolean;
}

export default function ParticleText({ text = 'breathe' }: { text?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Create offscreen canvas to sample text
    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    const fontSize = Math.min(dimensions.width * 0.14, 180);
    offscreen.width = dimensions.width;
    offscreen.height = dimensions.height;

    offCtx.fillStyle = 'white';
    offCtx.font = `200 ${fontSize}px Inter, system-ui, sans-serif`;
    offCtx.textAlign = 'center';
    offCtx.textBaseline = 'middle';
    offCtx.fillText(text, dimensions.width / 2, dimensions.height * 0.55);

    // Sample pixels to get particle positions
    const imageData = offCtx.getImageData(0, 0, dimensions.width, dimensions.height);
    const pixels = imageData.data;
    const particles: Particle[] = [];
    const gap = 4; // Sample every 4th pixel

    for (let y = 0; y < dimensions.height; y += gap) {
      for (let x = 0; x < dimensions.width; x += gap) {
        const i = (y * dimensions.width + x) * 4;
        if (pixels[i + 3] > 128) {
          // Start from random positions (chaos)
          const startX = Math.random() * dimensions.width;
          const startY = Math.random() * dimensions.height;
          
          particles.push({
            x: startX,
            y: startY,
            targetX: x,
            targetY: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            size: Math.random() * 1.5 + 0.8,
            alpha: Math.random() * 0.3 + 0.15,
            settled: false,
          });
        }
      }
    }

    particlesRef.current = particles;
    startTimeRef.current = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / 12000, 1); // 12 seconds to settle (slower)
      
      ctx.fillStyle = 'rgba(4, 7, 4, 0.05)'; // Slower fade for smoother trails
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      const easeProgress = 1 - Math.pow(1 - progress, 3); // Gentler ease

      for (const p of particlesRef.current) {
        if (progress < 1) {
          // Chaotic phase - particles drift and slowly move toward target
          if (progress < 0.35) {
            // Longer gentle chaos
            p.x += p.vx * 0.4;
            p.y += p.vy * 0.4;
            p.vx *= 0.995;
            p.vy *= 0.995;
            p.vx += (Math.random() - 0.5) * 0.15;
            p.vy += (Math.random() - 0.5) * 0.15;
          } else {
            // Gradually move toward target
            const attraction = (easeProgress - 0.25) * 0.8;
            p.x += (p.targetX - p.x) * attraction * 0.025;
            p.y += (p.targetY - p.y) * attraction * 0.025;
            // Add subtle drift
            p.x += Math.sin(currentTime * 0.001 + p.targetX * 0.01) * (1 - easeProgress) * 1.2;
            p.y += Math.cos(currentTime * 0.001 + p.targetY * 0.01) * (1 - easeProgress) * 1.2;
          }
        } else {
          // Settled - gentle breathing motion
          p.x = p.targetX + Math.sin(currentTime * 0.0008 + p.targetX * 0.01) * 1;
          p.y = p.targetY + Math.cos(currentTime * 0.001 + p.targetY * 0.01) * 1;
          p.settled = true;
        }

        // Draw particle - darker, more subtle
        const alpha = p.settled 
          ? 0.35 + Math.sin(currentTime * 0.0015) * 0.08 
          : p.alpha * 0.6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(134, 197, 169, ${alpha})`; // Darker emerald
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions, text]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
