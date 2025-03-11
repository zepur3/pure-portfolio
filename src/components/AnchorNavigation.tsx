"use client";

import { useEffect } from "react";

export default function AnchorNavigation() {
  useEffect(() => {
    // Fonction pour gérer le défilement vers une section avec un offset
    const handleAnchorClick = (e: MouseEvent) => {
      // Vérifier si le clic était sur un lien d'ancrage
      const target = (e.target as HTMLElement).closest('a');
      if (target && target.hash && target.pathname === window.location.pathname) {
        e.preventDefault();
        
        // Trouver l'élément cible
        const targetElement = document.getElementById(target.hash.substring(1));
        
        if (targetElement) {
          // Calculer la position avec un offset
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY;
          
          // Offset pour compenser la hauteur du header (ajuster selon vos besoins)
          // Utiliser une valeur plus grande pour les petits écrans
          const isMobile = window.innerWidth < 768;
          const headerOffset = isMobile ? 150 : 100;
          
          // Faire défiler jusqu'à la position ajustée
          window.scrollTo({
            top: offsetPosition - headerOffset,
            behavior: 'smooth'
          });
          
          // Mettre à jour l'URL sans recharger la page
          history.pushState({}, "", target.hash);
        }
      }
    };

    // Ajouter l'écouteur d'événements
    document.addEventListener('click', handleAnchorClick);
    
    // Nettoyer l'écouteur d'événements
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  // Ce composant ne rend rien visuellement
  return null;
}
