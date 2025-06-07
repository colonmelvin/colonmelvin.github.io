'use client';

import { motion } from 'framer-motion';
import { useVibeStore } from '@/lib/vibe-store';
import VibeControls from './components/VibeControls';
import CursorEffects from './components/CursorEffects';
import CodeDisplay from './components/CodeDisplay';
import ClientOnly from './components/ClientOnly';
import VibeInitializer from './components/VibeInitializer';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Initialize vibe settings */}
      <ClientOnly>
        <VibeInitializer />
      </ClientOnly>
      
      {/* Cursor Effects - Client Only */}
      <ClientOnly>
        <CursorEffects />
      </ClientOnly>
      
      {/* Background Gradient */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, var(--color-primary) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, var(--color-accent) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, var(--color-complement) 0%, transparent 50%),
            linear-gradient(135deg, var(--bg-base) 0%, var(--bg-elevated) 100%)
          `
        }}
      />
      
      {/* Main Content */}
      <main className="relative z-10">
        {/* Header */}
        <motion.header 
          className="flex justify-end items-center p-6 md:p-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ClientOnly>
            <VibeControls />
          </ClientOnly>
        </motion.header>

        {/* Hero Section */}
        <section className="px-6 md:px-8 py-12 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-glow" style={{ color: 'var(--text-primary)' }}>
                  Feel the{' '}
                </span>
                <motion.span
                  className="text-glow"
                  style={{ color: 'var(--color-primary)' }}
                  animate={{ 
                    textShadow: [
                      '0 0 5px var(--color-primary)',
                      '0 0 20px var(--color-primary), 0 0 30px var(--color-primary)',
                      '0 0 5px var(--color-primary)'
                    ]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Vibe
                </motion.span>
              </h2>
              
              <motion.p 
                className="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Adjust the dials. Control the atmosphere. Create your perfect coding environment 
                where creativity flows and focus comes naturally.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {/* Amazon Q CLI Credit - Better Typography & UX */}
                <motion.div
                  className="order-2 sm:order-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <motion.div 
                    className="text-center px-4 py-2 rounded-full glass-effect-subtle"
                    style={{ 
                      backgroundColor: 'rgba(var(--color-primary-rgb), 0.05)',
                      border: '1px solid rgba(var(--color-primary-rgb), 0.1)'
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      backgroundColor: 'rgba(var(--color-primary-rgb), 0.08)',
                      border: '1px solid rgba(var(--color-primary-rgb), 0.2)'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.p 
                      className="text-sm font-medium tracking-wide"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      <span className="opacity-75">vibing with </span>
                      <motion.a
                        href="https://github.com/aws/amazon-q-developer-cli"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative inline-block font-semibold"
                        whileHover={{ 
                          textShadow: '0 0 12px var(--color-primary)',
                          scale: 1.05
                        }}
                        transition={{ duration: 0.3 }}
                        style={{ color: 'var(--color-primary)' }}
                      >
                        Amazon Q CLI
                      </motion.a>
                      <span className="opacity-75"> from </span>
                      <span 
                        className="font-mono text-xs px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: 'rgba(var(--color-primary-rgb), 0.1)',
                          color: 'var(--color-primary)'
                        }}
                      >
                        prompt
                      </span>
                      <span className="opacity-75"> to </span>
                      <span 
                        className="font-mono text-xs px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: 'rgba(var(--color-accent-rgb), 0.1)',
                          color: 'var(--color-accent)'
                        }}
                      >
                        prod
                      </span>
                    </motion.p>
                  </motion.div>
                </motion.div>

                <ClientOnly>
                  <div className="order-1 sm:order-2">
                    <VibeButton />
                  </div>
                </ClientOnly>
                
                <motion.div
                  className="order-3 text-sm opacity-60"
                  style={{ color: 'var(--text-muted)' }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Move your cursor around ✨
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Code Display Section */}
        <section className="px-6 md:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <ClientOnly>
              <CodeDisplay />
            </ClientOnly>
          </div>
        </section>

      </main>
    </div>
  );
}

function VibeButton() {
  return (
    <motion.button
      className="px-8 py-4 rounded-lg font-semibold text-lg glass-effect focus-ring"
      style={{ 
        color: 'var(--color-primary)',
        borderColor: 'var(--color-primary)'
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: '0 0 20px var(--color-primary)'
      }}
      whileTap={{ scale: 0.95 }}
      onClick={() => useVibeStore.getState().togglePanel()}
    >
      🎛️ Open Vibe Controls
    </motion.button>
  );
}
