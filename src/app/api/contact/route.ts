import { NextResponse } from "next/server";
import { RateLimiterMemory } from "rate-limiter-flexible";
import nodemailer from "nodemailer";

const maxEmailsPerIp = Number(process.env.MAX_EMAILS_PER_IP ?? 5);
const limiterDurationSeconds = 60 * 60; // 1 heure

const rateLimiter = new RateLimiterMemory({
  points: Number.isFinite(maxEmailsPerIp) && maxEmailsPerIp > 0 ? maxEmailsPerIp : 5,
  duration: limiterDurationSeconds,
});

/** Origine publique connue si aucune variable CORS n’est définie (évite `*` en prod). */
const FALLBACK_PRODUCTION_ORIGIN = "https://asdinfor.ovh";

type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: number;
  honeypot?: string;
  recaptchaToken: string;
};

const REQUIRED_ENV_VARS = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "CONTACT_SENDER_EMAIL",
  "CONTACT_RECIPIENT_EMAIL",
  "RECAPTCHA_SECRET_KEY",
] as const;

function getAllowedOrigin(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  // Domaine de prod (ex. asdinfor.ovh) : VERCEL_URL ne donne que l'URL du déploiement.
  const vercel = (process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL)?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "");
    return `https://${host}`;
  }
  if (process.env.NODE_ENV === "production") return FALLBACK_PRODUCTION_ORIGIN;
  return "*";
}

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": getAllowedOrigin(),
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Configuration serveur incomplète. Variables manquantes: ${missing.join(", ")}`);
  }
}

async function verifyRecaptcha(token: string, remoteIp: string | null, expectedHost: string | null) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    throw new Error("RECAPTCHA_SECRET_KEY non configurée");
  }

  const params = new URLSearchParams();
  params.append("secret", secret);
  params.append("response", token);
  if (remoteIp) {
    params.append("remoteip", remoteIp);
  }

  const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error("Impossible de vérifier le reCAPTCHA");
  }

  const data = await response.json();
  if (data.success !== true) return false;
  // Un token résolu sur un autre site (qui réutiliserait la clé publique) est refusé.
  // (Contrôle limité à la prod : les clés de test Google renvoient "testkey.google.com".)
  if (
    process.env.NODE_ENV === "production" &&
    expectedHost &&
    typeof data.hostname === "string" &&
    data.hostname !== expectedHost
  ) {
    return false;
  }
  return true;
}

function sanitizeText(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

/** Évite injection HTML dans le corps mail (clients mail). */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validatePayload(payload: ContactPayload) {
  const errors: string[] = [];

  if (!payload.name || payload.name.trim().length < 2) {
    errors.push("Nom invalide");
  }
  // Pas de , ; < > " ( ) : sinon nodemailer interprète plusieurs adresses dans le Reply-To.
  if (!payload.email || !/^[^\s@<>,;"()\[\]\\:]+@[^\s@<>,;"()\[\]\\:]+\.[^\s@<>,;"()\[\]\\:]+$/.test(payload.email)) {
    errors.push("Email invalide");
  }
  if (!payload.subject || payload.subject.trim().length < 3) {
    errors.push("Sujet invalide");
  }
  if (!payload.message || payload.message.trim().length < 10) {
    errors.push("Message trop court");
  }
  if (!payload.recaptchaToken) {
    errors.push("Token reCAPTCHA manquant");
  }
  // Bornes hautes : sans elles, un seul envoi pouvait faire plusieurs Mo de mail.
  if (String(payload.name ?? "").length > 100) errors.push("Nom trop long");
  if (String(payload.email ?? "").length > 254) errors.push("Email trop long");
  if (String(payload.subject ?? "").length > 200) errors.push("Sujet trop long");
  if (String(payload.message ?? "").length > 5000) errors.push("Message trop long (5000 caractères max)");

  return errors;
}

/**
 * `x-vercel-forwarded-for` est posé par l'edge Vercel et ne peut pas être falsifié
 * par le client. `x-forwarded-for` en revanche est complété (pas remplacé) par
 * l'infra : un client peut y préfixer une IP arbitraire, donc on ne doit jamais
 * en prendre la première valeur (ça permettrait de contourner le rate limit).
 */
function getClientIp(request: Request): string {
  const vercelIp = request.headers.get("x-vercel-forwarded-for");
  if (vercelIp) return vercelIp.split(",")[0].trim();

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const parts = forwardedFor.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }

  return request.headers.get("x-real-ip") ?? "127.0.0.1";
}

/** Taille max du corps JSON (5000 car. de message + marge pour les autres champs et le token). */
const MAX_BODY_BYTES = 32 * 1024;

/**
 * Refuse les POST venant d'un autre site (le CORS ne bloque que la lecture de la
 * réponse, pas l'envoi). Un navigateur envoie toujours `Origin` sur un POST fetch.
 */
function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";
  const allowed = getAllowedOrigin();
  if (allowed === "*") return true;
  const host = request.headers.get("host");
  return origin === allowed || (host !== null && origin === `https://${host}`);
}

export async function POST(request: Request) {
  try {
    validateEnv();

    if (!isAllowedOrigin(request)) {
      return NextResponse.json({ success: false, error: "Origine non autorisée" }, { status: 403 });
    }

    if (!request.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json(
        { success: false, error: "Content-Type invalide" },
        { status: 415, headers: corsHeaders() }
      );
    }

    const declaredLength = Number(request.headers.get("content-length") ?? 0);
    if (declaredLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { success: false, error: "Requête trop volumineuse" },
        { status: 413, headers: corsHeaders() }
      );
    }

    const clientIp = getClientIp(request);

    try {
      await rateLimiter.consume(clientIp);
    } catch {
      return NextResponse.json(
        { success: false, error: "Trop de tentatives. Veuillez réessayer plus tard." },
        { status: 429, headers: corsHeaders() }
      );
    }

    let payload: ContactPayload;
    try {
      // Lecture en texte pour borner la taille même sans Content-Length (chunked).
      const raw = await request.text();
      if (raw.length > MAX_BODY_BYTES) {
        return NextResponse.json(
          { success: false, error: "Requête trop volumineuse" },
          { status: 413, headers: corsHeaders() }
        );
      }
      payload = JSON.parse(raw);
      if (typeof payload !== "object" || payload === null) throw new Error("payload");
      // Force les types attendus : un objet/tableau dans `name` ou `message` ne doit pas passer.
      for (const key of ["name", "email", "subject", "message", "recaptchaToken"] as const) {
        if (typeof payload[key] !== "string") throw new Error("type");
      }
    } catch {
      return NextResponse.json(
        { success: false, error: "Corps de requête invalide" },
        { status: 400, headers: corsHeaders() }
      );
    }

    if (payload.honeypot) {
      return NextResponse.json({ success: true }, { status: 200, headers: corsHeaders() });
    }

    const minSubmissionTime = Number(process.env.MIN_SUBMISSION_TIME ?? 3);
    if (Number.isFinite(payload.timestamp) && Number.isFinite(minSubmissionTime) && minSubmissionTime > 0) {
      const elapsed = Math.floor(Date.now() / 1000) - Number(payload.timestamp);
      if (elapsed < minSubmissionTime) {
        return NextResponse.json(
          { success: false, error: "Soumission trop rapide, merci de réessayer." },
          { status: 400, headers: corsHeaders() }
        );
      }
    }

    const validationErrors = validatePayload(payload);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, error: validationErrors.join(", ") },
        { status: 400, headers: corsHeaders() }
      );
    }

    const requestHost = request.headers.get("host")?.split(":")[0] ?? null;
    const recaptchaOk = await verifyRecaptcha(payload.recaptchaToken, clientIp, requestHost);
    if (!recaptchaOk) {
      return NextResponse.json(
        { success: false, error: "Vérification reCAPTCHA échouée." },
        { status: 400, headers: corsHeaders() }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const nameLine = escapeHtml(sanitizeText(payload.name));
    const emailLine = escapeHtml(sanitizeText(payload.email));
    const subjectLine = escapeHtml(sanitizeText(payload.subject));
    const messageHtml = escapeHtml(payload.message).replace(/\n/g, "<br />");

    const htmlMessage = `
      <p><strong>Nom :</strong> ${nameLine}</p>
      <p><strong>Email :</strong> ${emailLine}</p>
      <p><strong>Sujet :</strong> ${subjectLine}</p>
      <p><strong>Message :</strong></p>
      <p>${messageHtml}</p>
    `;

    await transporter.sendMail({
      from: `Portfolio <${process.env.CONTACT_SENDER_EMAIL}>`,
      to: process.env.CONTACT_RECIPIENT_EMAIL,
      replyTo: sanitizeText(payload.email),
      subject: `[Portfolio] ${sanitizeText(payload.subject)}`,
      text: `Nom: ${sanitizeText(payload.name)}\nEmail: ${sanitizeText(payload.email)}\nSujet: ${sanitizeText(payload.subject)}\n\n${payload.message}`,
      html: htmlMessage,
    });

    return NextResponse.json({ success: true }, { headers: corsHeaders() });
  } catch (error) {
    console.error("Erreur API contact:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de l'envoi du message." },
      { status: 500, headers: corsHeaders() }
    );
  }
}
