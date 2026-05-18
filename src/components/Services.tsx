"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const services = [
  { num: "★", title: "idaes.fr — SaaS", desc: "Ma plateforme principale : permettre aux professionnels de créer leur présence en ligne en quelques minutes. Abonnements, dashboard, domaine personnalisé." },
  { num: "01", title: "Dépannage Hardware", desc: "Diagnostic et réparation sur poste client, composants, périphériques. Intervention rapide sur site ou à distance." },
  { num: "02", title: "Support Logiciel", desc: "Installation, configuration, dépannage applications Windows/macOS, résolution de problèmes logiciels." },
  { num: "03", title: "Réseau & Connectivité", desc: "Configuration WiFi, Ethernet, dépannage connexion, mise en place réseau domestique ou petite entreprise." },
  { num: "04", title: "Optimisation Performance", desc: "Nettoyage système, optimisation démarrage, suppression malware, mise à jour drivers." },
  { num: "05", title: "Formation Personnalisée", desc: "Accompagnement pour apprentissage logiciels, bonnes pratiques informatiques, à votre rythme." },
];

const Services = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="services" className="section bg-background py-24 md:py-32">
      <div className="container mx-auto px-6 sm:px-10">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-accent text-xs font-bold uppercase tracking-[0.3em] mb-4 block">Services</span>
            <h2 className="text-5xl md:text-6xl font-black leading-tight uppercase tracking-tight">
              <span className="text-gradient">SaaS</span>
              <br />
              <span className="text-foreground">&amp; terrain.</span>
            </h2>
          </motion.div>
          <motion.p
            className="text-text-secondary max-w-xs leading-relaxed text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Je priorise idaes.fr pour en faire mon métier. Les lignes ci-dessous, c&apos;est le savoir-faire terrain que je peux encore mobiliser ponctuellement.
          </motion.p>
        </div>

        {/* ── Liste numérotée ── */}
        <div ref={ref} className="border-t border-white/10">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className={`group flex items-center gap-6 md:gap-10 border-b py-7 transition-colors duration-300 cursor-default ${
                index === 0
                  ? "border-accent/30 bg-accent/5 px-4 rounded-xl -mx-4 hover:bg-accent/10 hover:border-accent/50"
                  : "border-white/10 hover:border-accent/40"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
            >
              <span className="text-accent font-mono text-sm font-bold w-8 shrink-0 select-none">
                {service.num}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-bold mb-1 group-hover:text-accent transition-colors duration-300 leading-tight">
                  {service.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed hidden md:block max-w-xl">
                  {service.desc}
                </p>
              </div>
              <svg
                className="w-5 h-5 shrink-0 text-white/20 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300"
                fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
              >
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </motion.div>
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          className="mt-14 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.a
            href="#contact"
            className="bg-accent text-white font-bold py-4 px-10 rounded-full inline-flex items-center gap-2 uppercase tracking-wider text-sm hover:bg-accent-600 transition-colors duration-300"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Discuter d&apos;une mission
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
};

export default Services;
