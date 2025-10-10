"use client";

import { useEffect, useState } from "react";

interface TypingTextProps {
  text: string;
  speed?: number; // ms per character
  className?: string;
}

const TypingText: React.FC<TypingTextProps> = ({ text, speed = 45, className = "" }) => {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  return (
    <span className={className} aria-label={text}>
      {displayed.slice(0, text.length)}
      <span className="border-r-2 border-accent animate-blink ml-0.5" />
    </span>
  );
};

export default TypingText;
