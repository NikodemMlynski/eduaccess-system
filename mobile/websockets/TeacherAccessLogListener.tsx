import {useQueryClient} from "@tanstack/react-query";
import {useEffect} from "react";
import {apiUrl} from "@/constants/constants"
interface TeacherAccessLogListenerProps {
    teacherId: string | null;
}

export function TeacherAccessLogListener({
    teacherId,
 }: TeacherAccessLogListenerProps) {
    const queryClient = useQueryClient();
    useEffect(() => {
        const ws = new WebSocket(`${apiUrl.replace(/^http/, 'ws')}ws/teacher/${teacherId}`)
        console.log("connected");
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.event === "access_log_update") {
                console.log("Otrzymano nowe logi, odświeżam...");
                queryClient.invalidateQueries(["access_logs", teacherId])
            }
        }

        return () => {
            ws.close();
        }
    }, [teacherId, queryClient]);
    return null;
}