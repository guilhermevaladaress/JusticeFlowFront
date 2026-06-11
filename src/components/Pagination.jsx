export default function Pagination({ page, total, pageSize = 20, onChange }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="paginacao">
      <span>Página {page} de {totalPages}</span>
      <div className="paginacao-btns">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="btn-secundario"
          style={{ padding: "6px 14px", fontSize: "0.8rem" }}
        >
          Anterior
        </button>
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="btn-secundario"
          style={{ padding: "6px 14px", fontSize: "0.8rem" }}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
