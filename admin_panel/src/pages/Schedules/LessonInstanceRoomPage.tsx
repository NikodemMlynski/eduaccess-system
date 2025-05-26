import {useParams} from "react-router-dom";
import LessonInstance from "@/components/features/Schedules/LessonInstances.tsx";
import {useLessonInstance} from "@/hooks/scheduleLesson.ts";
import {useAuth} from "@/context/AuthProvider.tsx";
import {Loader2} from "lucide-react";
import LessonInstanceFormModal from "@/components/features/Schedules/modals/LessonInstanceFormModal.tsx";
import {Button} from "@/components/ui/button.tsx";
import LessonInstanceDatePicker from "@/components/features/Schedules/LessonInstanceDatePicker.tsx";
import {useRoom} from "@/hooks/rooms.ts";

const LessonInstanceRoomPage = () => {
    const {user, token} = useAuth();
    const {roomId, dateStr} = useParams();
    const {data: roomData, isLoading: roomIsLoading, isError: roomIsError, error: roomError} = useRoom(
        `school/${user?.school_id}`, Number(roomId), token || ""
    )
    const {data, isLoading, isError, error} = useLessonInstance(
        `school/${user?.school_id}/lesson_instances`,
        "rooms",
        token || "",
        Number(roomId),
        dateStr
    )
    if (isLoading || roomIsLoading) {
        return <Loader2 className="animate-spin w-10 h-10" />
    }
    if (isError) {
        return <p>{error.message}</p>
    }
    if (roomIsError) {
        return <p>{roomError.message}</p>
    }

    return (
        <div className="flex justify-around">
            <LessonInstanceFormModal
                defaultDate={new Date(dateStr || "")}
                room={{
                    roomId: Number(roomId),
                    roomName: roomData?.room_name
                }}
            >
                <Button variant="default">Add new lesson</Button>
            </LessonInstanceFormModal>
            <div className="flex flex-col w-[400px]">
                <LessonInstanceDatePicker
                    dateStr={dateStr}
                    type={"rooms"}
                    id={Number(roomId)} />
                <LessonInstance lesson_instances={data || []} />
            </div>
        </div>
    )
}

export default LessonInstanceRoomPage;


