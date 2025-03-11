/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',  
  images: {
    unoptimized: true,  
  },
  // Les en-têtes HTTP ne fonctionnent pas avec l'export statique
  // Ils devront être configurés au niveau du serveur web (Apache/Nginx)
};

export default nextConfig;
