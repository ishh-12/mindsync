import React from "react";

export default function ControlRoomBG() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        background:
          "radial-gradient(circle at 18% 12%, rgba(0,229,255,0.12), transparent 26%), radial-gradient(circle at 82% 18%, rgba(255,59,92,0.08), transparent 24%), linear-gradient(180deg, #060b15 0%, #090f1a 48%, #060b15 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(74,100,128,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(74,100,128,0.12) 1px, transparent 1px)",
          backgroundSize: "44px 44px, 44px 44px",
          opacity: 0.65,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: "8% 8%",
          border: "1px solid rgba(74,100,128,0.28)",
          boxShadow: "0 0 44px rgba(26,45,68,0.32) inset",
          opacity: 0.75,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, transparent 56%, rgba(4, 8, 18, 0.58) 100%)",
        }}
      />
    </div>
  );
}
