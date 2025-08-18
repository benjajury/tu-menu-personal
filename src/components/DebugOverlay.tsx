import { isDebug } from "@/lib/debug";

export default function DebugOverlay({ menuItems, answers, recommended }: any) {
  if (!isDebug) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 9999,
        background: "rgba(0,0,0,.85)",
        color: "#fff",
        padding: 12,
        borderRadius: 12,
        maxWidth: 360,
        fontSize: 12,
        lineHeight: 1.2,
        overflow: "auto",
        maxHeight: "60vh",
      }}
    >
      <div style={{ opacity: 0.8, fontWeight: 600 }}>DEBUG</div>
      <div>Total menú: {menuItems?.length ?? 0}</div>
      <div>Answers: {answers ? "sí" : "no"}</div>
      <div>Recommended: {recommended?.length ?? 0}</div>
      <hr style={{ opacity: 0.2 }} />
      <div style={{ whiteSpace: "pre-wrap" }}>
        {answers && JSON.stringify(answers, null, 2)}
      </div>
    </div>
  );
}
