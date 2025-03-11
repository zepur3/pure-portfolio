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
    { id: "app", name: "Applications" },
    { id: "design", name: "Design" },
  ];

  const projects = [
    {
      id: 1,
      title: "Site E-commerce",
      category: "web",
      image: "/images/portfolio/ecommerce-website.svg",
      description: "Site e-commerce moderne avec panier d'achat et paiement en ligne.",
      link: "#",
    },
    {
      id: 2,
      title: "Application de Gestion",
      category: "app",
      image: "/images/portfolio/management-app.svg",
      description: "Application web pour la gestion de projets et d'équipes.",
      link: "#",
    },
    {
      id: 3,
      title: "Site Vitrine Entreprise",
      category: "web",
      image: "/images/portfolio/corporate-website.svg",
      description: "Site vitrine élégant pour une entreprise de services.",
      link: "#",
    },
    {
      id: 4,
      title: "Design UI/UX",
      category: "design",
      image: "/images/portfolio/ui-design.svg",
      description: "Conception d'interface utilisateur pour une application mobile.",
      link: "#",
    },
    {
      id: 5,
      title: "Blog Personnel",
      category: "web",
      image: "/images/portfolio/blog-website.svg",
      description: "Blog personnel avec système de gestion de contenu.",
      link: "#",
    },
    {
      id: 6,
      title: "Application Mobile",
      category: "app",
      image: "/images/portfolio/mobile-app.svg",
      description: "Application mobile pour le suivi de fitness et de santé.",
      link: "#",
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
    <>
      {/* Ancre invisible placée avant la section pour un meilleur ciblage */}
      <div id="portfolio-anchor" style={{ position: 'relative', top: '100px', visibility: 'hidden', height: 0 }}></div>
      
      {/* Section portfolio sans ID d'ancre */}
      <section className="section bg-background relative pt-12 sm:pt-16 pb-16 sm:pb-24">
        <div className="fluid-effect opacity-10 absolute top-1/2 right-1/4"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            >
              <span className="text-gradient">Mon</span> Portfolio
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto"
            >
              Découvrez une sélection de mes projets récents qui démontrent mon expertise et ma créativité
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
                className="glass-effect rounded-xl overflow-hidden group transition-all duration-500"
              >
                <div className="relative h-48 sm:h-60 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-all duration-700 ease-in-out group-hover:scale-105"
                  />
                  <div 
                    className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-20 transition-all duration-700 ease-in-out"
                    data-component-name="Portfolio"
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out">
                    <span className="px-3 py-1 sm:px-4 sm:py-2 bg-background/80 text-text-primary rounded-md font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 ease-in-out">
                      Voir le projet
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-6 transition-all duration-500 group-hover:bg-background/50">
                  <h3 className="text-lg sm:text-xl font-bold mb-2 transition-all duration-500 group-hover:text-accent">{project.title}</h3>
                  <p className="text-sm sm:text-base text-text-secondary mb-4">{project.description}</p>
                  <a
                    href={project.link}
                    className="text-accent hover:text-accent-light transition-colors duration-500 inline-flex items-center"
                  >
                    En savoir plus
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Portfolio;
