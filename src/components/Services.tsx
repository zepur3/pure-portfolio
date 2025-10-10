"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

const Services = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  const services = [
    {
      icon: (
        <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Sites Web Vitrines",
      description: "Création de sites web modernes avec l'assistance de l'IA pour les petites entreprises et artisans."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      title: "Développement Assisté par IA",
      description: "Utilisation d'outils d'IA pour accélérer le développement et améliorer la qualité du code."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: "Intégration Front-end",
      description: "Intégration de designs en sites web fonctionnels avec React, Next.js et Tailwind CSS."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Gestion de Projets GitHub",
      description: "Versionnement et collaboration sur GitHub pour un suivi professionnel des projets."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      title: "Apprentissage Continu",
      description: "En formation constante sur les technologies web et les systèmes & réseaux."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
      title: "Systèmes & Réseaux",
      description: "Objectif professionnel : devenir technicien systèmes et réseaux. Recherche d'alternance."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section id="services" className="section bg-background relative pt-24 md:pt-28">
      <div className="fluid-effect opacity-10 absolute bottom-0 left-0" data-component-name="Services"></div>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView && !isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            <span className="text-gradient">Mes</span> Compétences
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView && !isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-text-secondary max-w-2xl mx-auto"
          >
            Découvrez mes compétences en développement web et mon parcours vers les systèmes et réseaux
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView && !isMobile ? "visible" : "visible"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass-effect p-6 rounded-xl hover:transform hover:scale-105 transition-all duration-300"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-text-secondary">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView && !isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-center mt-12"
          data-component-name="Services"
        >
          <a
            href="#contact"
            className="bg-gradient-to-r from-accent-500 to-accent-700 hover:from-accent-600 hover:to-accent-800 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 inline-flex items-center gap-2 shadow-md hover:shadow-lg glow-effect relative z-10"
            data-component-name="Services"
          >
            Me contacter pour une opportunité
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
      </div>
    </section>
  );
};

export default Services;
