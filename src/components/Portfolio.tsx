"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useIsMobile } from "@/hooks/useIsMobile";

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const isMobile = useIsMobile();

  const categories = [
    { id: "all", name: "Tous" },
    { id: "saas", name: "SaaS" },
    { id: "client", name: "Client" },
    { id: "web", name: "Sites Web" },
  ];

  const projects = [
    {
      id: 1,
      title: "SaaS Ideas",
      category: "saas",
      image: "/images/portfolio/saas-idaes.webp",
      description: "Plateforme SaaS permettant de créer un site professionnel en 5 minutes. Offres clé en main, sur-mesure et accompagnement. Projet en cours de développement.",
      link: "https://www.idaes.fr/",
      github: "",
      status: "En développement",
      tech: "Next.js / SaaS",
    },
    {
      id: 2,
      title: "Regard d'Hyper(sens)ible",
      category: "client",
      image: "/images/portfolio/regard-hypersensible.webp",
      description: "Blog créé pour une cliente sur l'hypersensibilité. Design épuré et chaleureux, système d'articles, espace communautaire. Site en production avec nom de domaine personnalisé.",
      link: "https://www.regard-dhypersensible.fr/",
      github: "",
      status: "En ligne",
      tech: "Next.js / Firebase",
    },
    {
      id: 3,
      title: "Élagage Pro",
      category: "web",
      image: "/images/portfolio/elagage-pro.webp",
      description: "Site vitrine professionnel pour une entreprise d'élagage. Design moderne et responsive.",
      link: "https://elagage-pro.vercel.app/",
      github: "https://github.com/zepur3/elagage-pro",
      status: "En ligne",
      tech: "Next.js",
    },
    {
      id: 4,
      title: "MAM Project",
      category: "web",
      image: "/images/portfolio/mam.webp",
      description: "Site web moderne développé avec Next.js. Projet complet avec navigation, galerie et formulaire de contact.",
      link: "https://mam-project-six.vercel.app/",
      github: "https://github.com/zepur3/mam-project",
      status: "En ligne",
      tech: "Next.js",
    },
    {
      id: 5,
      title: "Ranch Légumes",
      category: "web",
      image: "/images/portfolio/ranch.webp",
      description: "Site web pour un ranch de légumes bio. Interface claire et intuitive développée avec Next.js.",
      link: "https://ranch-legumes.vercel.app/",
      github: "https://github.com/zepur3/ranch-legumes",
      status: "En ligne",
      tech: "Next.js",
    },
    {
      id: 6,
      title: "Premier Site Web",
      category: "web",
      image: "/images/portfolio/premier-site.webp",
      description: "Mon tout premier site web créé à la main en HTML, CSS et JavaScript pur. Point de départ de mon apprentissage.",
      link: "https://premier-site-drab.vercel.app/index.html",
      github: "https://github.com/zepur3/premier-site",
      status: "En ligne",
      tech: "HTML/CSS/JS",
    },
    {
      id: 7,
      title: "Cabinet de Psychologie",
      category: "client",
      image: "/images/portfolio/psycho-mu-nine.webp",
      description: "Site vitrine professionnel pour un cabinet de psychologie. Design apaisant, présentation des services, prise de RDV via Doctolib et informations pratiques.",
      link: "https://psycho-mu-nine.vercel.app/",
      github: "",
      status: "En ligne",
      tech: "Next.js / Doctolib",
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
              initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={isMobile || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4"
            >
              <span className="text-gradient">Mes</span> Projets
            </motion.h2>
            <motion.p
              initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              animate={isMobile || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto"
            >
              Projets web déployés en ligne, réalisés en parallèle de mon parcours systèmes & réseaux (avec l&apos;assistance de l&apos;IA).
            </motion.p>
          </div>

          <motion.div
            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={isMobile || isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
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
                    : "glass-effect hover:bg-accent/10"
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>

          <motion.div
            ref={ref}
            variants={containerVariants}
            initial={isMobile ? "visible" : "hidden"}
            animate={isMobile || isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {filteredProjects.map((project) => (
              <motion.a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                className="glass-effect rounded-xl overflow-hidden group transition-all duration-500 shadow-custom-sm hover:shadow-custom-lg motion-safe:hover:scale-[1.03] glow-effect cursor-pointer block"
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative overflow-hidden rounded-t-xl aspect-video">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-all duration-700 ease-in-out group-hover:scale-110"
                  />
                  <div 
                    className="absolute inset-0 bg-accent/60 opacity-0 group-hover:opacity-20 transition-all duration-700 ease-in-out"
                  ></div>
                  {/* Badge tech — fond sombre toujours lisible */}
                  <span className="absolute top-3 left-3 text-xs px-2.5 py-1 bg-black/70 backdrop-blur-sm text-white rounded-full font-medium">
                    {project.tech}
                  </span>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg sm:text-xl font-bold transition-all duration-500 group-hover:text-accent">{project.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                      project.status === "En ligne" 
                        ? "bg-green-500/20 text-green-500" 
                        : "bg-amber-500/20 text-amber-500"
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-text-secondary mb-4">{project.description}</p>
                  <div className="flex items-center justify-end">
                    <span className="inline-flex items-center text-accent font-semibold">
                      Voir le site
                      <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>
  );
};

export default Portfolio;
