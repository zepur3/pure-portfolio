import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ThemeProvider from "@/components/ThemeProvider";

import fs from 'fs';
import path from 'path';
import Script from 'next/script';

const SITE_URL = "https://asdinfor.ovh";
const SITE_NAME = "ASD Infor";
const SITE_TITLE = `${SITE_NAME} | Portfolio technicien systèmes & réseaux en formation`;
const SITE_DESCRIPTION = "Portfolio ASD Infor : futur technicien systèmes et réseaux, projets web réalisés en formation et disponibilité pour missions, alternance ou accompagnement numérique.";
const ASSET_VERSION = "20251212";
const FAVICON_URL = `/favicon.svg?v=${ASSET_VERSION}`;
const LOGO_URL = `/logo.svg?v=${ASSET_VERSION}`;
const MANIFEST_URL = `/manifest.webmanifest?v=${ASSET_VERSION}`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

// Lire les styles critiques
const criticalCssPath = path.join(process.cwd(), 'src/app/critical.css');
const criticalCss = fs.existsSync(criticalCssPath) 
  ? fs.readFileSync(criticalCssPath, 'utf8') 
  : '';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    SITE_NAME,
    "portfolio technicien systèmes réseaux",
    "projets web étudiant",
    "alternance systèmes et réseaux",
    "formation développement web",
    "optimisation SEO",
    "asdinfor.ovh",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "portfolio",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        type: "image/png",
        alt: `${SITE_NAME} – Création de sites web et solutions numériques`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        alt: `${SITE_NAME} – Création de sites web et solutions numériques`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: "Ys8DT1cQZg3_AVmu0k8FpYll04NpwrnJG7YKLgvUL_c",
  },
  manifest: MANIFEST_URL,
  icons: {
    icon: [
      { url: FAVICON_URL, type: "image/svg+xml" },
      { url: LOGO_URL, type: "image/svg+xml" },
    ],
    shortcut: [FAVICON_URL],
    apple: [
      { url: LOGO_URL, type: "image/svg+xml" },
    ],
    other: [
      { rel: "mask-icon", url: FAVICON_URL, color: "#6d28d9" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.svg?v=${ASSET_VERSION}`,
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href={FAVICON_URL} type="image/svg+xml" />
        <link rel="apple-touch-icon" href={LOGO_URL} />
        <link rel="manifest" href={MANIFEST_URL} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Google reCAPTCHA v2 */}
        <script
          src="https://www.google.com/recaptcha/api.js"
          async
          defer
        ></script>
        <Script
          id="organization-json-ld"
          strategy="beforeInteractive"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        
        {/* Styles critiques injectés directement pour éviter le blocage du rendu */}
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: 'var(--background)' }}
      >
        {/* Script pour initialiser le thème avant le rendu - utilisant le fichier externe */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          src="/theme-init.js"
        />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
