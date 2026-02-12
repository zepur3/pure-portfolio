"use client";

import { useIsMobile } from "@/hooks/useIsMobile";

interface FluidEffectProps {
  className?: string;
}

const FluidEffect = ({ className = "" }: FluidEffectProps) => {
  const isMobile = useIsMobile();

  // Sur mobile : 1 seul gradient simple (pas de blur = moins de charge GPU)
  // Sur desktop : 3 gradients avec blur pour un effet riche
  if (isMobile) {
    return (
      <div className={`fixed top-0 left-0 w-full h-full pointer-events-none z-0 ${className}`}>
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, var(--accent-light), transparent 70%), radial-gradient(ellipse at 70% 80%, var(--accent), transparent 70%)',
            opacity: 0.12,
          }}
        />
      </div>
    );
  }

  return (
    <div className={`fixed top-0 left-0 w-full h-full pointer-events-none z-0 ${className}`}>
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 30% 30%, var(--accent-light), transparent 60%)',
          opacity: 0.25,
          filter: 'blur(60px)',
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 70% 70%, var(--accent), transparent 60%)',
          opacity: 0.25,
          filter: 'blur(60px)',
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, var(--accent-dark), transparent 70%)',
          opacity: 0.2,
          filter: 'blur(80px)',
        }}
      />
    </div>
  );
};

export default FluidEffect;
