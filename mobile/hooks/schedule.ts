import {apiUrl} from "@/constants/constants";
import {ILessonInstance} from "@/types/schedule";
import {useQuery} from "@tanstack/react-query";
import {fetcher} from "@/utils/fetcher";

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
