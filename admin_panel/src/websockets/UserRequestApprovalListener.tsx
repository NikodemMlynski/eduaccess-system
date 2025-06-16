import {useEffect} from "react";
import {API_URL} from "@/config/constants.ts";
import {toast} from "react-toastify";

interface UserRequestApprovalListenerProps {
    userId: number | null;
}

export function UserRequestApprovalListener({
    userId
}: UserRequestApprovalListenerProps) {
    useEffect(() => {
        console.log(userId);
        if(!userId) return;
        const ws = new WebSocket(`${API_URL.replace(/^http/, 'ws')}ws/users_requests_approvals/${userId}`)
        console.log("user connected");
        ws.onmessage = (event) => {
            console.log("coś sie stalo");
            const data = JSON.parse(event.data);
            if (data.event === "access_log_reviewed") {
                console.log("Otrzymano potwierdzenie access logu");
                toast.success("Potwierdzono wejście do sali: " + data.room_id)
            }
        }

        return () => {
            ws.close();
        }
    }, [userId]);
    return null;
}