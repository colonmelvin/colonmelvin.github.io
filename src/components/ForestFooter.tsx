'use client';

import MagneticButton from './MagneticButton';

export default function ForestFooter() {
  return (
    <footer className="py-24 px-8 bg-[#040804] border-t border-emerald-900/20">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-black text-emerald-100/90 mb-6">
          Let&apos;s connect
        </h2>
        <p className="text-emerald-200/50 mb-12 text-lg">Find me in the digital wilderness</p>
        
        <div className="flex justify-center gap-6 mb-16">
          {[
            { label: 'GitHub', href: 'https://github.com/colonmelvin' },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/colonmelvin' },
            { label: 'Twitter', href: 'https://twitter.com/colonmelvin' },
          ].map((link) => (
            <MagneticButton key={link.label} className="px-6 py-3 rounded-full border border-emerald-800/50 text-emerald-200/70 hover:text-emerald-100 hover:border-emerald-600/50 transition-colors">
              {link.label}
            </MagneticButton>
          ))}
        </div>

        <p className="text-emerald-200/30 text-sm">© 2025 Colon Melvin</p>
      </div>
    </footer>
  );
}
