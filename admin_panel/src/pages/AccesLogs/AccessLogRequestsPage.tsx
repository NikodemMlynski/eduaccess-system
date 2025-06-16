import {useAuth} from "@/context/AuthProvider.tsx";
import {useRooms} from "@/hooks/rooms.ts";
import {IRoom} from "@/types/rooms.ts";
import {useClasses} from "@/hooks/classes.ts";
import {useUsers} from "@/hooks/users.ts";
import {ITeacher} from "@/types/Teacher.ts";
import {IStudent} from "@/types/Student.ts";
import LessonTemplateSelect from "@/components/features/Schedules/selecters/LessonTemplateSelect.tsx";
import {SelectItem} from "@/components/ui/select.tsx";
import React, {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useSendAccessLogRequest} from "@/hooks/access_logs.ts";
import {toast} from "react-toastify";
import {Loader2} from "lucide-react";
import AccessLogsListItem from "@/components/features/AccessLogs/AccessLogsListItem.tsx";
import {IAccessLog} from "@/types/AccessLog.ts";

interface IRequestData {
    userId: number | null;
    roomId: number | null;
}
export default function AccessLogsRequestsPage(){
    const {user, token} = useAuth();
    const accessLogRequestMutation = useSendAccessLogRequest(
        `school/${user?.school_id}/access-logs`,
        token || ""
    )
    const {data: rooms, isLoading: isRoomsLoading, isError: isRoomsError} = useRooms<IRoom>(
        `school/${user?.school_id}/rooms`,
        token || "",
        {
            paginated: true,
            limit: 100,
        }
    )

    const {data: students, isLoading: isStudentsLoading, isError: isStudentsError} = useUsers<IStudent>(
        `school/${user?.school_id}/students`,
        token || "",
        "student",
        {
            paginated: true,
            limit: 100,
        }
    )
    const [requestData, setRequestData] = useState<IRequestData>({
        userId: null,
        roomId: null,
    })

    const handleRequestDataChange = (key: keyof IRequestData, value: number) => {
        setRequestData(prev => ({...prev, [key]: value}));
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!requestData.roomId || !requestData.userId) return;
        accessLogRequestMutation.mutate({
            user_id: requestData.userId,
            room_id: requestData.roomId,
            access_time: "2025-06-16T08:43:52.681559"
        },
            {
                onSuccess: () => {
                    toast.success("Request successful");
                },
                onError: (error) => {
                    toast.error(error.message || "Something went wrong");
                }
            })
    }
    return (
        <div>
        <Card className="w-full max-w-md shadow-md rounded-lg mx-auto my-10 flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">
                Admin Panel Authorization
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6">
              <form onSubmit={handleSubmit} className="flex flex-col gap-2">

                <LessonTemplateSelect
                    isLoading={isStudentsLoading}
                    isError={isStudentsError}
                    errorMessage={"Failed to load students"}
                    content={
                    <>
                        {students && students.users.map((student) => (
                                <SelectItem key={`${student.user.id}`}
                                            value={`${student.user.id}`}>{student.user.first_name} {student.user.last_name}</SelectItem>
                            )
                        )}
                    </>
                    }
                    onValueChange={(studentUserId) => handleRequestDataChange("userId", Number(studentUserId))}
                    onButtonClick={() => {}}
                    label={"Select user"}
                    isSearch={false}
                    />
                <LessonTemplateSelect
                    isLoading={isRoomsLoading}
                    isError={isRoomsError}
                    errorMessage={"Failed to load rooms"}
                    content={
                    <>
                        {rooms && rooms.rooms.map((room) => (
                                <SelectItem key={`${room.id}`} value={`${room.id}`}>{room.room_name}</SelectItem>
                            )
                        )}
                    </>
                    }
                    onValueChange={(roomId) => handleRequestDataChange("roomId", Number(roomId))}
                    onButtonClick={() => {}}
                    label={"Select room"}
                    isSearch={false}
                    />
                <Button className="mt-2 py-6 text-lg">Send request</Button>
                </form>
            </CardContent>
        </Card>
            <div>
            {/*    response content*/}
                {accessLogRequestMutation.isPending && <Loader2 className="w-10 h-10 animate-spin" />}
                {accessLogRequestMutation.data && (
                    <AccessLogsListItem accessLog={
                        accessLogRequestMutation.data as IAccessLog
                    } key={(accessLogRequestMutation.data as IAccessLog).id}/>
                )}
            </div>
    </div> // w przyszłości tu się wprowadzi realne dane
    )
}