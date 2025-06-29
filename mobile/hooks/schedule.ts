import {apiUrl} from "@/constants/constants";
import {ILessonInstance} from "@/types/schedule";
import {useQuery} from "@tanstack/react-query";
import {fetcher, postFethcer} from "@/utils/fetcher";

export function useLessonInstance(
    endpoint: string,
    type: "classes" | "rooms" | "teachers",
    token?: string,
    id?: number,
    dateStr?: string,

) {
    const url = `${apiUrl}${endpoint}/${type}/${id}/?date_str=${dateStr}`;
    return useQuery<ILessonInstance[]>({
        queryKey: ["lessonInstances", id, dateStr],
        queryFn: () => fetcher<ILessonInstance[]>(url, token),
        enabled: !!id
    })
}

export function useCurrentLessonInstance(
    endpoint: string,
    classId?: number,
    token?: string,
) {
    const date = new Date()
    const minutesRoundedToTen = Math.round(date.getMinutes() / 6);
    const dateKey = `${date.getDate()}-${date.getHours()}-${minutesRoundedToTen}`
    const url = `${apiUrl}${endpoint}/classes/${classId}/current`;
    return useQuery<ILessonInstance>({
        queryKey: ["lessonInstance", classId, dateKey],
        queryFn: () => postFethcer<ILessonInstance>(url, {
            // current_time: date.toISOString(),
            current_time: "2025-06-16T15:00:21.681559"
        }, token ),

    })
}