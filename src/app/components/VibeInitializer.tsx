'use client';

import { useEffect } from 'react';
import { useVibeStore } from '@/lib/vibe-store';

export default function VibeInitializer() {
  const { setIsMobile, updateCSSVariables } = useVibeStore();

  useEffect(() => {
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Initialize CSS variables
    updateCSSVariables();
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile, updateCSSVariables]);

  return null; // This component doesn't render anything
}
