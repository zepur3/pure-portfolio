# Rapport sécurité — pure-portfolio

_Novembre 2026 — skills `security-review` et `security-best-practices` (guides Next.js, React, frontend JS)._

## Résumé

Aucune vulnérabilité exploitable à haute confiance. Les failles réelles (Next.js RCE, validation de l'API contact) ont été corrigées dans les PR #4 et #5. Il reste deux risques acceptés, documentés ci-dessous.

Surface d'attaque : une page statique + une seule route serveur (`POST /api/contact`), sans authentification, cookies ni base de données.

## Corrigé dans cette passe

| ID | Règle | Correction |
|---|---|---|
| F-1 | Conseil skill (HSTS) | En-tête `Strict-Transport-Security` manuel retiré de `next.config.js` : Vercel envoie déjà `max-age=63072000` sans `includeSubDomains`. Notre version ajoutait `includeSubDomains`, qui aurait pu bloquer un sous-domaine HTTP d'asdinfor.ovh pendant 2 ans. |
| F-2 | REACT-3P-001 / JS-SUPPLY-001 | Script global `recaptcha/api.js` retiré de `src/app/layout.tsx` : il était chargé en double (le composant `react-google-recaptcha` charge déjà le sien). Un script tiers de moins sur chaque page. |

## Déjà conforme

- **NEXT-SUPPLY-001** : Next.js 16.4.5 (CVE RCE corrigées), `pnpm audit` à 0.
- **NEXT-INPUT-001** : `route.ts` vérifie types, longueurs min/max, format email strict, taille du corps (32 Ko).
- **NEXT-XSS-001** : les deux `dangerouslySetInnerHTML` de `layout.tsx` rendent des constantes serveur (JSON-LD, CSS critique).
- **NEXT-CORS-001 / CSRF** : origine explicite, POST cross-origin refusés (`route.ts:180`).
- **NEXT-HEADERS-001** : CSP, `nosniff`, `X-Frame-Options: DENY`, `frame-ancestors 'none'`, Referrer/Permissions-Policy.
- **NEXT-ERROR-001 / NEXT-LOG-001** : message générique au client ; le log serveur (`route.ts:312`) ne contient ni en-têtes ni secrets.
- **NEXT-SECRETS-001** : aucun secret dans l'historique git ; seules la clé *site* reCAPTCHA et l'URL du site sont en `NEXT_PUBLIC_*`.

## Risques acceptés

### R-1 — CSP avec `script-src 'unsafe-inline'` (Medium, NEXT-CSP-001)
`next.config.js:8`. La page est générée statiquement ; un nonce imposerait un rendu dynamique à chaque visite (plus de cache CDN). Le site n'affiche aucun contenu utilisateur, donc pas de vecteur XSS connu. **À revoir** si une fonctionnalité affiche un jour du contenu saisi par des visiteurs.

### R-2 — Rate limit en mémoire (Medium, NEXT-DOS-001)
`route.ts:8`. Sur Vercel, chaque instance a son compteur : la limite de 5 envois/heure/IP est contournable en partie. Le reCAPTCHA reste la vraie barrière anti-spam. **Amélioration possible** : Upstash Redis (`@upstash/ratelimit`) via le Marketplace Vercel.

### Note — Comparaison Origin / Host (NEXT-HOST-001)
`route.ts:180` et `route.ts:269` utilisent l'en-tête `Host`, uniquement pour **comparer** (pas pour construire une URL), comme le fait Next.js pour ses Server Actions. Sur Vercel, `Host` est le domaine réellement servi.
