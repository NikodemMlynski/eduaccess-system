import {useAuth} from "@/context/AuthProvider.tsx";
import {useDeniedAccessLogsForLesson} from "@/hooks/access_logs.ts";
import {useUsers} from "@/hooks/users.ts";
import {ITeacher} from "@/types/Teacher.ts";
import {SelectItem} from "@/components/ui/select.tsx";
import LessonTemplateSelect from "@/components/features/Schedules/selecters/LessonTemplateSelect.tsx";
import {useState} from "react";
import AccessLogsApproval from "@/components/features/AccessLogs/AccessLogsApproval.tsx";
import {Loader2} from "lucide-react";

export default function AccessLogsApprovalsPage() {
    const {user, token} = useAuth();
    const {
        data: teachers,
        isLoading: isTeachersLoading,
        isError: isTeachersError,
        error: teachersError,
    } = useUsers<ITeacher>(
        `school/${user?.school_id}/teachers`,
        token || "",
        "teacher",
        {
            paginated: true,
            limit: 100
        }
    )
    const [selectedTeacherId, setSelectedTeacher] = useState<number | null>(null);

    const {
        data: deniedAccessLogs,
        isLoading: isDeniedAccessLogsLoading,
        isError: isDeniedAccessLogsError,
        error: deniedAccessLogsError,
    } = useDeniedAccessLogsForLesson(
        `school/${user?.school_id}/access-logs`,
        selectedTeacherId, // selected teacher userId
        token || ""
    )
    let content = <></>
    if (isDeniedAccessLogsLoading) content = <Loader2 className="animate-spin w-10 h-10" />;
    if (isDeniedAccessLogsError) content = <p>{deniedAccessLogsError.message}</p>
    if (deniedAccessLogs && deniedAccessLogs.length > 0) content = <AccessLogsApproval deniedAccessLogs={deniedAccessLogs || []} userId={selectedTeacherId}/>;
    if (selectedTeacherId && deniedAccessLogs && deniedAccessLogs.length == 0) content = <h3>Currently there is no access logs for this teacher.</h3>
    return (
        <div>
            <LessonTemplateSelect
                isLoading={isTeachersLoading}
                isError={isTeachersError}
                errorMessage={"Błąd pobierania nauczycieli"}
                content={
                    <>
                        {teachers && teachers.users.map((teacher) => (
                                <SelectItem key={`${teacher.id}`}
                                            value={`${teacher.user.id}`}>{teacher.user.first_name} {teacher.user.last_name}</SelectItem>
                            )
                        )}
                    </>
                }
                onValueChange={(value) => {
                    setSelectedTeacher(+value)
                }}
                onButtonClick={() => {}}
                label={"Wybierz nauczyciela"}

            />
            {content}
        </div>
    )
}