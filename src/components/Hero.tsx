"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Link from "next/link";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Créer les références en dehors de tout callback
  const layer0Ref = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const layer4Ref = useRef<HTMLDivElement>(null);
  
  // Créer un tableau de références avec useMemo pour éviter les re-rendus inutiles
  const layerRefs = useMemo(() => [layer0Ref, layer1Ref, layer2Ref, layer3Ref, layer4Ref], []);

  // Détection de mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent);
      setIsMobile(isMobileDevice || window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    // Marquer le composant comme chargé
    setIsLoaded(true);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Effet de parallaxe - désactivé ou simplifié sur mobile
  useEffect(() => {
    // Ne pas exécuter l'effet tant que le composant n'est pas complètement chargé
    if (!isLoaded) return;
    
    // Si c'est un appareil mobile, ne pas ajouter l'effet de parallaxe
    if (isMobile) {
      // Appliquer une position statique pour les appareils mobiles
      layerRefs.forEach((layerRef) => {
        if (!layerRef.current) return;
        
        // Réinitialiser les transformations pour éviter les problèmes de performance
        gsap.set(layerRef.current, {
          x: 0,
          y: 0,
          clearProps: "transform"
        });
      });
      return;
    }
    
    // Version optimisée de l'effet de parallaxe pour desktop
    let lastMouseMoveTime = 0;
    const mouseMoveThrottle = 16; // ~60fps
    
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMouseMoveTime < mouseMoveThrottle) return;
      lastMouseMoveTime = now;
      
      if (!containerRef.current) return;
      
      const { clientX, clientY } = e;
      const { width, height } = containerRef.current.getBoundingClientRect();
      
      const xPos = (clientX / width - 0.5);
      const yPos = (clientY / height - 0.5);
      
      layerRefs.forEach((layerRef, index) => {
        if (!layerRef.current) return;
        
        // Réduire la vitesse de l'effet pour améliorer les performances
        const speed = (index + 1) * 0.03;
        
        // Utiliser une transformation CSS directe au lieu de GSAP pour de meilleures performances
        layerRef.current.style.transform = `translate(${xPos * 50 * speed}px, ${yPos * 50 * speed}px)`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [layerRefs, isMobile, isLoaded]);

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden mt-0 pt-0">
      <div ref={containerRef} className="parallax-container h-full w-full">
        {/* Fluid Background Effect - Amélioré avec des couleurs plus cohérentes */}
        {!isMobile && (
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-900/20 to-transparent"></div>
            <motion.div 
              className="fluid-effect" 
              style={{ opacity: 0.3 }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.4, 0.3]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
            <motion.div 
              className="fluid-effect" 
              style={{ 
                left: '30%', 
                top: '20%',
                background: 'radial-gradient(circle at center, var(--accent-400), var(--accent-900))',
                opacity: 0.25
              }}
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.25, 0.35, 0.25]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            ></motion.div>
            <motion.div 
              className="fluid-effect" 
              style={{ 
                right: '20%', 
                bottom: '10%',
                background: 'radial-gradient(circle at center, var(--accent-500), var(--accent-800))',
                opacity: 0.2
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{
                duration: 9,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            ></motion.div>
          </div>
        )}

        {/* Parallax Layers - Optimisés pour mobile */}
        {layerRefs.map((ref, index) => (
          <div 
            key={index} 
            ref={ref} 
            className="parallax-layer absolute inset-0 pointer-events-none"
            style={{ 
              zIndex: index + 1,
              // Désactiver les transitions sur mobile pour éviter les ralentissements
              transition: isMobile ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            {index === 2 && (
              <div className="absolute top-1/3 sm:top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                {/* Contenu principal - rendu immédiat sans animation pour améliorer le LCP */}
                <div className="text-center pointer-events-none">
                  <motion.h1 
                    className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <span className="text-gradient">Créateur</span> de Sites Web
                  </motion.h1>
                  <motion.p 
                    className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    Je conçois des expériences web uniques et immersives pour donner vie à vos idées
                  </motion.p>
                </div>
                
                {/* Animations appliquées seulement après le chargement initial */}
                {isLoaded && !isMobile && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="absolute inset-0 z-0 pointer-events-none"
                  />
                )}
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
              transition={{ duration: 1, delay: 0.6 }}
              className="text-center"
            >
              <div className="mt-24 sm:mt-32 md:mt-40 lg:mt-44">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      href="#contact"
                      className="bg-accent hover:bg-accent-600 text-white font-bold py-2 sm:py-3 px-8 rounded-full transition-all duration-300 w-full sm:w-auto cursor-pointer pointer-events-auto shadow-md hover:shadow-lg inline-flex items-center gap-2"
                    >
                      Me contacter
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </Link>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      href="#portfolio-anchor"
                      className="glass-effect text-foreground font-bold py-2 sm:py-3 px-8 rounded-full transition-all duration-300 w-full sm:w-auto hover:bg-accent/5 cursor-pointer pointer-events-auto border border-border-light"
                    >
                      Voir mes projets
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator - Optimisé pour mobile */}
        {isMobile ? (
          <div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none animate-bounce"
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
          </div>
        ) : (
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
        )}
      </div>
    </section>
  );
};

export default Hero;
