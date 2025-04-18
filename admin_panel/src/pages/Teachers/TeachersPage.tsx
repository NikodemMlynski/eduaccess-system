"use client";

import { ITeacher } from "@/types/Teacher";
import Teachers from "@/components/features/Teachers/Teachers";
import { useUsers } from "@/hooks/users";
import { useAuth } from "@/context/AuthProvider";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export default function TeachersPage() {
  const { user, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 1000);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useUsers<ITeacher>(
    `school/${user?.school_id}/teachers`,
    token || "",
    "teacher",
    {
      query: debouncedSearchQuery,
      limit,
      page,
      paginated: true
    }
  );
  console.log("QUERY:", debouncedSearchQuery);
  console.log("DATA: ", data);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-gray-600">Ładowanie nauczycieli...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="text-center text-red-500 mt-10">Wystąpił błąd podczas pobierania nauczycieli.</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4">
        <Input
          placeholder="Szukaj nauczyciela..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1); // resetuj do pierwszej strony
          }}
          className="md:w-[300px]"
        />
        <div className="flex items-center gap-2">
          <span>Na stronę:</span>
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>
      <div key={debouncedSearchQuery}>
        <Teachers teachers={data?.items || []} />
      </div>

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Poprzednia
        </button>
        <span>Strona {page}</span>
        <button
          disabled={!data?.has_next_page}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Następna
        </button>
      </div>
    </div>
  );
}
