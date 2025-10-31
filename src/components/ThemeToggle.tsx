"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ThemeToggle = () => {
  // Commencer avec un état non défini pour éviter les erreurs d'hydratation
  const [theme, setTheme] = useState<"light" | "dark" | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  // Initialiser le thème une fois que le composant est monté côté client
  useEffect(() => {
    setMounted(true);
    
    // Vérifier la préférence dans localStorage
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    
    if (storedTheme) {
      setTheme(storedTheme);
      // Appliquer le thème au chargement
      document.documentElement.classList.toggle("light", storedTheme === "light");
    } else {
      // Par défaut, utiliser le mode sombre
      setTheme("dark");
      document.documentElement.classList.remove("light");
    }
  }, []);

  // Fonction pour basculer le thème
  const toggleTheme = () => {
    if (!theme) return; // Protection contre les appels avant l'initialisation
    
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    
    // Appliquer la classe au HTML
    if (newTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    
    // Ajouter une classe temporaire pour l'animation de transition
    document.documentElement.classList.add("theme-transition");
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 800);
    
    // Enregistrer la préférence
    localStorage.setItem("theme", newTheme);
  };

  // Ne rien afficher pendant le rendu côté serveur pour éviter les erreurs d'hydratation
  if (!mounted) {
    return null;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden transition-colors duration-300"
      aria-label={`Passer au mode ${theme === "dark" ? "clair" : "sombre"}`}
      title={`Passer au mode ${theme === "dark" ? "clair" : "sombre"}`}
    >
      <motion.div 
        className="absolute inset-0 rounded-full"
        animate={{
          backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
        }}
        transition={{ duration: 0.3 }}
      />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          className="relative z-10"
          initial={{ opacity: 0, rotate: theme === "dark" ? -180 : 0 }}
          animate={{ opacity: 1, rotate: 0 }}
          exit={{ opacity: 0, rotate: theme === "dark" ? 180 : -180 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 15 
          }}
        >
          {theme === "dark" ? (
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
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
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
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </motion.div>
      </AnimatePresence>
      
      {/* Indicateur visuel du mode actuel */}
      <span className="sr-only">{theme === "dark" ? "Mode sombre activé" : "Mode clair activé"}</span>
    </motion.button>
  );
};

export default ThemeToggle;
