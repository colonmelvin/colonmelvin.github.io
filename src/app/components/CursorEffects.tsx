'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useVibeStore } from '@/lib/vibe-store';

export default function CursorEffects() {
  const { focusMode, animationSpeed, isMobile } = useVibeStore();
  const cursorRef = useRef<HTMLDivElement>(null);
  
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (isMobile) return; // Skip cursor effects on mobile

    const updateCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const createTrail = (e: MouseEvent) => {
      // Only create trails if focus mode allows it
      if (focusMode < 30) return;

      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.left = e.clientX + 'px';
      trail.style.top = e.clientY + 'px';
      trail.style.animationDuration = `${2 / animationSpeed}s`;
      
      document.body.appendChild(trail);

      // Remove trail after animation
      setTimeout(() => {
        if (trail.parentNode) {
          trail.parentNode.removeChild(trail);
        }
      }, 2000 / animationSpeed);
    };

    const handleMouseMove = (e: MouseEvent) => {
      updateCursor(e);
      
      // Throttle trail creation based on focus mode
      if (Math.random() < (focusMode / 100) * 0.3) {
        createTrail(e);
      }
    };

    const handleMouseEnter = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '1';
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, focusMode, animationSpeed, isMobile]);

  // Don't render on mobile
  if (isMobile) return null;

  return (
    <>
      {/* Main Cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed pointer-events-none z-50 mix-blend-mode-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="w-6 h-6 rounded-full border-2"
          style={{
            borderColor: 'var(--color-primary)',
            backgroundColor: 'transparent',
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2 / animationSpeed,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Cursor Glow */}
      <motion.div
        className="fixed pointer-events-none z-40"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="w-20 h-20 rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, var(--color-primary) 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3 / animationSpeed,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Interactive Elements Glow */}
      <InteractiveGlow />
    </>
  );
}

function InteractiveGlow() {
  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Add glow to interactive elements
      if (target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.hasAttribute('data-interactive')) {
        target.style.boxShadow = `0 0 20px var(--color-primary)`;
        target.style.transform = 'scale(1.05)';
        target.style.transition = 'all 0.3s ease';
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.tagName === 'BUTTON' || 
          target.tagName === 'A' || 
          target.hasAttribute('data-interactive')) {
        target.style.boxShadow = '';
        target.style.transform = '';
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return null;
}
