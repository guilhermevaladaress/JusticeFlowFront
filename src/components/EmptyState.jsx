import { FileX } from "lucide-react";

export default function EmptyState({ title = "Nenhum registro encontrado", description }) {
  return (
    <div className="estado">
      <FileX size={44} strokeWidth={1.25} style={{ color: "#cbd5e1", marginBottom: 10 }} />
      <p style={{ fontWeight: 500, color: "#475569" }}>{title}</p>
      {description && <p style={{ fontSize: "0.8rem", marginTop: 4 }}>{description}</p>}
    </div>
  );
}
