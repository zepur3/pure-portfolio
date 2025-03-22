"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Commencer avec un état non défini pour éviter les erreurs d'hydratation
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  // Initialiser le thème une fois que le composant est monté côté client
  useEffect(() => {
    setMounted(true);
    
    // Vérifier la préférence dans localStorage
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle("light", storedTheme === "light");
    } else {
      // Par défaut, utiliser le mode sombre
      setTheme("dark");
      document.documentElement.classList.remove("light");
    }
  }, []);

  // Fonction pour basculer le thème
  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    
    // Appliquer la classe au HTML (seulement pour le mode clair)
    document.documentElement.classList.toggle("light", newTheme === "light");
    
    // Ajouter une classe temporaire pour l'animation de transition
    document.documentElement.classList.add("theme-transition");
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 800);
    
    // Enregistrer la préférence
    localStorage.setItem("theme", newTheme);
  };

  // Valeur du contexte
  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
  };

  // Ne rien afficher pendant le rendu côté serveur pour éviter les erreurs d'hydratation
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
