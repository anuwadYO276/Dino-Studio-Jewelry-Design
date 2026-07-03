import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-metadata";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#ffffff",
          color: "#171717",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 300,
            letterSpacing: "0.02em",
            fontFamily: "Georgia, serif",
          }}
        >
          Dino Studio
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 28,
            fontWeight: 300,
            color: "#737373",
            maxWidth: 720,
            lineHeight: 1.4,
            fontFamily: "Georgia, serif",
            fontStyle: "italic",
          }}
        >
          {SITE_DESCRIPTION}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: "#5a6b52",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
