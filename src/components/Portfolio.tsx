"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });

  const categories = [
    { id: "all", name: "Tous" },
    { id: "web", name: "Sites Web" },
  ];

  const projects = [
    {
      id: 1,
      title: "Premier Site Web",
      category: "web",
      image: "/images/portfolio/premier-site.png",
      description: "Mon tout premier site web créé entièrement à la main en HTML, CSS et JavaScript pur. Point de départ de mon apprentissage.",
      link: "https://premier-site-drab.vercel.app/index.html",
      github: "https://github.com/zepur3/premier-site",
      status: "En ligne",
      tech: "HTML/CSS/JS",
    },
    {
      id: 2,
      title: "MAM Project",
      category: "web",
      image: "/images/portfolio/mam.png",
      description: "Site web moderne développé avec Next.js. Projet complet avec navigation, galerie et formulaire de contact.",
      link: "https://mam-project-six.vercel.app/",
      github: "https://github.com/zepur3/mam-project",
      status: "En ligne",
      tech: "Next.js",
    },
    {
      id: 3,
      title: "Élagage Pro",
      category: "web",
      image: "/images/portfolio/elagage-pro.png",
      description: "Site vitrine professionnel pour une entreprise d'élagage. Design moderne et responsive.",
      link: "https://elagage-pro.vercel.app/",
      github: "https://github.com/zepur3/elagage-pro",
      status: "En ligne",
      tech: "Next.js",
    },
    {
      id: 4,
      title: "Ranch Légumes",
      category: "web",
      image: "/images/portfolio/ranch.png",
      description: "Site web pour un ranch de légumes bio. Interface claire et intuitive développée avec Next.js.",
      link: "https://ranch-legumes.vercel.app/",
      github: "https://github.com/zepur3/ranch-legumes",
      status: "En ligne",
      tech: "Next.js",
    },
  ];

  const filteredProjects = activeCategory === "all" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

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
      opacity: 1, y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      id="portfolio"
      className="section bg-background relative pt-12 sm:pt-16 pb-16 sm:pb-24 scroll-mt-28"
    >
        <div className="fluid-effect opacity-10 absolute top-1/2 right-1/4"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            >
              <span className="text-gradient">Mes</span> Projets
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto"
            >
              Projets réels déployés sur Vercel. Développés avec l&apos;assistance de l&apos;IA.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center mb-8 sm:mb-12 flex-wrap gap-2"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 sm:px-6 py-2 rounded-full transition-all duration-300 ${
                  activeCategory === category.id
                    ? "bg-accent text-white"
                    : "glass-effect hover:bg-white/10"
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>

          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="glass-effect rounded-xl overflow-hidden group transition-all duration-500 shadow-custom-sm hover:shadow-custom-lg motion-safe:hover:scale-105 motion-safe:active:scale-98 glow-effect"
              >
                <div className="relative overflow-hidden rounded-t-xl aspect-video">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-all duration-700 ease-in-out group-hover:scale-110"
                  />
                  <div 
                    className="absolute inset-0 bg-accent/60 opacity-0 group-hover:opacity-30 transition-all duration-700 ease-in-out backdrop-blur-sm"
                    data-component-name="Portfolio"
                  ></div>
                </div>
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 sm:p-6 transition-all duration-500 group-hover:bg-background/70 group-hover:backdrop-blur-md cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg sm:text-xl font-bold transition-all duration-500 group-hover:text-accent group-hover:scale-105 group-hover:tracking-wide">{project.title}</h3>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded-full">En ligne</span>
                  </div>
                  <p className="text-sm sm:text-base text-text-secondary mb-3">{project.description}</p>
                  <div className="flex items-center text-accent font-semibold">
                    <span>Voir le site</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </motion.a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
  );
};

export default Portfolio;
