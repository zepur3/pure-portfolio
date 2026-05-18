# Veille sécurité — pure-portfolio (version courte)

Projet **simple** (portfolio + un formulaire). Pas de blog, pas d’admin, pas d’uploads utilisateurs. Utilise ce fichier comme **rappel mensuel** (15 min max).

## Mensuel

1. **`pnpm audit`** — noter les HIGH/CRITICAL ; corriger ou documenter si faux positif acceptable.
2. **Veille OWASP** — lire un court article sur [OWASP Top 10](https://owasp.org/www-project-top-ten/) et se demander : « ça s’applique à mon site ? » (souvent : injection, XSS, mauvaise config pour nous).
3. **Fichiers sensibles** — ouvrir `src/app/api/contact/route.ts` : rien de nouveau d’inquiétant (secrets, CORS, HTML mail) ?
4. **Déploiement** — si tu touches à l’hébergeur : en-têtes (voir `security-checklist.md`, `csp-implementation-guide.md`).

## Hors périmètre habituel ici

Pas de pentest automatisé obligatoire ; pas de WAF décrit dans ce repo. Si le site grossit (auth, paiements, données perso), **réécrire** cette veille avec un périmètre plus large ou un prestataire.

Détails du rituel quotidien / fin de session : **README racine** (sections checklist et rituel).
