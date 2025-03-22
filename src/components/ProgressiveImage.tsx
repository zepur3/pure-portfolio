"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ProgressiveImageProps {
  src: string;
  placeholderSrc?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  placeholderSrc,
  alt,
  className = "",
  width,
  height,
}) => {
  const [imgSrc, setImgSrc] = useState(placeholderSrc || src);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Réinitialiser l'état si la source change
    setImgSrc(placeholderSrc || src);
    setLoading(true);
    setError(false);
    
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      setImgSrc(src);
      setLoading(false);
    };
    
    img.onerror = () => {
      setError(true);
      setLoading(false);
    };
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, placeholderSrc]);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      {loading && (
        <motion.div
          className="absolute inset-0 bg-gray-200 dark:bg-gray-800"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        />
      )}
      
      {error ? (
        <div className="flex items-center justify-center w-full h-full bg-gray-100 dark:bg-gray-900">
          <svg 
            className="w-10 h-10 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <span className="sr-only">Erreur de chargement de l&apos;image</span>
        </div>
      ) : (
        <motion.img
          src={imgSrc}
          alt={alt}
          className={`w-full h-full object-cover ${loading ? 'blur-sm scale-105' : 'blur-0 scale-100'}`}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: loading ? 0.5 : 1,
          }}
          transition={{ duration: 0.5 }}
        />
      )}
    </div>
  );
};

export default ProgressiveImage;
