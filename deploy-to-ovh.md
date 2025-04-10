# Guide de déploiement sur OVH (Hébergement mutualisé PHP 8.4)

Ce guide vous aidera à déployer votre portfolio statique sur un hébergement mutualisé OVH avec PHP 8.4.

## Étape 1 : Préparation des fichiers

1. Assurez-vous que la build statique est complète (le dossier `out` contient tous les fichiers)
2. Remplacez le fichier `.htaccess` dans le dossier `out` par celui fourni dans `htaccess-for-ovh.txt`
3. Compressez le contenu du dossier `out` en un fichier ZIP pour faciliter le transfert

## Étape 2 : Connexion à votre hébergement OVH

1. Connectez-vous à votre espace client OVH
2. Accédez à votre hébergement mutualisé
3. Ouvrez le gestionnaire de fichiers ou utilisez FTP avec les identifiants fournis par OVH

## Étape 3 : Transfert des fichiers

### Option 1 : Via le gestionnaire de fichiers OVH
1. Naviguez vers le répertoire où vous souhaitez installer votre site (généralement `www` ou un sous-domaine)
2. Supprimez tous les fichiers existants si nécessaire
3. Uploadez le fichier ZIP contenant votre site
4. Décompressez le ZIP directement sur le serveur

### Option 2 : Via FTP
1. Utilisez un client FTP comme FileZilla
2. Connectez-vous avec vos identifiants OVH
3. Naviguez vers le répertoire cible
4. Transférez tous les fichiers du dossier `out`

## Étape 4 : Configuration

1. Vérifiez que le fichier `.htaccess` est bien présent à la racine
2. Ajustez les paramètres dans le fichier `.htaccess` si nécessaire :
   - Décommentez les lignes de redirection HTTPS si vous avez un certificat SSL
   - Modifiez la protection contre le hotlinking en remplaçant "votre-domaine.com"

## Étape 5 : Vérification

1. Accédez à votre site via votre navigateur
2. Vérifiez que toutes les pages se chargent correctement
3. Testez la navigation et les fonctionnalités
4. Vérifiez que le thème sombre/clair fonctionne correctement
5. Testez sur différents appareils pour confirmer la responsivité

## Dépannage

### Problème : Page blanche
- Vérifiez les logs d'erreur dans votre espace client OVH
- Assurez-vous que les permissions des fichiers sont correctes (généralement 644 pour les fichiers et 755 pour les dossiers)

### Problème : Images non chargées
- Vérifiez que tous les chemins d'accès sont corrects
- Assurez-vous que les fichiers d'images ont bien été transférés

### Problème : Erreur 404 sur les routes
- Vérifiez que le fichier `.htaccess` est correctement configuré
- Assurez-vous que la réécriture d'URL est activée sur votre hébergement

## Optimisations supplémentaires

1. Activez le CDN OVH pour améliorer les performances globales
2. Configurez un certificat SSL pour sécuriser votre site
3. Mettez en place une surveillance des performances avec les outils OVH

Pour toute assistance supplémentaire, consultez la documentation OVH ou contactez leur support technique.
