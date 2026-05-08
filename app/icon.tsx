import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
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
          background: "#0a1f5c",
          borderRadius: 6,
        }}
      >
        <span style={{ color: "#c8980a", fontSize: 20, fontWeight: 900 }}>T</span>
      </div>
    ),
    { ...size },
  );
}
