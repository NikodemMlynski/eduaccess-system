import {useEffect} from "react";
import {apiUrl} from "@/constants/constants";
import {IAccessLog, IAccessLogRequestIn} from "@/types/AccessLogs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Toast} from "toastify-react-native";

interface UserRequestApprovalListenerProps {
    userId: number | null;
    setExistingDeniedAccessLog: (data: IAccessLog | null) => void;
    setExistingApprovedAccessLog: (data: IAccessLog | null) => void;
}

export function UserRequestApprovalListener({
    userId,
    setExistingDeniedAccessLog,
    setExistingApprovedAccessLog,
}: UserRequestApprovalListenerProps) {
    useEffect(() => {
        if (!userId) return;
        const ws = new WebSocket(
            `${apiUrl.replace(/^http/, 'ws')}ws/users_requests_approvals/${userId}`
        )
        ws.onmessage = async (event) => {
            const data = JSON.parse(event.data);
            if (data.event === "access_log_reviewed") {
                console.log("teacher sprawdził twój access_request")
                if(data.status === "granted") {
                    console.log("teacher zrobiłe granted")
                    const accessLogString = await AsyncStorage.getItem("denied")
                    if (accessLogString) {
                        console.log("wowolalo sie bo isnitje string")
                        const accessLog: IAccessLog = JSON.parse(accessLogString)
                        setExistingApprovedAccessLog({
                            ...accessLog,
                            access_status: "granted"
                        })
                        await AsyncStorage.setItem(`approved`, JSON.stringify({
                            ...accessLog,
                            access_status: "granted"
                        }))

                    }

                }

                setExistingDeniedAccessLog(null);
                await AsyncStorage.removeItem("denied")
                if (data.status === "denied") {
                    Toast.error("Your access log was denied")
                }

            }
        }
        return () => {
            ws.close()
        }
    }, [userId])
    return null;
}