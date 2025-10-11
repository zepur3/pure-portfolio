import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Importer la feuille de style Mona-Sans au lieu de l'inclure manuellement
import "../styles/mona-sans.css";
import fs from 'fs';
import path from 'path';
import Script from 'next/script';

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
  title: "Portfolio | Créateur de Sites Web Professionnels",
  description: "Portfolio professionnel présentant mes projets, services de création de sites web et permettant de me contacter pour vos projets.",
  keywords: ["portfolio", "développeur web", "création de site", "web design", "freelance"],
  authors: [{ name: "Votre Nom" }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="google-site-verification" content="Ys8DT1cQZg3_AVmu0k8FpYll04NpwrnJG7YKLgvUL_c" />
        {/* Chargement du script de navigation de manière asynchrone */}
        <script src="/anchor-navigation.js" async defer></script>
        
        {/* Google reCAPTCHA v2 */}
        <script
          src="https://www.google.com/recaptcha/api.js"
          async
          defer
        ></script>
        
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
        {children}
      </body>
    </html>
  );
}
