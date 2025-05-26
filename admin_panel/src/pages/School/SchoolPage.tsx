import School from "@/components/features/School/School.tsx";
import {useAuth} from "@/context/AuthProvider.tsx";
import {useSchool} from "@/hooks/school.ts";
import {Loader2} from "lucide-react";

export default function SchoolPage() {
    const {user, token} = useAuth();

    const {data, isLoading, isError, error} = useSchool(`school`, user?.school_id, token || "");

    if(isLoading) {
        return <Loader2 className="animate-spin w-10 h-10" />
    }

    if (isError) {
        return <p>{error.message}</p>
    }

    return (
        <School school={data} />
    )
}