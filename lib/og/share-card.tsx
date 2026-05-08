import { ImageResponse } from "next/og";

/** Shared 1200×630 card for `/opengraph-image` and `/twitter-image`. */
export function shareCardImageResponse() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "linear-gradient(145deg, #0a1f5c 0%, #143a94 52%, #0a1f5c 100%)",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              width: 8,
              height: 64,
              background: "#c8980a",
              borderRadius: 4,
              marginRight: 24,
            }}
          />
          <span
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            National Youth Conference 2026
          </span>
        </div>
        <span
          style={{
            fontSize: 30,
            fontWeight: 600,
            color: "rgba(255,255,255,0.92)",
            marginBottom: 18,
          }}
        >
          The Apostolic Church Cameroon — TACC
        </span>
        <span
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.78)",
          }}
        >
          14 – 17 July 2026 · Yaoundé, Cameroon
        </span>
        <div
          style={{
            marginTop: 48,
            display: "flex",
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 600,
              background: "#c8980a",
              color: "#0a1f5c",
              padding: "10px 22px",
              borderRadius: 999,
            }}
          >
            Registration · Donate · Fapshi
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
