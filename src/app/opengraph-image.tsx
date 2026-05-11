import { ImageResponse } from "next/og";

export const alt = "Hidden Spaces Daman - quiet beaches, old lanes, cafés and local field notes";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(115deg, #edf7f8 0%, #fffdf8 42%, #f5efe6 100%)",
          color: "#151515",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(75,55,29,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(75,55,29,.10) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
            opacity: 0.34,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 510,
            top: -100,
            width: 380,
            height: 820,
            borderRadius: 220,
            border: "2px solid rgba(79,143,168,.28)",
            transform: "rotate(11deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 95,
            top: 130,
            display: "flex",
            gap: 26,
          }}
        >
          {["#d99a3d", "#8fa382", "#9e3f2f", "#4f8fa8"].map((color, index) => (
            <div
              key={color}
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                background: "#fffdf8",
                border: `8px solid ${color}`,
                boxShadow: "0 16px 40px rgba(15,23,42,.14)",
                transform: `translateY(${index % 2 ? 58 : 0}px)`,
              }}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: 760,
            paddingLeft: 82,
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              marginBottom: 34,
              fontFamily: "Arial, sans-serif",
              color: "#9e3f2f",
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: 4,
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                background: "#d99a3d",
                boxShadow: "0 0 0 10px rgba(217,154,61,.16)",
              }}
            />
            LIVE FIELD MAP
          </div>
          <div
            style={{
              fontSize: 92,
              lineHeight: 0.95,
              letterSpacing: "-4px",
              fontWeight: 700,
            }}
          >
            Hidden Spaces Daman
          </div>
          <div
            style={{
              marginTop: 30,
              maxWidth: 650,
              fontFamily: "Arial, sans-serif",
              fontSize: 32,
              lineHeight: 1.35,
              color: "#55493c",
            }}
          >
            Quiet beaches, old lanes, cafés and local field notes around Daman.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
