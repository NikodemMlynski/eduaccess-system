import {useQueryClient} from "@tanstack/react-query";
import {useEffect} from "react";
import {API_URL} from "@/config/constants.ts";

interface TeacherAccessLogListenerProps {
    teacherId: number | null;
}
export function TeacherAccessLogListener({
    teacherId,
}: TeacherAccessLogListenerProps){
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!teacherId) return;
        console.log(teacherId);
        const ws = new WebSocket(`${API_URL.replace(/^http/, 'ws')}ws/teacher/${teacherId}`)
        console.log("connected");
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.event === "access_log_update") {
                console.log("Otrzymano nowe logi, odświeżam...");
                queryClient.invalidateQueries(["access_logs", teacherId]);
            }

            return () => {
                ws.close();
            }
        }
    }, [teacherId, queryClient]);
    return null;
}