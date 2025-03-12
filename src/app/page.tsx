"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";

// Import des composants avec chargement différé pour les sections non critiques
import dynamic from "next/dynamic";
const About = dynamic(() => import("@/components/About"), { ssr: true });
const Services = dynamic(() => import("@/components/Services"), { ssr: true });
const Portfolio = dynamic(() => import("@/components/Portfolio"), { ssr: true });
const Contact = dynamic(() => import("@/components/Contact"), { ssr: true });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });
const ThemeToggle = dynamic(() => import("@/components/ThemeToggle"), { ssr: true });
const FluidEffect = dynamic(() => import("@/components/FluidEffect"), {
  ssr: true,
  loading: () => <div className="fixed inset-0 bg-background" /> // Placeholder pendant le chargement
});

export default function Home() {
  const [mounted, setMounted] = useState(false);

  // S'assurer que le composant est monté côté client avant d'afficher tout le contenu
  useEffect(() => {
    setMounted(true);
  }, []);

  // Rendu de base qui sera affiché immédiatement
  return (
    <main className="relative bg-background min-h-screen w-full">
      {/* Rendu immédiat de l'en-tête critique */}
      <Navbar />
      <Hero />

      {/* Effet fluide en arrière-plan - chargé de manière différée */}
      {mounted && <FluidEffect className="opacity-30" />}
      
      {/* Sections restantes - chargées de manière différée */}
      {mounted && (
        <>
          <About />
          <Services />
          <Portfolio />
          <Contact />
          <Footer />
          <ThemeToggle />
        </>
      )}
    </main>
  );
}
