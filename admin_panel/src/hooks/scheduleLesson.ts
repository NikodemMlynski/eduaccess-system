import {ILessonInstance} from "@/types/schedule.ts";
import {useQuery} from "@tanstack/react-query";
import {fetcher} from "@/hooks/utils/fetcher.ts";
import {API_URL} from "@/config/constants.ts";
// TODO after creating schedule template operations

export function useLessonInstance(
    endpoint: string,
    type: "classes" | "rooms" | "teachers",
    token?: string,
    roomId?: number,
    dateStr?: string,

) {
    const url = `${API_URL}${endpoint}/${type}/${roomId}/?date_str=${dateStr}`;
    return useQuery<ILessonInstance[]>({
        queryKey: [endpoint, roomId, dateStr],
        queryFn: () => fetcher<ILessonInstance[]>(url, token),

    })
}