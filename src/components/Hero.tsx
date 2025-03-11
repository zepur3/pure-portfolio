"use client";

import { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Link from "next/link";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Créer les références en dehors de tout callback
  const layer0Ref = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const layer4Ref = useRef<HTMLDivElement>(null);
  
  // Créer un tableau de références avec useMemo pour éviter les re-rendus inutiles
  const layerRefs = useMemo(() => [layer0Ref, layer1Ref, layer2Ref, layer3Ref, layer4Ref], []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const { clientX, clientY } = e;
      const { width, height } = containerRef.current.getBoundingClientRect();
      
      const xPos = (clientX / width - 0.5);
      const yPos = (clientY / height - 0.5);
      
      layerRefs.forEach((layerRef, index) => {
        if (!layerRef.current) return;
        
        const speed = (index + 1) * 0.05;
        
        gsap.to(layerRef.current, {
          x: xPos * 100 * speed,
          y: yPos * 100 * speed,
          duration: 1,
          ease: "power2.out"
        });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [layerRefs]);

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      <div ref={containerRef} className="parallax-container h-full w-full">
        {/* Fluid Background Effect */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="fluid-effect animate-pulse"></div>
          <div 
            className="fluid-effect" 
            style={{ 
              left: '30%', 
              top: '20%', 
              animation: 'pulse 8s infinite alternate', 
              animationDelay: '1s' 
            }}
          ></div>
          <div 
            className="fluid-effect" 
            style={{ 
              right: '20%', 
              bottom: '10%', 
              animation: 'pulse 7s infinite alternate', 
              animationDelay: '2s' 
            }}
          ></div>
        </div>

        {/* Parallax Layers - Tous avec pointer-events-none */}
        {layerRefs.map((ref, index) => (
          <div 
            key={index} 
            ref={ref} 
            className="parallax-layer absolute inset-0 pointer-events-none"
            style={{ zIndex: index + 1 }}
          >
            {index === 2 && (
              <div className="absolute top-1/3 sm:top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="text-center pointer-events-none"
                >
                  <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
                    <span className="text-gradient">Créateur</span> de Sites Web
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8">
                    Je conçois des expériences web uniques et immersives pour donner vie à vos idées
                  </p>
                </motion.div>
              </div>
            )}
          </div>
        ))}

        {/* Couche interactive pour les boutons avec un z-index très élevé */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <div className="absolute top-2/3 sm:top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="text-center"
            >
              <div className="mt-24 sm:mt-32 md:mt-40 lg:mt-44">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <Link 
                    href="#contact"
                    className="bg-accent hover:bg-accent-light text-white font-bold py-2 sm:py-3 px-8 rounded-full transition-colors duration-300 w-full sm:w-auto cursor-pointer pointer-events-auto"
                  >
                    Me contacter
                  </Link>
                  <Link 
                    href="#portfolio-anchor"
                    className="glass-effect text-foreground font-bold py-2 sm:py-3 px-8 rounded-full transition-all duration-300 w-full sm:w-auto hover:bg-white/10 cursor-pointer pointer-events-auto"
                  >
                    Voir mes projets
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center">
            <span className="text-sm text-text-secondary mb-2">Scroll</span>
            <svg 
              className="w-6 h-6 text-accent" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 14l-7 7m0 0l-7-7m7 7V3" 
              />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
