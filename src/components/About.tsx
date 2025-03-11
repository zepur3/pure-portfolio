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
      {/* Ancre invisible placée avant la section pour un meilleur ciblage */}
      <div id="about-anchor" style={{ position: 'relative', top: '100px', visibility: 'hidden', height: 0 }}></div>

      <section id="about" className="section bg-background relative pt-24 md:pt-28">
        <div className="fluid-effect opacity-10 absolute top-0 right-0"></div>
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <motion.div variants={itemVariants} className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="text-gradient">À propos</span> de moi
              </h2>
              <p className="text-text-secondary mb-6">
                Je suis un développeur web passionné par la création d&apos;expériences web immersives et interactives. 
                Avec plusieurs années d&apos;expérience dans le développement web, je me spécialise dans la 
                conception de sites web modernes, réactifs et performants.
              </p>
              <p className="text-text-secondary mb-8">
                Mon objectif est de transformer vos idées en réalités numériques captivantes qui non seulement 
                impressionnent visuellement, mais offrent également une expérience utilisateur exceptionnelle.
                Je m&apos;engage à créer des solutions sur mesure qui répondent parfaitement à vos besoins et objectifs.
              </p>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Mes compétences</h3>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill, index) => (
                    <motion.span
                      key={index}
                      variants={itemVariants}
                      className="glass-effect px-4 py-2 rounded-full text-sm"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
              
              <motion.a
                href="#contact"
                variants={itemVariants}
                className="bg-accent hover:bg-accent-light text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 inline-block"
              >
                Me contacter
              </motion.a>
            </motion.div>
            
            <motion.div 
              variants={itemVariants} 
              className="order-1 md:order-2 flex justify-center"
            >
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                <div className="absolute inset-0 bg-accent rounded-full opacity-20 blur-2xl"></div>
                <div className="glass-effect rounded-full p-2 relative z-10">
                  <div className="rounded-full overflow-hidden w-60 h-60 md:w-76 md:h-76 relative">
                    {/* Remplacez l'image par votre photo de profil */}
                    <Image
                      src="/profile-placeholder.jpg"
                      alt="Photo de profil"
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-full"
                      priority
                    />
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
