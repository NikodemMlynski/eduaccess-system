interface PaginationControlsProps<T, P extends { has_next_page?: boolean }> {
  page: number;
  setPage: (page: number) => void;
  data?: P;
}

export function PaginationControls<T, P extends { has_next_page?: boolean }>({
  page,
  setPage,
  data,
}: PaginationControlsProps<T, P>) {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button
        disabled={page === 1}
        onClick={() => setPage(Math.max(page - 1, 1))}
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Poprzednia
      </button>
      <span>Strona {page}</span>
      <button
        disabled={!data?.has_next_page}
        onClick={() => setPage(page + 1)}
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Następna
      </button>
    </div>
  );
}