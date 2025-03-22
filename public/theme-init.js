(function() {
  try {
    // Récupérer le thème stocké
    const storedTheme = localStorage.getItem('theme');
    
    // Appliquer le thème
    if (storedTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      // Par défaut, utiliser le mode sombre
      document.documentElement.classList.remove('light');
    }
  } catch (e) {
    console.error('Error initializing theme:', e);
  }
})();
