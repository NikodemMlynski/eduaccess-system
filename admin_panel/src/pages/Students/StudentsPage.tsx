import { IStudent } from "@/types/Student";
import Students from "@/components/features/Students/Students";
import { useUsers } from "@/hooks/users";
import { useAuth } from "@/context/AuthProvider";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { PaginationControls } from "@/components/utils/PaginationControls";
import { SearchAndLimitBar } from "@/components/utils/SearchAndLimitBar";

export default function StudentsPage() {
  const {user, token} = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 1000);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError} = useUsers<IStudent>(
    `school/${user?.school_id}/students`,
    token || "",
    "student",
    {
      query: debouncedSearchQuery,
      limit,
      page,
      paginated: true,
    }
  )

  if(isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-gray-600">Loading students...</p>
        </div>
      </div>
    )
  }

  if(isError) {
    return <div className="text-center text-red-500 mt-10">
      An error occured while fetching students
    </div>
  }

  console.log("QUERY: ", debouncedSearchQuery);
  console.log("DATA: ", data);

  return (
    <div className="p-6">
      <SearchAndLimitBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        limit={limit}
        setLimit={setLimit}
        setPage={setPage}
      />
      
      <div key={`${debouncedSearchQuery}-${page}`}>
        <Students students={data?.users || []} total_count={data?.total_count}/>
      </div>

      <PaginationControls<IStudent> 
      page={page} 
      setPage={setPage}
      data={data}
      />
      
    </div>
  )
}
