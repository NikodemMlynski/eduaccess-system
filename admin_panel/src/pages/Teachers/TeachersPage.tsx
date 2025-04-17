import { ITeacher } from "@/types/Teacher";
import Teachers from "@/components/features/Teachers/Teachers";
import { useUsers } from "@/hooks/users";
import { useAuth } from "@/context/AuthProvider";
import { Loader2 } from "lucide-react";

export default function TeachersPage() {
  const { user, token } = useAuth();
  const { data: teachers, isLoading } = useUsers<ITeacher>(`school/${user?.school_id}/teachers`, token || "", "teacher");

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

  return <Teachers teachers={teachers || []} />;
}
