"use client";

import { useEffect, useRef, useState } from "react";

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
  const [isMobile, setIsMobile] = useState(false);

  // Détection de mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent);
      setIsMobile(isMobileDevice || window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
    contextRef.current = canvas.getContext("2d", { alpha: true });
    const ctx = contextRef.current;
    if (!ctx) return;

    // Create particles - réduire le nombre sur mobile
    const createParticles = () => {
      particlesRef.current = [];
      // Réduire considérablement le nombre de particules sur mobile
      const numberOfParticles = isMobile ? 15 : 40;
      const colors = [
        "rgba(109, 40, 217, 0.5)", // --accent avec opacité réduite
        "rgba(139, 92, 246, 0.5)", // --accent-light avec opacité réduite
        "rgba(76, 29, 149, 0.5)", // --accent-dark avec opacité réduite
      ];

      for (let i = 0; i < numberOfParticles; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          // Réduire la taille des particules sur mobile
          radius: Math.random() * (isMobile ? 12 : 18) + (isMobile ? 5 : 10),
          velocity: {
            // Ralentir les particules sur mobile
            x: Math.random() * (isMobile ? 0.5 : 1.5) - (isMobile ? 0.25 : 0.75),
            y: Math.random() * (isMobile ? 0.5 : 1.5) - (isMobile ? 0.25 : 0.75),
          },
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.4 + 0.1, // Réduire l'opacité globale
        });
      }
    };

    createParticles();

    // Gestionnaire d'événements pour souris et tactile
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    // N'ajouter les écouteurs d'événements que si ce n'est pas un appareil mobile
    // pour économiser des ressources
    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleTouchMove);
    }

    // Animation loop avec throttling pour mobile
    let lastFrameTime = 0;
    const targetFPS = isMobile ? 30 : 60; // Réduire le FPS sur mobile
    const frameInterval = 1000 / targetFPS;
    
    const animate = (timestamp: number) => {
      if (!ctx || !canvas) return;
      
      // Limiter le FPS sur mobile
      const elapsed = timestamp - lastFrameTime;
      if (elapsed < frameInterval && isMobile) {
        frameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = timestamp;

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

        // Mouse interaction - désactivé sur mobile pour économiser des ressources
        if (!isMobile) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150; // Réduire la distance d'interaction

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance;
            particle.velocity.x -= (dx / distance) * force * 0.01; // Réduire la force
            particle.velocity.y -= (dy / distance) * force * 0.01;
          }
        }

        // Simplifier le rendu sur mobile
        ctx.beginPath();
        if (isMobile) {
          // Utiliser des cercles simples sur mobile au lieu de gradients
          ctx.fillStyle = particle.color;
          ctx.globalAlpha = particle.opacity;
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Utiliser des gradients sur desktop
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
        }
      });

      // Blend particles
      ctx.globalCompositeOperation = "screen";
      
      frameRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      if (!isMobile) {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("touchmove", handleTouchMove);
      }
      cancelAnimationFrame(frameRef.current);
    };
  }, [isMobile]); // Ajouter isMobile comme dépendance

  // Si c'est un mobile avec des performances très limitées, on peut même désactiver complètement l'effet
  if (isMobile && window.innerWidth < 480) {
    return null;
  }

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed top-0 left-0 w-full h-full pointer-events-none z-0 ${className}`}
    />
  );
};

export default FluidEffect;
