import Student from "@/components/features/Students/Student";
import { useAuth } from "@/context/AuthProvider";
import {useClass} from "@/hooks/classes";
import { useUser } from "@/hooks/users";
import { IStudent } from "@/types/Student";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom"

const StudentPage = () => {
    const {id} = useParams();
    const {user, token} = useAuth();
    const {data, isLoading, isError, error} = useUser<IStudent>(
        `school/${user?.school_id}/students/`,
        Number(id || 0),
        token || "",
        "student",
    )
    const {
        data: classData,
        isLoading: classIsLoading,
        isError: classIsError
    } = useClass(`school/${user?.school_id}/classes`,
        data ? data?.class_id : undefined,
        token || "");

    console.log(data);
    console.log(classData);

    if (isLoading || classIsLoading) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin"/>
                    <p className="text-gray-600">Loading student...</p>
                </div>
            </div>
        )
    }

    if(isError || classIsError) {
        return (
            <div className="text-center text-red-500 mt-10">
                An error occured while fetching student
            </div>
        )
    }

    if (!isLoading && !classIsLoading &&
        data && (!data.class_id || classData
        )
    ) {
        return (
            <Student
            student={data}
            studentClass={data.class_id ? classData : null}
            />
        )
    } else {
        return (
            <div className="text-center text-red-500 mt-10">
                An error occured while fetching student here
            </div>
        )
    }
}

export default StudentPage