import {useParams} from "react-router-dom";
import {useScheduleTemplates} from "@/hooks/scheduleTemplate.ts";
import ScheduleTemplate from "@/components/features/Schedules/ScheduleTemplate.tsx";
import {useAuth} from "@/context/AuthProvider.tsx";
import {Loader2} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {useRoom} from "@/hooks/rooms.ts";
import LessonTemplateFormModal from "@/components/features/Schedules/modals/LessonTemplateFormModal.tsx";
const ScheduleRoomPage = () => {
    const {user, token} = useAuth();
    const {roomId} = useParams();
    const {data, isLoading, isError, error} = useScheduleTemplates(
        `school/${user?.school_id}/lesson_templates`,
        "rooms",
        token || "",
        Number(roomId)
    )
    const {data: roomData, isLoading: roomsIsLoading, isError: roomsIsError, error: roomError} = useRoom(
        `school/${user?.school_id}`, Number(roomId), token || "");

    if (isLoading || roomsIsLoading) {
        return <Loader2 className="animate-spin w-10 h-10" />
    }
    if (isError) {
        console.log(error);
        return <p>{error.message}</p>
    }
    if (roomsIsError) {
        console.log();
        return <p>{roomError.message}</p>
    }
    return (
        <div className="overflow-auto px-4 py-2">
            <div>
                <LessonTemplateFormModal room={{
                    roomId: roomData?.id,
                    roomName: roomData?.room_name
                }}>
                    <Button variant="default">Add new lesson</Button>
                </LessonTemplateFormModal>
             <h1 className="text-4xl font-semibold text-center mb-10">{roomData?.room_name}</h1>
            </div>
             <ScheduleTemplate schedules={data || []} />
        </div>
    )
}

export default ScheduleRoomPage;


