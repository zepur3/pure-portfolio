"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import TypingText from "./TypingText";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useTheme } from "./ThemeProvider";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  
  // Créer les références en dehors de tout callback
  const layer0Ref = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);
  const layer3Ref = useRef<HTMLDivElement>(null);
  const layer4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Effet de parallaxe - désactivé ou simplifié sur mobile
  useEffect(() => {
    // Ne pas exécuter l'effet tant que le composant n'est pas complètement chargé
    if (!isLoaded) return;

    const layers = [layer0Ref, layer1Ref, layer2Ref, layer3Ref, layer4Ref];
    
    // Si c'est un appareil mobile, ne pas ajouter l'effet de parallaxe
    if (isMobile) {
      // Appliquer une position statique pour les appareils mobiles
      layers.forEach((layerRef) => {
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
      
      layers.forEach((layerRef, index) => {
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
  }, [isMobile, isLoaded]);

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden mt-0 pt-0">
      <div ref={containerRef} className="parallax-container min-h-screen w-full flex items-center justify-center">
        {/* Fluid Background Effect - Desktop uniquement */}
        {!isMobile && (
          <div className="absolute inset-0 z-0 pointer-events-none mix-blend-normal">
            {!isLightTheme && (
              <>
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, transparent 70%)",
                  }}
                ></div>
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
              </>
            )}
          </div>
        )}

        {/* Parallax Layers - Desktop uniquement */}
        {!isMobile && (
          <>
            <div ref={layer0Ref} className="parallax-layer absolute inset-0 pointer-events-none" style={{ zIndex: 1, transition: 'transform 0.3s ease-out' }} />
            <div ref={layer1Ref} className="parallax-layer absolute inset-0 pointer-events-none" style={{ zIndex: 2, transition: 'transform 0.3s ease-out' }} />
            <div ref={layer3Ref} className="parallax-layer absolute inset-0 pointer-events-none" style={{ zIndex: 4, transition: 'transform 0.3s ease-out' }} />
            <div ref={layer4Ref} className="parallax-layer absolute inset-0 pointer-events-none" style={{ zIndex: 5, transition: 'transform 0.3s ease-out' }} />
          </>
        )}

        {/* Contenu principal centré */}
        <div
          ref={!isMobile ? layer2Ref : undefined}
          className="relative z-10 w-full px-4 sm:px-6"
          style={!isMobile ? { transition: 'transform 0.3s ease-out' } : undefined}
        >
          <div className="text-center max-w-4xl mx-auto pt-20 sm:pt-0">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4"
              style={isLightTheme ? {
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92), rgba(30, 41, 59, 0.92))',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              } : undefined}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="text-gradient">Technicien</span> Systèmes & Réseaux
            </motion.h1>

            <motion.div
              className="flex flex-wrap justify-center gap-2 mb-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <span className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium glass-effect border border-border-light">Recherche alternance / formation</span>
              <span className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium glass-effect border border-border-light">Albi, France</span>
              <span className="px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium glass-effect border border-border-light">En formation</span>
            </motion.div>

            <motion.p
              className="text-sm sm:text-base md:text-xl text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed px-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {isMobile ? (
                <span>En formation, je vise un poste en systèmes & réseaux. Le développement web assisté par IA est un projet parallèle pour apprendre et pratiquer.</span>
              ) : (
                <TypingText text="En formation, je vise un poste en systèmes & réseaux. Le développement web assisté par IA est un projet parallèle pour apprendre et pratiquer." speed={32} className="inline-block" />
              )}
            </motion.p>

            {/* Boutons CTA - directement dans le flux */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center items-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a 
                  href="#contact"
                  className={`font-bold py-3 px-6 sm:px-8 rounded-full transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg inline-flex items-center gap-2 glow-effect text-sm sm:text-base ${isLightTheme ? "bg-white text-accent-700 border border-accent-200 hover:bg-accent-50" : "bg-gradient-to-r from-accent-500 to-accent-700 hover:from-accent-600 hover:to-accent-800 text-white"}`}
                  style={{ position: 'relative', overflow: 'hidden' }}
                  onMouseDown={e => {
                    const btn = e.currentTarget;
                    const circle = document.createElement('span');
                    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
                    const radius = diameter / 2;
                    circle.style.width = circle.style.height = `${diameter}px`;
                    circle.style.left = `${e.nativeEvent.offsetX - radius}px`;
                    circle.style.top = `${e.nativeEvent.offsetY - radius}px`;
                    circle.className = 'ripple';
                    btn.appendChild(circle);
                    setTimeout(() => {
                      circle.remove();
                    }, 600);
                  }}
                >
                  Candidature / alternance
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
                </a>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a 
                  href="#portfolio"
                  className={`font-bold py-3 px-6 sm:px-8 rounded-full transition-all duration-300 cursor-pointer border text-sm sm:text-base ${isLightTheme ? "bg-accent-100/70 text-accent-800 border-accent-200 hover:bg-accent-200/70" : "glass-effect text-foreground hover:bg-accent/5 border-border-light"}`}
                >
                  Voir mes projets web
                </a>
              </motion.div>
            </motion.div>
          </div>

          {/* Particules flottantes - Desktop uniquement */}
          {isLoaded && !isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute inset-0 z-0 pointer-events-none"
            >
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-accent-400 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-accent-300 rounded-full opacity-40 animate-pulse animation-delay-1000"></div>
              <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-accent-500 rounded-full opacity-50 animate-pulse animation-delay-2000"></div>
              <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-accent-200 rounded-full opacity-30 animate-pulse animation-delay-3000"></div>
            </motion.div>
          )}
        </div>

        {/* Scroll Indicator */}
        {isMobile ? (
          <div 
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none animate-bounce"
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
