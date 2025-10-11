import ReCAPTCHA from 'react-google-recaptcha';
import emailjs from '@emailjs/browser';

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: number;
  honeypot: string;
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
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  // Générer un timestamp au chargement du composant
  useEffect(() => {
    // Définir le timestamp actuel
    setFormData(prev => ({
      ...prev,
      timestamp: Math.floor(Date.now() / 1000)
    }));
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

    // Vérification reCAPTCHA
    if (!recaptchaToken) {
      setErrorMessage("Veuillez valider le reCAPTCHA avant d'envoyer le message.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      // Préparer les données pour EmailJS
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: 'contact@asdinfor.ovh', // Votre email de destination
        reply_to: formData.email,
        recaptcha_response: recaptchaToken
      };

      // Configuration EmailJS
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '';
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '';
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '';

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('Configuration EmailJS incomplète');
      }

      // Envoyer l'email avec EmailJS
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

      // Réinitialiser le token reCAPTCHA après envoi réussi
      setRecaptchaToken(null);

    } catch (error) {
      console.error('Erreur EmailJS:', error);
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
            Vous avez un projet en tête ? N&apos;hésitez pas à me contacter pour en discuter
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            ref={ref}
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
                
                <div className="mb-4">
                  {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? (
                    <ReCAPTCHA
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                      onChange={setRecaptchaToken}
                      className="relative z-40"
                    />
                  ) : (
                    <div className="bg-red-500/20 border border-red-500/30 text-red-500 p-4 rounded-lg">
                      ⚠️ Clé reCAPTCHA non configurée. Veuillez vérifier votre fichier .env.local
                    </div>
                  )}
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
                
                <button
                  type="submit"
                  disabled={isSubmitting || !recaptchaToken}
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
                <a href="#" className="bg-accent/20 p-3 rounded-full hover:bg-accent/40 transition-colors duration-300">
                  <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className="bg-accent/20 p-3 rounded-full hover:bg-accent/40 transition-colors duration-300">
                  <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z" />
                  </svg>
                </a>
                <a href="#" className="bg-accent/20 p-3 rounded-full hover:bg-accent/40 transition-colors duration-300">
                  <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
                <a href="#" className="bg-accent/20 p-3 rounded-full hover:bg-accent/40 transition-colors duration-300">
                  <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" />
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
