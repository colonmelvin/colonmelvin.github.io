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
    const gap = 4;

    for (let y = 0; y < dimensions.height; y += gap) {
      for (let x = 0; x < dimensions.width; x += gap) {
        const i = (y * dimensions.width + x) * 4;
        if (pixels[i + 3] > 128) {
          // Start off-screen left, scattered vertically
          particles.push({
            x: -50 + (Math.random() - 0.5) * 30,
            y: y + (Math.random() - 0.5) * 100,
            targetX: x,
            targetY: y,
            vx: 0,
            vy: 0,
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
      const delay = 3000; // Wait 3s for trees to start loading
      const adjustedElapsed = Math.max(0, elapsed - delay);
      const progress = Math.min(adjustedElapsed / 8000, 1); // 8 seconds to form
      
      ctx.clearRect(0, 0, dimensions.width, dimensions.height); // Clear fully to avoid smear

      if (progress === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      for (const p of particlesRef.current) {
        if (progress < 1) {
          // Breath wave moves left to right - particles settle when wave reaches them
          const waveX = progress * (dimensions.width + 200) - 100;
          const distFromWave = p.targetX - waveX;
          
          if (distFromWave < 0) {
            // Wave has passed - settle into place
            p.x += (p.targetX - p.x) * 0.08;
            p.y += (p.targetY - p.y) * 0.08;
          } else if (distFromWave < 150) {
            // In the wave - being blown along
            p.x += (waveX - p.x) * 0.03 + 3;
            p.y += (p.targetY - p.y) * 0.02 + (Math.random() - 0.5) * 2;
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
      className="absolute inset-0 z-40 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
