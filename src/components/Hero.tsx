"use client";

import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

const marqueeItems = ["idaes.fr", "SaaS Builder", "Indie Maker", "React", "Next.js", "Freelance", "TypeScript", "Tailwind", "Autonome"];

const Hero = () => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden flex flex-col">

      {/* ── Fond ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Grille subtile */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: isLight
              ? "linear-gradient(rgba(0,0,0,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.04) 1px,transparent 1px)"
              : "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
            backgroundSize: "70px 70px",
          }}
        />
        {/* Orbes */}
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle,rgba(59,124,255,0.13) 0%,transparent 70%)" }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full" style={{ background: "radial-gradient(circle,rgba(59,124,255,0.07) 0%,transparent 70%)" }} />
      </div>

      {/* ── Contenu principal ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center container mx-auto px-6 sm:px-10 pt-32 pb-16">

        {/* Tags */}
        <motion.div
          className="flex flex-wrap gap-2 mb-8"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {["Indie Maker", "SaaS Builder", "Freelance"].map((tag, i) => (
            <span
              key={tag}
              className={`text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.18em] border ${
                i === 0
                  ? "border-accent text-accent"
                  : isLight ? "border-black/20 text-black/50" : "border-white/20 text-white/40"
              }`}
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* Titre géant */}
        <motion.h1
          className="font-black leading-[0.88] tracking-tighter uppercase mb-10 text-[clamp(3.2rem,11vw,9.5rem)]"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <span className="block text-gradient">Indie</span>
          <span className="block">Maker.</span>
        </motion.h1>

        {/* Ligne bas : desc + boutons */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.38 }}
        >
          <p className="text-text-secondary max-w-sm leading-relaxed">
            Je construis{" "}
            <a href="https://www.idaes.fr" target="_blank" rel="noopener noreferrer" className="text-accent font-semibold hover:underline">
              idaes.fr
            </a>
            {" "}— une plateforme SaaS pour aider les professionnels
            à créer leur présence en ligne. C&apos;est mon activité principale :
            tout miser sur le produit pour en vivre.
          </p>

          <div className="flex gap-3 md:ml-auto shrink-0">
            <motion.a
              href="https://www.idaes.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent text-white font-bold py-4 px-7 rounded-full inline-flex items-center gap-2 text-sm uppercase tracking-wider hover:bg-accent-600 transition-colors duration-300"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Voir idaes.fr
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </motion.a>
            <motion.a
              href="#contact"
              className={`font-bold py-4 px-7 rounded-full text-sm uppercase tracking-wider border transition-colors duration-300 ${
                isLight
                  ? "border-black/20 text-black/70 hover:border-accent hover:text-accent"
                  : "border-white/20 text-white/60 hover:border-accent hover:text-accent"
              }`}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Contact →
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* ── Marquee ── */}
      <div className={`relative z-10 border-t py-5 overflow-hidden ${ isLight ? "border-black/10" : "border-white/10" }`}>
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, ease: "linear", repeat: Infinity }}
        >
          {[...Array(4)].map((_, i) => (
            <span key={i} className={`font-black text-sm uppercase tracking-[0.25em] flex items-center gap-12 ${ isLight ? "text-black/15" : "text-white/15" }`}>
              {marqueeItems.map((item, j) => (
                <span key={j} className="flex items-center gap-12">
                  {item}
                  <span className="text-accent text-xs">✦</span>
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

    </section>
  );
};

export default Hero;
