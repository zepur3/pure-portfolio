"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Footer from "@/components/Footer";
import ThemeToggle from "@/components/ThemeToggle";
import dynamic from "next/dynamic";

const FluidEffect = dynamic(() => import("@/components/FluidEffect"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-background" />
});

const Contact = dynamic(() => import("@/components/Contact"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative bg-background min-h-screen w-full">
      {/* Rendu immédiat de l'en-tête critique */}
      <Navbar />
      <Hero />

      {/* Effet fluide en arrière-plan - chargé de manière différée */}
      <FluidEffect className="opacity-30" />

      {/* Sections restantes */}
      <About />
      <Services />
      <Portfolio />
      <Contact />
      <Footer />
      <ThemeToggle />
    </main>
  );
}
