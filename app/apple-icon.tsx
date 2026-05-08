import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #0a1f5c 0%, #1e3a8a 100%)",
          borderRadius: 36,
        }}
      >
        <span style={{ color: "#ffffff", fontSize: 38, fontWeight: 800, letterSpacing: -1 }}>
          TACC
        </span>
        <span style={{ color: "#c8980a", fontSize: 52, fontWeight: 900, marginTop: 4 }}>26</span>
      </div>
    ),
    { ...size },
  );
}
