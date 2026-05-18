# Pure Portfolio

Site portfolio [Next.js](https://nextjs.org) (App Router) : pages dans `src/app/`, composants dans `src/components/`, formulaire de contact via `src/app/api/contact/route.ts` (SMTP + reCAPTCHA + rate limiting).

## Contrat sécurité — README prioritaire

Ce fichier est la **référence** pour la sécurité de ce dépôt (humain + IA). Les règles Cursor (`.cursor/rules/security-*.mdc`) **complètent** ce README ; en cas de doute, **ce README gagne** pour le process (rituel, prompts, checklists).

### Phrase à coller en début de session Cursor

Copie-colle ceci au début d’une demande importante (feature, refacto, déploiement) :

```text
Base-toi sur le README du dépôt (sections « Contrat sécurité », variables d’environnement, rituel fin de session) et sur .cursor/rules/security-*.mdc. Applique le rituel sécurité du README si tu touches au formulaire, à l’API contact, aux secrets ou au HTML injecté. Réponds en français.
```

### Ce que « le plus sécurisé possible » veut dire ici (honnêteté)

- **Inclus :** respect du rituel (lint, build, audit deps, revues ciblées), pas de secrets dans le repo, API contact durcie (validation, reCAPTCHA, rate limit, honeypot, HTML mail échappé, CORS sans `*` en prod sauf config explicite), `dangerouslySetInnerHTML` uniquement pour contenu contrôlé, dépendances suivies.
- **Exclus / hors périmètre automatique :** pentest professionnel, bug bounty, monitoring SOC, WAF managé, conformité réglementaire complète. Pour aller plus loin, prévoir un **prestataire** ou des outils payants / intégrations (Sentry, WAF, etc.) listés plus bas.

### Périmètre des menaces (où regarder en priorité)

| Menace | Cibles typiques dans ce repo |
|--------|------------------------------|
| Spam / abus du formulaire | `src/app/api/contact/route.ts`, `src/components/Contact.tsx` |
| Fuite de secrets | `.env*`, tout `NEXT_PUBLIC_*`, logs navigateur / messages d’erreur API |
| XSS / HTML dangereux | `src/app/layout.tsx`, HTML généré dans `route.ts` (email) |
| Mauvaise config prod | CORS (`NEXT_PUBLIC_SITE_URL`, `VERCEL_URL`, fallback domaine dans `route.ts`), en-têtes HTTP (`security-checklist.md`, `csp-implementation-guide.md`) |
| Vulnérabilités des dépendances | `pnpm audit`, mises à jour `next`, `nodemailer`, etc. |

### Revue rapide manuelle (~3 min, après un lot de modifs)

Depuis la racine du projet (avec [ripgrep](https://github.com/BurntSushi/ripgrep) `rg`, ou recherche équivalente dans l’IDE) :

```bash
rg "dangerouslySetInnerHTML" src
rg "NEXT_PUBLIC_" src
rg "process\.env" src/components
rg "eval\\(|new Function|\\bFunction\\(" src
```

**Lecture rapide :** `dangerouslySetInnerHTML` → contenu **uniquement** statique ou lu depuis un fichier du repo ; `NEXT_PUBLIC_*` → jamais de secret ; `process.env` dans les composants → rappel : seules les variables `NEXT_PUBLIC_` sont exposées au navigateur, les autres sont `undefined` côté client (mais ne pas s’en servir pour « cacher » un secret côté serveur dans un fichier client).

### Nouvelle dépendance ou nouveau fichier sensible

Avant de merger : d’où vient le paquet, est-il maintenu, `pnpm audit` impacté ? Si le fichier touche **auth / paiement / données perso / API** → refaire au minimum l’**étape 1** + **étape 2** du rituel ci-dessous.

## Pratiques d’équipe

Pour travailler à plusieurs sur le même dépôt :

- **Gestionnaire de paquets : pnpm uniquement.** Le champ `packageManager` dans `package.json` fixe la version. N’utilise pas `npm install` ni `yarn` sur ce projet : tu obtiendrais un autre lockfile et des installs incohérentes. Installe [pnpm](https://pnpm.io/installation) si besoin, ou active Corepack : `corepack enable`, puis les commandes ci‑dessous utiliseront la bonne version.
- **Première installation :** `pnpm install`
- **Développement local :** `pnpm dev`
- **Qualité :** `pnpm lint` avant fusion ; `pnpm build` pour vérifier que la production compile.
- **Secrets :** ne jamais committer `.env`, `.env.local`, clés SMTP, `RECAPTCHA_SECRET_KEY`, mots de passe. Ils sont listés dans `.gitignore` ; en local, créez un fichier `.env.local` (non versionné) avec les variables requises par l’API contact (voir section **Variables d’environnement** ci‑dessous).
- **Sécurité & Cursor :** les règles pour l’IA sont dans `.cursor/rules/` (`security-*.mdc`). Pour toute tâche un peu sensible, utiliser en plus la **phrase du bloc « Contrat sécurité »** ci-dessus pour forcer l’alignement sur ce README.
- **Docs complémentaires :** `security-checklist.md`, `security-implementation-steps.md`, `csp-implementation-guide.md` (déploiement, en-têtes, CSP).

### Variables d’environnement (API contact)

Obligatoires côté serveur pour l’envoi d’emails et la vérification reCAPTCHA :

`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `CONTACT_SENDER_EMAIL`, `CONTACT_RECIPIENT_EMAIL`, `RECAPTCHA_SECRET_KEY`

Optionnelles : `NEXT_PUBLIC_SITE_URL` (origine CORS : en prod, plus de `*` — priorité à cette URL, puis prévisualisation Vercel si `VERCEL_URL`, sinon fallback `https://asdinfor.ovh` dans le code ; change ce fallback si tu changes de domaine), `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (clé publique côté client), `MAX_EMAILS_PER_IP`, `MIN_SUBMISSION_TIME`.

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
   - endpoint public non durci (formulaire /api/contact : validation, reCAPTCHA, rate limit, honeypot, délai min de soumission, erreurs 500 sans fuite de détails ; champs mail HTML échappés côté serveur)
   - XSS (dangerouslySetInnerHTML avec données utilisateur ou non contrôlées ; tout HTML issu du formulaire dans l’email ou la page)
   - secrets ou .env exposés (client `NEXT_PUBLIC_*`, logs navigateur, messages d’erreur renvoyés au client)
   - CORS (origine autorisée : pas de `*` implicite en prod ; cohérence `NEXT_PUBLIC_SITE_URL` / `VERCEL_URL` / fallback domaine dans route.ts)
   - rate limit uniquement en mémoire (limite si plusieurs instances serverless — noter en MOYEN/FAIBLE si pertinent)
   - méthodes HTTP incorrectes (contact en POST uniquement pour l’action sensible, pas de GET équivalent)
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
- [ ] pas de secret dans le diff (.env, clés SMTP, RECAPTCHA_SECRET_KEY, tokens)
- [ ] /api/contact inchangé ou toujours protégé (POST, env, reCAPTCHA, rate limit, honeypot, HTML mail échappé, CORS prod)
- [ ] pas de dangerouslySetInnerHTML avec contenu utilisateur ou API externe non sanitisé
- [ ] aucun nouveau NEXT_PUBLIC_* secret ; pas de console.log de données sensibles côté client
- [ ] NEXT_PUBLIC_SITE_URL / domaine de prod cohérent si tu touches à CORS ou au fallback dans route.ts
- [ ] si nouvelle dépendance : pnpm audit relu pour les vulnérabilités HIGH sur le paquet ajouté

Confirme oui/non pour chaque point en te basant sur le diff actuel.
```

Ne push / merge **que si** tout est OK (ou seulement des points MOYEN/FAIBLE acceptés consciemment).

#### Étape 5 — Audit global (1× par mois)

Remplacer l’étape 2 par :

```
Audit sécurité GLOBAL du repo pure-portfolio (OWASP Top 10 adapté site vitrine).
Parcours prioritaire : src/app/api/**, src/components/Contact.tsx, src/app/layout.tsx, next.config.js, public/theme-init.js, pnpm-lock.yaml / package.json, .env.example si présent.
Priorise CRITIQUE et ÉLEVÉ. Pas de modification, rapport seulement. Français.
```

#### Outils optionnels (plus tard)

| Outil | Rôle | Coût |
|-------|------|------|
| Dependabot (GitHub) | alertes dépendances vulnérables | gratuit |
| `pnpm audit` | scan deps en local / CI | gratuit |
| Sentry | erreurs en production | gratuit au début |
| Redis / Upstash | rate limit partagé entre instances (si l’API est déployée sur plusieurs nœuds) | selon offre |

Ce rituel **complète** les règles Cursor. Les garde-fous déjà dans le code incluent notamment : reCAPTCHA serveur, rate limit par IP (mémoire), honeypot, délai de soumission, normalisation des champs, **échappement HTML** des champs dans l’email, **CORS** sans `*` en production par défaut.

**Rappel :** dire à l’IA « base-toi sur le README » sans lui coller la **phrase du contrat** ou sans lui demander l’**étape 2** du rituel, c’est moins fiable — le README est long ; la phrase et les prompts **structurent** la revue.

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
