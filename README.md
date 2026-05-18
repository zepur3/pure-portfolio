# Pure Portfolio

Site portfolio [Next.js](https://nextjs.org) (App Router) : pages dans `src/app/`, composants dans `src/components/`, formulaire de contact via `src/app/api/contact/route.ts` (SMTP + reCAPTCHA + rate limiting).

## Pratiques d’équipe

Pour travailler à plusieurs sur le même dépôt :

- **Gestionnaire de paquets : pnpm uniquement.** Le champ `packageManager` dans `package.json` fixe la version. N’utilise pas `npm install` ni `yarn` sur ce projet : tu obtiendrais un autre lockfile et des installs incohérentes. Installe [pnpm](https://pnpm.io/installation) si besoin, ou active Corepack : `corepack enable`, puis les commandes ci‑dessous utiliseront la bonne version.
- **Première installation :** `pnpm install`
- **Développement local :** `pnpm dev`
- **Qualité :** `pnpm lint` avant fusion ; `pnpm build` pour vérifier que la production compile.
- **Secrets :** ne jamais committer `.env`, `.env.local`, clés SMTP, `RECAPTCHA_SECRET_KEY`, mots de passe. Ils sont listés dans `.gitignore` ; en local, créez un fichier `.env.local` (non versionné) avec les variables requises par l’API contact (voir section **Variables d’environnement** ci‑dessous).
- **Sécurité & Cursor :** les règles pour l’IA sont dans `.cursor/rules/` (`security-*.mdc`). Cursor les applique selon leur configuration ; pour une feature sensible, préciser « respecte les règles security du projet ».
- **Docs complémentaires :** `security-checklist.md`, `security-implementation-steps.md`, `csp-implementation-guide.md` (déploiement, en-têtes, CSP).

### Variables d’environnement (API contact)

Obligatoires côté serveur pour l’envoi d’emails et la vérification reCAPTCHA :

`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `CONTACT_SENDER_EMAIL`, `CONTACT_RECIPIENT_EMAIL`, `RECAPTCHA_SECRET_KEY`

Optionnelles : `NEXT_PUBLIC_SITE_URL` (origine CORS de l’API ; en production, préférez l’URL exacte du site plutôt que `*`), `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (clé publique côté client), `MAX_EMAILS_PER_IP`, `MIN_SUBMISSION_TIME`.

### Rituel sécurité — à faire à **chaque fin de session** (obligatoire)

**Qui :** toute personne qui pousse du code, avant chaque `git push` ou merge.  
**Durée :** ~15–20 min.

| Fréquence | Action |
|-----------|--------|
| **Chaque fin de code** | Étapes 1 → 4 ci‑dessous |
| **1× / semaine** | `pnpm audit` |
| **1× / mois** | Étape 5 (audit global) |

#### Étape 1 — Vérifications locales (~2 min)

À la racine du projet :

```bash
pnpm lint
pnpm build
```

Si une commande échoue → corriger avant de continuer. Ne pas push tant que ce n’est pas vert.

#### Étape 2 — Audit sécu avec Cursor (copier-coller)

Ouvrir le chat Cursor et coller **tel quel** (remplacez le nom du dépôt si besoin) :

```
Audit sécurité — fin de session

Contexte : je viens de coder sur pure-portfolio. Ne modifie rien pour l’instant, analyse seulement.

1) Liste les fichiers modifiés dans cette session (ou demande-moi git diff si tu ne les vois pas).
2) Sur UNIQUEMENT ces fichiers, cherche :
   - endpoint public non durci (formulaire /api/contact : validation, reCAPTCHA, rate limit, honeypot, erreurs sans fuite d’infos)
   - XSS (dangerouslySetInnerHTML avec données utilisateur ou non contrôlées ; HTML email / rendu)
   - secrets ou .env exposés (client `NEXT_PUBLIC_*`, logs, messages d’erreur)
   - CORS trop permissif (Access-Control-Allow-Origin: * en prod avec credentials ou données sensibles)
   - méthodes HTTP incorrectes (contact doit rester en POST, pas d’action sensible en GET)
   - en-têtes / CSP si vous touchez au déploiement ou à next.config
   - violations des règles .cursor/rules/security-*.mdc

3) Classe chaque finding : CRITIQUE / ÉLEVÉ / MOYEN / FAIBLE
4) Pour chaque point : fichier, risque en 1 phrase, correctif concret
5) Dis si je peux merger ou non

Respecte les règles security du projet. Réponds en français.
```

#### Étape 3 — Corriger CRITIQUE et ÉLEVÉ

Si l’IA signale des problèmes **CRITIQUE** ou **ÉLEVÉ**, coller :

```
Corrige uniquement les findings CRITIQUE et ÉLEVÉ de l’audit précédent.
Respecte .cursor/rules/security-*.mdc.
Ne refactorise pas le reste. Montre le résumé des changements.
```

Puis **refaire l’étape 1** (`pnpm lint` + `pnpm build`).

#### Étape 4 — Checklist avant push / merge (~2 min)

Coller :

```
Checklist finale avant merge :
- [ ] lint + build OK
- [ ] pas de secret dans le diff
- [ ] /api/contact inchangé ou toujours protégé (POST, env, rate limit, reCAPTCHA)
- [ ] pas de dangerouslySetInnerHTML avec contenu utilisateur non sanitisé
- [ ] NEXT_PUBLIC_SITE_URL cohérent si CORS modifié

Confirme oui/non pour chaque point en te basant sur le diff actuel.
```

Ne push / merge **que si** tout est OK (ou seulement des points MOYEN/FAIBLE acceptés consciemment).

#### Étape 5 — Audit global (1× par mois)

Remplacer l’étape 2 par :

```
Audit sécurité GLOBAL du repo pure-portfolio (OWASP Top 10 adapté site vitrine).
Parcours prioritaire : src/app/api/**, src/components/Contact.tsx, src/app/layout.tsx, next.config.js, public/theme-init.js, dépendances (package.json).
Priorise CRITIQUE et ÉLEVÉ. Pas de modification, rapport seulement. Français.
```

#### Outils optionnels (plus tard)

| Outil | Rôle | Coût |
|-------|------|------|
| Dependabot (GitHub) | alertes dépendances vulnérables | gratuit |
| `pnpm audit` | scan deps en local / CI | gratuit |
| Sentry | erreurs en production | gratuit au début |
| Redis / Upstash | rate limit partagé entre instances (si l’API est déployée sur plusieurs nœuds) | selon offre |

Ce rituel **complète** les règles Cursor ; il ne remplace pas les bonnes pratiques déjà en place (reCAPTCHA, rate limit mémoire, honeypot, sanitization basique des champs email).

## Démarrage

```bash
pnpm install
pnpm dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

Les pages principales sont dans `src/app/page.tsx` et `src/app/layout.tsx` (SEO, JSON-LD, styles critiques).

## Police et assets

Le projet utilise [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) avec les familles **Geist** et **Geist Mono** (Google Fonts).

## Déploiement

Déploiement possible sur [Vercel](https://vercel.com) ou hébergement classique. Pour un hébergement type Apache/OVH, les en-têtes de sécurité peuvent être configurés côté serveur (voir commentaires dans `next.config.js` et `security-checklist.md`).

Documentation Next.js : [déploiement](https://nextjs.org/docs/app/building-your-application/deploying).
