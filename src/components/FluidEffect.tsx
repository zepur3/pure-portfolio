"use client";

import { useIsMobile } from "@/hooks/useIsMobile";

interface FluidEffectProps {
  className?: string;
}

const FluidEffect = ({ className = "" }: FluidEffectProps) => {
  const isMobile = useIsMobile();

  // Au lieu d'utiliser un canvas, on utilise simplement des div avec des effets CSS
  return (
    <div className={`fixed top-0 left-0 w-full h-full pointer-events-none z-0 ${className}`}>
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 30% 30%, var(--accent-light), transparent 60%)',
          opacity: isMobile ? 0.15 : 0.25,
          filter: `blur(${isMobile ? '30px' : '60px'})`,
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 70% 70%, var(--accent), transparent 60%)',
          opacity: isMobile ? 0.15 : 0.25,
          filter: `blur(${isMobile ? '30px' : '60px'})`,
        }}
      />
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, var(--accent-dark), transparent 70%)',
          opacity: isMobile ? 0.1 : 0.2,
          filter: `blur(${isMobile ? '40px' : '80px'})`,
        }}
      />
    </div>
  );
};

export default FluidEffect;
