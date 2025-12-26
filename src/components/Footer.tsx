'use client';

import MagneticButton from './MagneticButton';

export default function Footer() {
  return (
    <footer className="py-32 px-8 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-4">
              Let&apos;s create<br />
              <span className="gradient-text">something</span>
            </h2>
            <p className="text-zinc-500 text-lg">Ready to push boundaries?</p>
          </div>
          
          <MagneticButton className="group relative px-12 py-6 rounded-full border border-zinc-700 hover:border-indigo-500 transition-colors duration-300">
            <span className="text-white text-lg font-medium group-hover:text-indigo-400 transition-colors">
              Get in touch →
            </span>
          </MagneticButton>
        </div>

        <div className="mt-32 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-sm">© 2025 All rights reserved</p>
          <div className="flex gap-8">
            {['Twitter', 'GitHub', 'LinkedIn'].map((link) => (
              <a key={link} href="#" className="text-zinc-500 hover:text-white transition-colors text-sm">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
