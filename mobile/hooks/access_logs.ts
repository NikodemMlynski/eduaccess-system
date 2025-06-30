import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {apiUrl} from "@/constants/constants";
import {IAccessLog, IAccessLogRequestIn} from "@/types/AccessLogs";
import {deleteFetcher, postFethcer} from "@/utils/fetcher";
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