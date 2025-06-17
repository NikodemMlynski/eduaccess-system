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
            const data = JSON.parse(event.data);
            if (data.event === "access_log_reviewed") {
                if (data.status === "granted")
                    toast.success("Potwierdzono wejście do sali")
                else toast.error("Odrzucone request wejścia do sali");
            }
        }

        return () => {
            ws.close();
        }
    }, [userId]);
    return null;
}