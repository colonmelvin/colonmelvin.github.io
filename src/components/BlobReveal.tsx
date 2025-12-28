'use client';

import { useEffect, useRef, useState } from 'react';

export default function BlobReveal() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const blobRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0 });
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

    const img = new Image();
    img.src = '/images/forest.jpg';

    const SPRING = 0.08;
    const DAMPING = 0.82;
    const BASE_SIZE = 150;

    // Simplex-like noise for organic distortion
    const permutation = Array.from({ length: 256 }, (_, i) => i).sort(() => Math.random() - 0.5);
    const perm = [...permutation, ...permutation];
    
    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a: number, b: number, t: number) => a + t * (b - a);
    const grad = (hash: number, x: number) => (hash & 1 ? x : -x);
    
    const noise1D = (x: number) => {
      const xi = Math.floor(x) & 255;
      const xf = x - Math.floor(x);
      return lerp(grad(perm[xi], xf), grad(perm[xi + 1], xf - 1), fade(xf));
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;
    let animationId: number;
    
    const animate = () => {
      if (!ctx || !canvas) return;
      time += 0.012;

      // Spring physics
      const dx = mouseRef.current.x - blobRef.current.x;
      const dy = mouseRef.current.y - blobRef.current.y;
      blobRef.current.vx += dx * SPRING;
      blobRef.current.vy += dy * SPRING;
      blobRef.current.vx *= DAMPING;
      blobRef.current.vy *= DAMPING;
      blobRef.current.x += blobRef.current.vx;
      blobRef.current.y += blobRef.current.vy;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.beginPath();

      const cx = blobRef.current.x;
      const cy = blobRef.current.y;
      const points = 120;

      for (let i = 0; i <= points; i++) {
        const angle = (i / points) * Math.PI * 2;
        
        // Independent pulsing lobes that grow/shrink
        const lobe1 = Math.sin(time * 1.5) * Math.sin(angle * 2 + 0.5) * 40;
        const lobe2 = Math.sin(time * 2.0 + 1) * Math.sin(angle * 3 + 2) * 30;
        const lobe3 = Math.sin(time * 2.5 + 2) * Math.cos(angle * 2.5) * 25;
        const lobe4 = Math.sin(time * 1.8 + 0.7) * Math.cos(angle * 4 + 1) * 15;
        
        const r = BASE_SIZE + lobe1 + lobe2 + lobe3 + lobe4;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.closePath();
      ctx.clip();

      if (img.complete && img.naturalWidth) {
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
      }

      ctx.restore();
      animationId = requestAnimationFrame(animate);
    };

    img.onload = animate;
    if (img.complete) animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-30 pointer-events-none transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
    />
  );
}
