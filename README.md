# Pure Portfolio

**Tu travailles sur CE dépôt (`pure-portfolio`) — pas sur IDAES ni un autre SaaS.** Ne pas recoller un README d’ailleurs tel quel : la stack et les risques sont spécifiques ici.

Site vitrine **ASD Infor** : portfolio (Next.js), sections Accueil / À propos / Services / Projets / Contact, thème clair-sombre, SEO + Open Graph. Une seule **API** : envoi du formulaire de contact (SMTP + reCAPTCHA + rate limit).

---

## Ce dépôt en 5 lignes

1. **Next.js 16** (App Router), **React 19**, **TypeScript**, **Tailwind 4**, UI **Framer Motion** / GSAP — tout vit sous `src/app/` et `src/components/`.
2. **Backend minimal** : une route `POST /api/contact` (`src/app/api/contact/route.ts`), pas de base de données, pas d’auth utilisateur dans l’app.
3. **Secrets** uniquement en variables d’environnement (SMTP, reCAPTCHA secret) ; le client ne voit que les `NEXT_PUBLIC_*` non sensibles (ex. clé site reCAPTCHA).
4. **Sécurité** centrée sur le **formulaire** (spam, XSS dans l’email, CORS), le **layout** (`dangerouslySetInnerHTML` contrôlé), et les **dépendances** (`pnpm audit`).
5. **Déploiement** type Vercel ou classique : en-têtes HTTP avancés souvent côté **serveur web** (voir `next.config.js` et docs à la racine).

---

## Présentation & stack réelle

| Élément | Détail |
|---------|--------|
| Runtime | Node (Next.js), `packageManager: pnpm@10.5.2`, lockfile `pnpm-lock.yaml` |
| App | `src/app/page.tsx`, `src/app/layout.tsx`, routes dynamiques `icon`, `apple-icon`, `opengraph-image` |
| API | `src/app/api/contact/route.ts` — **Nodemailer**, **rate-limiter-flexible** (mémoire), vérification **reCAPTCHA** Google |
| Front | **Tailwind 4** (`@tailwindcss/postcss`), **ESLint** (`eslint.config.mjs`, `eslint-config-next`) |
| Divers | **dompurify** (présent si besoin côté client), **critters**, overrides `pnpm` pour `motion-dom` / `motion-utils` alignés sur `framer-motion` |

Pas de Prisma, pas de Stripe, pas de session NextAuth dans ce repo.

---

## Pratiques d’équipe (vous deux sur le dépôt)

- **Paquets : `pnpm` uniquement** — le champ `packageManager` fixe la version. Pas de `npm install` / `yarn` sans migration (autre lockfile, installs incohérentes). `corepack enable` si besoin.
- **Install :** `pnpm install`
- **Dev :** `pnpm dev` → [http://localhost:3000](http://localhost:3000)
- **Qualité avant fusion :** `pnpm lint` puis `pnpm build`
- **Secrets :** jamais de `.env` / `.env.local` dans Git (déjà dans `.gitignore`). Pas de clés SMTP ni `RECAPTCHA_SECRET_KEY` dans le code ou les commentaires.

### Règles Cursor (alignées sur la structure)

| Fichier | Rôle |
|---------|------|
| `.cursor/rules/security-core.mdc` | `alwaysApply: true` — secrets, `NEXT_PUBLIC_*`, `dangerouslySetInnerHTML`, lint/build, audit |
| `.cursor/rules/security-api-contact.mdc` | `globs: src/app/api/**/*.ts` — POST, reCAPTCHA, rate limit, CORS, HTML mail |

Pour l’IA : en plus des règles, coller la **phrase du bloc « Contrat »** plus bas quand tu touches au contact, aux secrets ou au HTML injecté.

---

## Sécurité adaptée à **ce** portfolio

Ce n’est **pas** un blog (pas de contenu riche utilisateur, pas de commentaires, pas d’uploads, pas d’admin). Ce n’est **pas** une app avec login utilisateur. La surface d’attaque est volontairement **petite** — défense en profondeur raisonnable, pas de promesse « impénétrable ».

| Sujet | Situation ici |
|--------|----------------|
| **Secrets** | `.env.local` en local ; Vercel/hosting pour la prod. Jamais committer de secrets. `NEXT_PUBLIC_*` = visible dans le navigateur → **jamais** de secret (seulement ex. URL du site, clé **site** reCAPTCHA). |
| **Site « statique » vs backend** | Pages majoritairement statiques / SSR, **avec** une API route pour le contact. Pas de cookies de session métier ; le thème peut rester côté client (localStorage / classe) — pas de données sensibles dedans. |
| **Auth** | Aucune auth utilisateur dans l’app. |
| **Formulaire** | `Contact.tsx` → `POST /api/contact` : validation, honeypot, délai min, reCAPTCHA serveur, rate limit par IP, HTML mail **échappé**, CORS sans `*` en prod par défaut (`NEXT_PUBLIC_SITE_URL` / `VERCEL_URL` / fallback domaine dans `route.ts`). |
| **XSS** | Risque principal : **HTML mail** et tout futur `dangerouslySetInnerHTML`. Aujourd’hui : JSON-LD + CSS critique dans `layout.tsx` = **contenu contrôlé** uniquement. |
| **Analytics** | Pas d’analytics embarqué dans `package.json`. Si vous en ajoutez (GA, Plausible…), traiter la **confidentialité** (consentement, docs) à part. |
| **Headers / CSP** | `next.config.js` rappelle que certains en-têtes se configurent surtout **au niveau du serveur** (Apache/OVH). Voir `security-checklist.md`, `csp-implementation-guide.md`. |

---

## Checklist courte — **avant chaque commit / push**

À cocher mentalement (ou dans la PR) :

1. **`pnpm lint` et `pnpm build` passent.**
2. **Aucun secret** dans le diff (fichiers `.env*`, clés SMTP, `RECAPTCHA_SECRET_KEY`, tokens).
3. **Si `src/app/api/contact/route.ts` ou `Contact.tsx` changent** : pas de fuite d’infos dans les réponses JSON ; garde-fous toujours présents (POST, reCAPTCHA, rate limit, honeypot, escape HTML mail, CORS prod).
4. **Pas de `dangerouslySetInnerHTML`** avec du HTML utilisateur ou API non maîtrisée.
5. **Pas de nouveau `NEXT_PUBLIC_*`** contenant un secret ; pas de `console.log` de données sensibles côté client.
6. **Domaine / CORS** : si tu changes d’URL de prod, mets à jour `NEXT_PUBLIC_SITE_URL` et le fallback dans `route.ts` si besoin.
7. **Nouvelle dépendance** : coup d’œil à `pnpm audit` pour les vulnérabilités **HIGH** sur ce paquet.

Pour une revue plus poussée, enchaîner avec le **rituel fin de session** ci-dessous.

---

## Contrat sécurité — README prioritaire

Ce README est la **référence process** (humain + IA). Les `.cursor/rules/security-*.mdc` **complètent** ; en cas de doute sur le **workflow** sécurité, **ce README prime**.

### Phrase à coller en début de session Cursor

```text
Base-toi sur le README du dépôt pure-portfolio (sections présentation, sécurité portfolio, checklist, rituel fin de session) et sur .cursor/rules/security-*.mdc. Applique le rituel si tu touches au formulaire, à l’API contact, aux secrets ou au HTML injecté. Réponds en français.
```

### Ce que « le plus sécurisé possible » veut dire ici

- **Inclus :** rituel (lint, build, audit deps, revues ciblées), pas de secrets dans le repo, API contact durcie, `dangerouslySetInnerHTML` réservé au contenu contrôlé, dépendances suivies.
- **Exclus :** pentest pro, bug bounty, SOC, WAF managé, conformité complète — à traiter avec un **prestataire** ou des outils dédiés si un jour le périmètre grossit.

### Périmètre des menaces (où regarder)

| Menace | Cibles typiques |
|--------|-----------------|
| Spam / abus formulaire | `src/app/api/contact/route.ts`, `src/components/Contact.tsx` |
| Fuite de secrets | `.env*`, `NEXT_PUBLIC_*`, logs / erreurs API |
| XSS / HTML | `src/app/layout.tsx`, HTML généré dans `route.ts` (email) |
| Mauvaise config prod | CORS dans `route.ts`, en-têtes (`security-checklist.md`, `csp-implementation-guide.md`) |
| Deps vulnérables | `pnpm audit`, mises à jour `next`, `nodemailer`, etc. |

### Revue rapide manuelle (~3 min)

```bash
rg "dangerouslySetInnerHTML" src
rg "NEXT_PUBLIC_" src
rg "process\.env" src/components
rg "eval\\(|new Function|\\bFunction\\(" src
```

**Lecture :** `dangerouslySetInnerHTML` → contenu statique ou fichier du repo ; `NEXT_PUBLIC_*` → jamais secret ; `process.env` dans les composants client → seuls les `NEXT_PUBLIC_` existent côté navigateur.

### Nouvelle dépendance ou fichier sensible

Avant merge : origine du paquet, `pnpm audit` ; si auth / paiement / données perso / API → minimum **étape 1 + étape 2** du rituel.

### Variables d’environnement (API contact)

**Obligatoires :** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `CONTACT_SENDER_EMAIL`, `CONTACT_RECIPIENT_EMAIL`, `RECAPTCHA_SECRET_KEY`

**Optionnelles :** `NEXT_PUBLIC_SITE_URL` (CORS prod), `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `MAX_EMAILS_PER_IP`, `MIN_SUBMISSION_TIME`

---

## Rituel « fin de session » (~15–20 min)

| Fréquence | Action |
|-----------|--------|
| Fin de session de code | Étapes 1 → 4 |
| 1× / semaine | `pnpm audit` |
| 1× / mois | Étape 5 + fichier `docs/SECURITY_WATCH.md` |

### Étape 1 — Local (~2 min)

```bash
pnpm lint
pnpm build
```

Ne pas push tant que ce n’est pas vert.

### Étape 2 — Audit IA sur les fichiers modifiés

Coller dans Cursor :

```
Audit sécurité — fin de session

Contexte : je viens de coder sur pure-portfolio. Ne modifie rien pour l’instant, analyse seulement.

1) Liste les fichiers modifiés dans cette session (ou demande-moi git diff si tu ne les vois pas).
2) Sur UNIQUEMENT ces fichiers, cherche :
   - endpoint public non durci (formulaire /api/contact : validation, reCAPTCHA, rate limit, honeypot, délai min, erreurs 500 sans fuite ; HTML mail échappé)
   - XSS (dangerouslySetInnerHTML non contrôlé ; HTML issu du formulaire)
   - secrets ou .env exposés (NEXT_PUBLIC_*, logs, messages d’erreur)
   - CORS (pas de * implicite en prod ; NEXT_PUBLIC_SITE_URL / VERCEL_URL / fallback dans route.ts)
   - rate limit mémoire vs multi-instances (noter MOYEN/FAIBLE si pertinent)
   - POST pour l’action sensible, pas de GET équivalent
   - en-têtes / CSP si déploiement ou next.config
   - violations .cursor/rules/security-*.mdc

3) Classe chaque finding : CRITIQUE / ÉLEVÉ / MOYEN / FAIBLE
4) Fichier, risque en 1 phrase, correctif concret
5) Merge oui/non ?

Réponds en français.
```

### Étape 3 — Corriger CRITIQUE / ÉLEVÉ

```
Corrige uniquement les findings CRITIQUE et ÉLEVÉ de l’audit précédent.
Respecte .cursor/rules/security-*.mdc.
Ne refactorise pas le reste. Résumé des changements.
```

Puis refaire l’**étape 1**.

### Étape 4 — Checklist merge (détaillée)

```
Checklist finale avant merge :
- [ ] lint + build OK
- [ ] pas de secret dans le diff
- [ ] /api/contact toujours protégé (POST, env, reCAPTCHA, rate limit, honeypot, HTML mail, CORS prod)
- [ ] pas de dangerouslySetInnerHTML avec contenu utilisateur / API non sanitisé
- [ ] aucun NEXT_PUBLIC_* secret ; pas de console.log de données sensibles côté client
- [ ] NEXT_PUBLIC_SITE_URL / domaine cohérent si CORS modifié
- [ ] nouvelle dep : pnpm audit (HIGH) relu

Confirme oui/non pour chaque point selon le diff.
```

### Étape 5 — Audit global (1× / mois)

```
Audit sécurité GLOBAL pure-portfolio (OWASP Top 10 adapté site vitrine).
Parcours : src/app/api/**, Contact.tsx, layout.tsx, next.config.js, public/theme-init.js, pnpm-lock.yaml, package.json.
CRITIQUE / ÉLEVÉ en priorité. Rapport seulement, pas de modif. Français.
```

### Outils optionnels

| Outil | Rôle |
|-------|------|
| Dependabot | alertes dépendances |
| `pnpm audit` | scan local / CI |
| Sentry | erreurs prod |
| Redis / Upstash | rate limit partagé si beaucoup d’instances |

**Rappel :** « Base-toi sur le README » sans la **phrase du contrat** ni l’**étape 2**, c’est moins fiable — le doc est long ; la phrase **cadre** la revue.

---

## Veille mensuelle (optionnel, allégé)

Fichier dédié : **`docs/SECURITY_WATCH.md`** (rappel court : audit deps, OWASP, contact route, déploiement). Pas obligatoire à chaque push ; utile **1× par mois** en plus du rituel.

---

## Démarrage

```bash
pnpm install
pnpm dev
```

Pages principales : `src/app/page.tsx`, `src/app/layout.tsx` (SEO, JSON-LD, styles critiques lus depuis `src/app/critical.css`).

## Polices

[`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) — **Geist** et **Geist Mono** (Google Fonts).

## Déploiement

[Vercel](https://vercel.com) ou hébergement classique. En-têtes avancés souvent sur le **serveur web** (Apache/OVH) : voir `next.config.js`, `security-checklist.md`. Doc Next : [déploiement](https://nextjs.org/docs/app/building-your-application/deploying).

---

## Docs à la racine (hors `docs/`)

- `security-checklist.md`, `security-implementation-steps.md`, `csp-implementation-guide.md` — déploiement OVH / en-têtes.
