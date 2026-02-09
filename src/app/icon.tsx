import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          width="512"
          height="512"
        >
          <defs>
            <radialGradient id="glowTR" cx="100%" cy="0%" r="80%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
              <stop offset="25%" stopColor="#8b5cf6" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#6d74ff" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="glowBL" cx="0%" cy="100%" r="80%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.75" />
              <stop offset="25%" stopColor="#22d3ee" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#6d74ff" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#6d74ff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="letterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0e7ff" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect x="16" y="16" width="480" height="480" rx="96" ry="96" fill="#0a0a0a" />
          <rect x="16" y="16" width="480" height="480" rx="96" ry="96" fill="url(#glowTR)" />
          <rect x="16" y="16" width="480" height="480" rx="96" ry="96" fill="url(#glowBL)" />
          <rect x="18" y="18" width="476" height="476" rx="94" ry="94" fill="none" stroke="url(#borderGrad)" strokeWidth="1.5" />

          <path d="M160 380 L232 132 C236 120 240 114 256 114 C272 114 276 120 280 132 L352 380 C354 388 348 394 340 394 L316 394 C308 394 302 390 300 382 L284 330 L228 330 L212 382 C210 390 204 394 196 394 L172 394 C164 394 158 388 160 380 Z M240 294 L272 294 L256 228 Z" fill="url(#letterGrad)" filter="url(#neonGlow)" />
        </svg>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  );
}
