import { PaginatedResponse } from "@/hooks/users";

interface PaginationControlsProps<T> {
  page: number;
  setPage: (page: number) => void;
  data?: PaginatedResponse<T>;
}

export function PaginationControls<T>({
  page,
  setPage,
  data,
}: PaginationControlsProps<T>) {
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
