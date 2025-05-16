import { ILessonTemplate } from "@/types/schedule.ts";
import {IClass} from "@/types/Class.ts";
import {IRoom} from "@/types/rooms.ts";
import {ITeacher} from "@/types/Teacher.ts";
import {useQuery} from "@tanstack/react-query";
import {fetcher} from "@/hooks/utils/fetcher.ts";
import {API_URL} from "@/config/constants.ts";

export const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function useScheduleTemplates(endpoint: string, type: "classes" | "teachers" | "rooms", token?: string, id?: number) {
    const url = `${API_URL}${endpoint}/${type}/${id}`
    return useQuery<ILessonTemplate[]>({
        queryKey: ["scheduleTemplates", endpoint, token, id],
        queryFn: () => fetcher<ILessonTemplate[]>(url, token)
    })
}