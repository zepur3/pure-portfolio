"use client";

import { useEffect, useRef } from "react";

interface FluidEffectProps {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  velocity: {
    x: number;
    y: number;
  };
  color: string;
  opacity: number;
}

const FluidEffect = ({ className = "" }: FluidEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Get canvas context
    contextRef.current = canvas.getContext("2d");
    const ctx = contextRef.current;
    if (!ctx) return;

    // Create particles
    const createParticles = () => {
      particlesRef.current = [];
      const numberOfParticles = 50;
      const colors = [
        "rgba(109, 40, 217, 0.7)", // --accent
        "rgba(139, 92, 246, 0.7)", // --accent-light
        "rgba(76, 29, 149, 0.7)", // --accent-dark
      ];

      for (let i = 0; i < numberOfParticles; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 20 + 10,
          velocity: {
            x: Math.random() * 2 - 1,
            y: Math.random() * 2 - 1,
          },
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
    };

    createParticles();

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;

        // Bounce off walls
        if (particle.x > canvas.width || particle.x < 0) {
          particle.velocity.x *= -1;
        }
        if (particle.y > canvas.height || particle.y < 0) {
          particle.velocity.y *= -1;
        }

        // Mouse interaction
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 200;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          particle.velocity.x -= (dx / distance) * force * 0.02;
          particle.velocity.y -= (dy / distance) * force * 0.02;
        }

        // Draw particle
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
          particle.x, 
          particle.y, 
          0, 
          particle.x, 
          particle.y, 
          particle.radius
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.fillStyle = gradient;
        ctx.globalAlpha = particle.opacity;
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Blend particles
      ctx.globalCompositeOperation = "screen";
      
      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed top-0 left-0 w-full h-full pointer-events-none z-0 ${className}`}
    />
  );
};

export default FluidEffect;
