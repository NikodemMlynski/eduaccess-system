import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {apiUrl} from "@/constants/constants";
import {IAccessLog, IAccessLogApproval, IAccessLogRequestIn} from "@/types/AccessLogs";
import {deleteFetcher, postFethcer, updateFetcher, fetcher} from "@/utils/fetcher";
import {ILessonInstance} from "@/types/schedule";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useSendAccessLogRequest(
    endpoint: string,
    token?: string,
) {
    const date = new Date()
    const url = `${apiUrl}${endpoint}/request`;
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: IAccessLogRequestIn) =>
            postFethcer<IAccessLog>(url, {
                ...data,
                // current_time: date.toISOString(),
                // access_time: "2025-06-16T15:00:21.681559"
                access_time: "2025-06-16T09:14:21.681559"
            }, token),
        onSuccess: async (data) => {
            if (data.access_status === "granted") {
                if (data.access_end_time) {
                    await AsyncStorage.removeItem(`${data.room.id}`)
                } else {
                    await AsyncStorage.setItem(`${data.room.id}`, JSON.stringify(data))
                }
            }
            if (data.access_status === "denied") {
                if(data.access_end_time) {
                    await AsyncStorage.removeItem(`denied`)
                } else {
                    await AsyncStorage.setItem(`denied`, JSON.stringify(data))
                }
            }
            queryClient.invalidateQueries(["access-logs"])
        }
    })
}

export function useDeleteAccessLogRequest(
    endpoint: string,
    token?: string,
    accessRequestId?: number
) {
    const queryClient = useQueryClient();
    const url = `${apiUrl}${endpoint}/${accessRequestId}`;
    return useMutation({
        mutationFn: (data: null) => deleteFetcher(url, token),
        onSuccess: async (data) => {
            queryClient.invalidateQueries()
            await AsyncStorage.removeItem("denied")
        }
    })
}

export function useDeniedAccessLogsForLesson(
    endpoint: string,
    userId: number | null,
    teacherId: number | null,
    token?: string,
) {
    const currentTime = "2025-06-16T09:20:52.681559";
    const url = `${apiUrl}${endpoint}/request/teacher_id/${userId}/current_time/${currentTime}`
    return useQuery<IAccessLog[]>({
        queryKey: ["access_logs", teacherId],
        queryFn: async () => fetcher<IAccessLog[]>(url, token),
    })
}

export function useAccessLogApproval(
    endpoint: string,
    accessLogId: number,
    teacherId: number | null,
    token?: string,
) {
    const url = `${apiUrl}${endpoint}/handle_approval/${accessLogId}`;
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: IAccessLogApproval)=>
            updateFetcher(url, data, token),
        onSuccess: async () => queryClient.invalidateQueries(["access_logs", teacherId])
    })
}