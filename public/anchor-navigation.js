// Script optimisé pour la navigation par ancre sur mobile et desktop
// Utilisation d'une fonction auto-exécutée différée pour éviter de bloquer le rendu
(function() {
  if (typeof window !== 'undefined') {
    // Fonction pour gérer le défilement vers une ancre de manière optimisée
    function scrollToAnchor(targetId) {
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Déterminer si nous sommes en mode mobile
        const isMobile = window.innerWidth < 768;
        
        // Calculer l'offset en fonction du type d'appareil
        const offset = isMobile ? 70 : 100;
        
        // Obtenir la position de l'élément
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        // Faire défiler vers l'élément avec une animation fluide
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
        
        // Fermer le menu mobile si ouvert
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('open')) {
          mobileMenu.classList.remove('open');
        }
        
        // Mettre à jour l'URL sans recharger la page
        history.pushState(null, '', `#${targetId}`);
      }
    }
    
    // Attendre que le DOM soit complètement chargé
    document.addEventListener('DOMContentLoaded', function() {
      // Intercepter tous les clics sur les liens d'ancrage
      document.addEventListener('click', function(e) {
        // Trouver le lien d'ancrage le plus proche
        const link = e.target.closest('a[href^="#"]');
        
        if (link) {
          e.preventDefault();
          
          // Extraire l'ID de l'ancre (sans le #)
          const targetId = link.getAttribute('href').substring(1);
          
          if (targetId) {
            // Faire défiler vers l'ancre
            scrollToAnchor(targetId);
          }
        }
      });
      
      // Gérer les ancres dans l'URL lors du chargement initial
      if (window.location.hash) {
        // Attendre un court instant pour s'assurer que la page est bien chargée
        setTimeout(() => {
          const targetId = window.location.hash.substring(1);
          scrollToAnchor(targetId);
        }, 100);
      }
    });
  }
})();
