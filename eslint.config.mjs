import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: [
      "src/components/Hero.tsx",
      "src/components/ThemeProvider.tsx",
      "src/components/ThemeToggle.tsx",
      "src/components/ProgressiveImage.tsx",
      "src/hooks/useIsMobile.ts",
    ],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "dist/**",
    "out/**",
    "next-env.d.ts",
  ]),
]);
