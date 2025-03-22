# Guide d'implémentation d'une politique CSP sécurisée

Ce guide vous aidera à mettre en place une politique de sécurité du contenu (CSP) stricte pour votre portfolio, sans utiliser `unsafe-inline` dans la directive `script-src`.

## Le problème avec `unsafe-inline`

L'utilisation de `unsafe-inline` dans la directive `script-src` est considérée comme dangereuse car elle permet l'exécution de n'importe quel script inline dans votre HTML. Cela peut être exploité par des attaques XSS (Cross-Site Scripting) si un attaquant parvient à injecter du code malveillant dans votre page.

## Solutions pour éliminer `unsafe-inline`

### Option 1: Utiliser des nonces pour les scripts inline

1. **Générer un nonce unique** pour chaque chargement de page
2. **Ajouter ce nonce à votre politique CSP** :
   ```
   script-src 'self' 'nonce-RANDOM_NONCE_HERE';
   ```
3. **Ajouter le même nonce à chaque script inline** :
   ```html
   <script nonce="RANDOM_NONCE_HERE">
     // Votre code JavaScript inline
   </script>
   ```

### Option 2: Utiliser des hashes cryptographiques

1. **Calculer le hash SHA-256** de chaque script inline
2. **Ajouter ces hashes à votre politique CSP** :
   ```
   script-src 'self' 'sha256-HASH_OF_SCRIPT_1' 'sha256-HASH_OF_SCRIPT_2';
   ```

### Option 3: Déplacer tous les scripts inline vers des fichiers externes

1. **Créer des fichiers .js externes** pour tous vos scripts inline
2. **Référencer ces fichiers** dans votre HTML :
   ```html
   <script src="/path/to/script.js"></script>
   ```
3. **Utiliser une politique CSP simple** :
   ```
   script-src 'self';
   ```

## Implémentation recommandée pour votre portfolio

Pour un site statique comme votre portfolio, l'option 3 est généralement la plus simple à mettre en œuvre :

1. **Identifiez tous les scripts inline** dans votre fichier `index.html`
2. **Créez un fichier `scripts.js`** dans votre dossier public
3. **Déplacez tout le code JavaScript inline** vers ce fichier
4. **Référencez ce fichier** dans votre HTML
5. **Mettez à jour votre politique CSP** pour utiliser uniquement `'self'` dans `script-src`

## Politique CSP recommandée

```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self';
```

Cette politique est stricte mais permet toujours :
- L'utilisation de styles inline (souvent nécessaire)
- Le chargement d'images et de polices à partir de data: URIs
- Tous les autres contenus uniquement depuis votre propre domaine

## Test de votre politique CSP

Après avoir implémenté ces changements, utilisez [Security Headers](https://securityheaders.com/) pour vérifier que votre politique CSP ne contient plus `unsafe-inline` dans la directive `script-src`.

## Remarque importante

Si votre site utilise des bibliothèques JavaScript qui nécessitent des scripts inline (comme certaines versions de Google Analytics), vous devrez utiliser l'option 1 ou 2 pour ces scripts spécifiques.
