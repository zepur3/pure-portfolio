"use client";

import dynamic from "next/dynamic";

// Import des composants avec chargement dynamique
const Navbar = dynamic(() => import("@/components/Navbar"));
const Hero = dynamic(() => import("@/components/Hero"));
const About = dynamic(() => import("@/components/About"));
const Services = dynamic(() => import("@/components/Services"));
const Portfolio = dynamic(() => import("@/components/Portfolio"));
const Contact = dynamic(() => import("@/components/Contact"));
const Footer = dynamic(() => import("@/components/Footer"));
const FluidEffect = dynamic(() => import("@/components/FluidEffect"));
const ThemeToggle = dynamic(() => import("@/components/ThemeToggle"));

export default function Home() {
  return (
    <main className="relative">
      {/* Effet fluide en arrière-plan */}
      <FluidEffect className="opacity-30" />
      
      {/* Barre de navigation */}
      <Navbar />
      
      {/* Section Hero avec effet de parallax */}
      <Hero />
      
      {/* Section À propos */}
      <About />
      
      {/* Section Services */}
      <Services />
      
      {/* Section Portfolio */}
      <Portfolio />
      
      {/* Section Contact */}
      <Contact />
      
      {/* Pied de page */}
      <Footer />
      
      {/* Bouton de changement de thème */}
      <ThemeToggle />
    </main>
  );
}
