"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const skills = [
  "Next.js", "React", "TypeScript", "Tailwind CSS",
  "Dépannage Hardware", "Support Logiciel", "Réseaux & WiFi",
  "Windows / macOS", "Git/GitHub", "IA & Prompt Engineering",
];

const stats = [
  { value: "01", label: "SaaS actif" },
  { value: "Solo", label: "Indie builder" },
  { value: "∞", label: "Passion tech" },
];

const About = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <>
      <div id="about-anchor" style={{ position: "relative", top: "20px", visibility: "hidden", height: 0 }} />

      <section id="about" className="section bg-background py-24 md:py-32 overflow-hidden">
        <div className="container mx-auto px-6 sm:px-10">

          {/* Label */}
          <motion.span
            className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-14 block"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            À propos
          </motion.span>

          <div ref={ref} className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">

            {/* ── Colonne texte ── */}
            <motion.div
              className="md:col-span-7 order-2 md:order-1"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.92] mb-10">
                <span className="text-gradient block">Indie</span>
                <span className="block">Maker.</span>
              </h2>

              <p className="text-text-secondary leading-relaxed mb-5">
                Je construis{" "}
                <a href="https://www.idaes.fr" target="_blank" rel="noopener noreferrer" className="text-accent font-semibold hover:underline">idaes.fr</a>
                {" "}— une plateforme SaaS qui permet aux professionnels de créer leur présence en ligne en quelques minutes, sans compétences techniques.
              </p>
              <p className="text-text-secondary leading-relaxed mb-10">
                Curieux et <strong className="text-foreground font-bold">autodidacte</strong>, j&apos;apprends vite et m&apos;adapte à tout.
                Aujourd&apos;hui je concentre mon énergie sur <strong className="text-foreground font-bold">idaes.fr</strong>{" "}
                : itérer vite, écouter les retours et faire grandir le SaaS.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-8 mb-10">
                {stats.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.25 + i * 0.1, duration: 0.5 }}
                  >
                    <div className="text-3xl md:text-4xl font-black text-gradient mb-1">{s.value}</div>
                    <div className="text-text-secondary text-xs uppercase tracking-wider">{s.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-10">
                {skills.map((skill, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.3 + i * 0.04, duration: 0.4 }}
                    className="border border-accent/30 text-accent/80 font-medium px-3 py-1.5 rounded-full text-xs hover:border-accent hover:text-accent transition-colors duration-300"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>

              <motion.a
                href="#contact"
                className="bg-accent text-white font-bold py-4 px-8 rounded-full inline-flex items-center gap-2 uppercase tracking-wider text-sm hover:bg-accent-600 transition-colors duration-300"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                Me contacter
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                </svg>
              </motion.a>
            </motion.div>

            {/* ── Colonne photo ── */}
            <motion.div
              className="md:col-span-5 order-1 md:order-2 flex justify-center md:justify-start"
              initial={{ opacity: 0, x: 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10 w-full max-w-[260px] md:max-w-[300px]">
                <div className="relative w-full" style={{ paddingBottom: "120%" }}>
                  <Image
                    src="/profile-placeholder.webp"
                    alt="ASD Infor"
                    fill
                    sizes="(max-width: 768px) 260px, 300px"
                    className="object-cover object-top"
                    priority
                  />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-background/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse shrink-0" />
                    <span className="text-xs font-medium text-foreground">Focus produit · idaes.fr</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
};

export default About;
