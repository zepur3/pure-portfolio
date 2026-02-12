"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Détection de la section active
      const sections = document.querySelectorAll("section[id]");
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop - 100;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const sectionId = section.getAttribute("id") || "";

        if (offset >= sectionTop && offset < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fermer le menu mobile en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const navLinks = [
    { name: "Accueil", href: "#home" },
    { name: "Profil", href: "#about" },
    { name: "Compétences", href: "#services" },
    { name: "Projets web", href: "#portfolio" },
    { name: "Contact", href: "#contact" },
  ];

  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const navbarClasses = `fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
    scrolled
      ? "bg-background/80 backdrop-blur-md py-2 shadow-lg"
      : "bg-transparent py-4"
  }`;

  return (
    <motion.nav 
      ref={navRef}
      className={navbarClasses}
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center">
          <a href="#home" className="text-2xl font-bold text-gradient">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Portfolio
            </motion.div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`relative px-2 py-1 transition-colors duration-300 ${
                  activeSection === link.href.substring(1)
                    ? "text-accent font-medium"
                    : "text-foreground hover:text-accent-light"
                }`}
                aria-current={activeSection === link.href.substring(1) ? "page" : undefined}
              >
                {link.name}
                {activeSection === link.href.substring(1) && (
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-accent"
                    layoutId="navbar-indicator"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </a>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile Navigation Button and Theme Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <motion.button
              className="text-foreground focus:outline-none p-2 rounded-full hover:bg-opacity-10 hover:bg-foreground"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={isOpen}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ 
              duration: 0.3,
              ease: "easeInOut"
            }}
            className={`md:hidden glass-effect mt-2 mx-4 rounded-lg overflow-hidden mobile-menu ${isOpen ? "open" : ""}`}
          >
            <motion.div 
              className="flex flex-col space-y-4 py-4 px-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                staggerChildren: 0.1,
                delayChildren: 0.2
              }}
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <a
                    href={link.href}
                    className={`block py-2 px-3 rounded-md transition-colors duration-300 ${
                      activeSection === link.href.substring(1)
                        ? "bg-accent text-white font-medium"
                        : "hover:bg-foreground hover:bg-opacity-5"
                    }`}
                    onClick={() => {
                      // Fermer le menu mobile
                      setIsOpen(false);
                      
                      // Ajouter la classe pour faciliter la détection dans le script de navigation
                      const mobileMenu = document.querySelector('.mobile-menu');
                      if (mobileMenu) {
                        mobileMenu.classList.add('closed-by-link');
                      }
                    }}
                    aria-current={activeSection === link.href.substring(1) ? "page" : undefined}
                  >
                    {link.name}
                  </a>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
