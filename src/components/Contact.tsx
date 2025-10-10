"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import emailjs from '@emailjs/browser';

// Définir l'interface pour les données du formulaire
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: number;
  honeypot: string;
}

// Interface pour Turnstile
interface TurnstileInstance {
  render: (selector: string, config: {
    sitekey: string;
    theme: string;
    callback: (token: string) => void;
  }) => string;
}

// Étendre l'interface Window pour Turnstile
declare global {
  interface Window {
    turnstile: TurnstileInstance;
  }
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
    timestamp: 0,
    honeypot: "", // Champ honeypot pour détecter les bots
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<null | "success" | "error">(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const contactRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contactRef, { once: false, margin: "-100px" });

  // Définir le timestamp  // Déclarer la fonction globale pour Turnstile
  useEffect(() => {
    // Fonction pour rendre Turnstile après le chargement du script
    const renderTurnstile = (): void => {
      if (typeof window !== 'undefined' && window.turnstile) {
        window.turnstile.render('.cf-turnstile', {
          sitekey: '0x4AAAAAAB5z1s3VURUhqQ3F',
          theme: 'dark',
          callback: (token: string): void => {
            setTurnstileToken(token);
          },
        });
      }
    };

    // Attendre que le script soit chargé
    const checkScript = setInterval(() => {
      if (document.querySelector('script[src*="challenges.cloudflare.com"]')) {
        clearInterval(checkScript);
        renderTurnstile();
      }
    }, 100);

    // Nettoyer l'intervalle
    return () => {
      clearInterval(checkScript);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérification du honeypot - si rempli, c'est probablement un bot
    if (formData.honeypot) {
      console.log("Soumission de formulaire bloquée - suspicion de bot");
      // Simuler un succès pour ne pas alerter le bot
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        timestamp: Math.floor(Date.now() / 1000),
        honeypot: ""
      });
      return;
    }

    // Vérification du token Turnstile
    if (!turnstileToken) {
      setSubmitStatus("error");
      setErrorMessage("Veuillez confirmer que vous n'êtes pas un robot");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    // Configuration EmailJS
    const serviceId = 'service_7cll3dv';
    const templateId = 'template_pa1z6lu';
    const publicKey = 'O3QvlvzmW_VXM_GBC';

    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
      to_name: 'Portfolio Owner',
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    try {
      await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        timestamp: Math.floor(Date.now() / 1000),
        honeypot: ""
      });
      setTurnstileToken("");

    } catch (error) {
      console.error('Erreur:', error);
      setSubmitStatus("error");
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur inconnue est survenue');
    } finally {
      setIsSubmitting(false);
      // Réinitialiser le statut après 5 secondes
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="contact" className="section bg-background/50 relative z-10 pt-24 md:pt-28">
      <div className="fluid-effect opacity-10 absolute bottom-0 right-0 pointer-events-none"></div>
      <div className="container mx-auto px-4 md:px-6 relative z-20">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            <span className="text-gradient">Contactez</span> Moi
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-text-secondary max-w-2xl mx-auto"
          >
            Vous avez une opportunité d&apos;alternance ou de formation ? N&apos;hésitez pas à me contacter
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            ref={contactRef}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative z-30"
          >
            <motion.div variants={itemVariants} className="glass-effect p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6">Envoyez-moi un message</h3>
              
              {submitStatus === "success" && (
                <div className="bg-green-500/20 border border-green-500/30 text-green-500 p-4 rounded-lg mb-6">
                  Votre message a été envoyé avec succès. Je vous répondrai dès que possible.
                </div>
              )}
              
              {submitStatus === "error" && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-500 p-4 rounded-lg mb-6">
                  {errorMessage || "Une erreur s'est produite. Veuillez réessayer ou me contacter directement par email."}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="relative z-40">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent relative z-40"
                    placeholder="Votre nom"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent relative z-40"
                    placeholder="Votre email"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Sujet
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent relative z-40"
                    placeholder="Sujet de votre message"
                  />
                </div>
                
                {/* Champ honeypot caché visuellement mais accessible aux bots */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="honeypot">Ne pas remplir ce champ</label>
                  <input
                    type="text"
                    id="honeypot"
                    name="honeypot"
                    value={formData.honeypot}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none relative z-40"
                    placeholder="Votre message"
                    aria-label="Zone de saisie du message"
                  ></textarea>
                </div>
                
                {/* Cloudflare Turnstile */}
                <div className="mb-6">
                  <div
                    className="cf-turnstile"
                    data-sitekey="0x4AAAAAAB5z1s3VURUhqQ3F"
                    data-theme="dark"
                    data-callback="setTurnstileToken"
                  ></div>
                  <p className="text-xs text-text-secondary mt-2">
                    Ce site est protégé par Cloudflare Turnstile pour éviter le spam.
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent hover:bg-accent-light text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 flex items-center justify-center relative z-40"
                  aria-label="Envoyer le message"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    "Envoyer le message"
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative z-30"
          >
            <motion.div variants={itemVariants} className="glass-effect p-8 rounded-xl mb-8">
              <h3 className="text-2xl font-bold mb-6">Informations de contact</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-accent/20 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Email</h4>
                    <a href="mailto:contact@asdinfor.ovh" className="text-text-secondary hover:text-accent transition-colors duration-300 relative z-40">
                      contact@asdinfor.ovh
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-accent/20 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Téléphone</h4>
                    <a href="tel:+33612224200" className="text-text-secondary hover:text-accent transition-colors duration-300 relative z-40">
                      +33 6 12 22 42 00
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-accent/20 p-3 rounded-full mr-4">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-1">Localisation</h4>
                    <p className="text-text-secondary relative z-40">
                      Albi, France
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="glass-effect p-8 rounded-xl">
              <h3 className="text-2xl font-bold mb-6">Suivez-moi</h3>
              <div className="flex space-x-4 relative z-40">
                <a href="https://github.com/zepur3" target="_blank" rel="noopener noreferrer" className="bg-accent/20 p-3 rounded-full hover:bg-accent/40 transition-colors duration-300" aria-label="GitHub">
                  <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/votre-profil" target="_blank" rel="noopener noreferrer" className="bg-accent/20 p-3 rounded-full hover:bg-accent/40 transition-colors duration-300" aria-label="LinkedIn">
                  <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
