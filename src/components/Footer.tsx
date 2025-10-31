"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background/80 backdrop-blur-sm border-t border-white/5 py-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="#home" className="text-2xl font-bold text-gradient mb-4 inline-block">
              Portfolio
            </Link>
            <p className="text-text-secondary mb-6 max-w-md">
              Développeur web en formation, utilisant l&apos;IA comme outil d&apos;apprentissage. Objectif : technicien systèmes et réseaux.
            </p>
            <div className="flex space-x-4"></div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#home" className="text-text-secondary hover:text-accent transition-colors duration-300">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-text-secondary hover:text-accent transition-colors duration-300">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="#services" className="text-text-secondary hover:text-accent transition-colors duration-300">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#portfolio" className="text-text-secondary hover:text-accent transition-colors duration-300">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-text-secondary hover:text-accent transition-colors duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-accent mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-text-secondary">+33 6 12 22 42 00</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-accent mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-text-secondary">Albi, France</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-text-secondary text-sm mb-4 md:mb-0">
            © {currentYear} Portfolio. Tous droits réservés.
          </p>
          
          <motion.a
            href="#home"
            className="glass-effect p-3 rounded-full hover:bg-white/10 transition-all duration-300"
            whileHover={{ y: -5 }}
            aria-label="Retour en haut"
          >
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
