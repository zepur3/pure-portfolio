import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";
export const runtime = "edge";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 96px",
          background: "radial-gradient(circle at 15% 20%, #8b5cf640, transparent 60%), radial-gradient(circle at 85% 30%, #38bdf830, transparent 65%), linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #312e81 100%)",
          color: "#e0e7ff",
          fontFamily: "'Geist', 'Segoe UI', sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: "32px",
              background: "radial-gradient(circle at 30% 30%, #818cf8, #3730a3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 48,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            ASD
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <span style={{ fontSize: 48, fontWeight: 600, letterSpacing: "0.04em" }}>
              ASD Infor
            </span>
            <span style={{ fontSize: 28, color: "#c7d2fe", maxWidth: 720 }}>
              Création de sites web modernes, optimisation SEO et solutions numériques sur mesure.
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 24,
            color: "#cbd5f5",
          }}
        >
          <span>asdinfor.ovh</span>
          <span>Création de sites web & accompagnement digital</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
