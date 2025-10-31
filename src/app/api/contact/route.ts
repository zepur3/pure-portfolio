import { NextResponse } from "next/server";
import { RateLimiterMemory } from "rate-limiter-flexible";
import nodemailer from "nodemailer";

const maxEmailsPerIp = Number(process.env.MAX_EMAILS_PER_IP ?? 5);
const limiterDurationSeconds = 60 * 60; // 1 heure

const rateLimiter = new RateLimiterMemory({
  points: Number.isFinite(maxEmailsPerIp) && maxEmailsPerIp > 0 ? maxEmailsPerIp : 5,
  duration: limiterDurationSeconds,
});

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

function validateEnv() {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Configuration serveur incomplète. Variables manquantes: ${missing.join(", ")}`);
  }
}

async function verifyRecaptcha(token: string, remoteIp: string | null) {
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
  });

  if (!response.ok) {
    throw new Error("Impossible de vérifier le reCAPTCHA");
  }

  const data = await response.json();
  return data.success === true;
}

function sanitizeText(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function validatePayload(payload: ContactPayload) {
  const errors: string[] = [];

  if (!payload.name || payload.name.trim().length < 2) {
    errors.push("Nom invalide");
  }
  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
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

  return errors;
}

export async function POST(request: Request) {
  try {
    validateEnv();

    const ipHeader = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip");
    const clientIp = ipHeader ? ipHeader.split(",")[0].trim() : "127.0.0.1";

    try {
      await rateLimiter.consume(clientIp);
    } catch {
      return NextResponse.json(
        { success: false, error: "Trop de tentatives. Veuillez réessayer plus tard." },
        { status: 429 }
      );
    }

    let payload: ContactPayload;
    try {
      payload = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Corps de requête invalide" },
        { status: 400 }
      );
    }

    if (payload.honeypot) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const minSubmissionTime = Number(process.env.MIN_SUBMISSION_TIME ?? 3);
    if (Number.isFinite(payload.timestamp) && Number.isFinite(minSubmissionTime) && minSubmissionTime > 0) {
      const elapsed = Math.floor(Date.now() / 1000) - Number(payload.timestamp);
      if (elapsed < minSubmissionTime) {
        return NextResponse.json(
          { success: false, error: "Soumission trop rapide, merci de réessayer." },
          { status: 400 }
        );
      }
    }

    const validationErrors = validatePayload(payload);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { success: false, error: validationErrors.join(", ") },
        { status: 400 }
      );
    }

    const recaptchaOk = await verifyRecaptcha(payload.recaptchaToken, clientIp);
    if (!recaptchaOk) {
      return NextResponse.json(
        { success: false, error: "Vérification reCAPTCHA échouée." },
        { status: 400 }
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

    const htmlMessage = `
      <p><strong>Nom :</strong> ${sanitizeText(payload.name)}</p>
      <p><strong>Email :</strong> ${sanitizeText(payload.email)}</p>
      <p><strong>Sujet :</strong> ${sanitizeText(payload.subject)}</p>
      <p><strong>Message :</strong></p>
      <p>${payload.message.replace(/\n/g, "<br />")}</p>
    `;

    await transporter.sendMail({
      from: `Portfolio <${process.env.CONTACT_SENDER_EMAIL}>`,
      to: process.env.CONTACT_RECIPIENT_EMAIL,
      replyTo: sanitizeText(payload.email),
      subject: `[Portfolio] ${sanitizeText(payload.subject)}`,
      text: `Nom: ${sanitizeText(payload.name)}\nEmail: ${sanitizeText(payload.email)}\nSujet: ${sanitizeText(payload.subject)}\n\n${payload.message}`,
      html: htmlMessage,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur API contact:", error);
    return NextResponse.json(
      { success: false, error: "Une erreur est survenue lors de l'envoi du message." },
      { status: 500 }
    );
  }
}
