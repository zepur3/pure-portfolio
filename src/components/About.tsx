"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const About = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const skills = [
    "HTML/CSS", "JavaScript", "React", "Next.js", "Tailwind CSS", 
    "Node.js", "UI/UX Design", "Responsive Design", "SEO", "Performance"
  ];

  return (
    <>
      {/* Ancre invisible placée avant la section pour un meilleur ciblage - réduit la distance */}
      <div id="about-anchor" style={{ position: 'relative', top: '20px', visibility: 'hidden', height: 0 }}></div>

      <section id="about" className="section bg-background relative pt-8 md:pt-12 overflow-hidden">
        {/* Effets fluides améliorés - cohérents avec le Hero */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div 
            className="fluid-effect" 
            style={{ 
              right: '0',
              top: '0',
              width: '60%',
              height: '100%',
              background: 'radial-gradient(circle at center, var(--accent-400), var(--accent-900))',
              opacity: 0.15
            }}
            data-component-name="About"
          ></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            data-component-name="MotionComponent"
          >
            {/* Contenu textuel - occupe plus d'espace */}
            <motion.div variants={itemVariants} className="order-2 md:order-1 md:col-span-7">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="text-gradient">À propos</span> de moi
              </h2>
              <p className="text-text-secondary mb-6 leading-relaxed">
                Je suis un développeur web passionné par la création d&apos;expériences web immersives et interactives. 
                Avec plusieurs années d&apos;expérience dans le développement web, je me spécialise dans la 
                conception de sites web modernes, réactifs et performants.
              </p>
              <p className="text-text-secondary mb-8 leading-relaxed">
                Mon objectif est de transformer vos idées en réalités numériques captivantes qui non seulement 
                impressionnent visuellement, mais offrent également une expérience utilisateur exceptionnelle.
                Je m&apos;engage à créer des solutions sur mesure qui répondent parfaitement à vos besoins et objectifs.
              </p>
              
              <div className="mb-8" data-component-name="About">
                <h3 className="text-xl font-semibold mb-4 text-foreground" data-component-name="About">Mes compétences</h3>
                <div className="flex flex-wrap gap-2" data-component-name="About">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-background border border-accent text-accent font-medium px-3 py-1.5 rounded-full text-sm shadow-sm hover:bg-accent hover:text-white transition-all duration-300"
                      data-component-name="About"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <motion.a
                href="#contact"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-accent hover:bg-accent-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 inline-flex items-center gap-2 shadow-md hover:shadow-lg"
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
              </motion.a>
            </motion.div>
            
            {/* Photo - occupe moins d'espace */}
            <motion.div variants={itemVariants} className="order-1 md:order-2 md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-xs rounded-2xl overflow-hidden shadow-md border border-border-light">
                <div className="relative w-full" style={{ paddingBottom: "100%" }}>
                  <Image
                    src="/profile-placeholder.jpg"
                    alt="Portrait du développeur"
                    fill
                    sizes="(max-width: 768px) 80vw, 300px"
                    className="object-cover rounded-2xl"
                    priority
                  />
                </div>
                
                {/* Overlay design element */}
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-accent-700 opacity-80 rounded-full blur-xl"></div>
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-accent-500 opacity-60 rounded-full blur-xl"></div>
                
                {/* Badge flottant */}
                <div 
                  className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg border border-border-medium shadow-md"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                    <span className="text-xs font-medium">Disponible pour des projets</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default About;
