import { IStudent } from "@/types/Student";
import Students from "@/components/features/Students/Students";
import { useUsers } from "@/hooks/users";
import { useAuth } from "@/context/AuthProvider";
import { Loader2 } from "lucide-react";

export default function StudentsPage() {
  const { user, token } = useAuth();
  const { data: students, isLoading } = useUsers<IStudent>(`school/${user?.school_id}/students`, token || "", "student");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          <p className="text-gray-600">Ładowanie uczniów...</p>
        </div>
      </div>
    );
  }

  return <Students students={students || []} />;
}
