import {ILessonTemplate, ILessonTemplateIn} from "@/types/schedule.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {deleteFetcher, fetcher, postFethcer, updateFetcher} from "@/hooks/utils/fetcher.ts";
import {API_URL} from "@/config/constants.ts";

export const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function useScheduleTemplates(
    endpoint: string,
    type: "classes" | "teachers" | "rooms",
    token?: string,
    id?: number
) {
    const url = `${API_URL}${endpoint}/${type}/${id}`
    return useQuery<ILessonTemplate[]>({
        queryKey: ["scheduleTemplates", endpoint, token, type, id],
        queryFn: () => fetcher<ILessonTemplate[]>(url, token)
    })
}

export function useCreateScheduleTemplate(
    endpoint: string,
    type: "classes" | "teachers" | "rooms",
    token?: string,
    id?: number,
    ) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ILessonTemplateIn) =>
            postFethcer(`${API_URL}${endpoint}`, data, token),
        onSuccess: () => queryClient.invalidateQueries(
            ["scheduleTemplates", endpoint, token, type, id]
        )
    })
}

export function useDeleteScheduleTemplate(
    endpoint: string,
    type: "classes" | "teachers" | "rooms",
    token?: string,
    id?: number,
    ) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) =>
            deleteFetcher(`${API_URL}${endpoint}/${id}`, token),
        onSuccess: () => queryClient.invalidateQueries(
            ["scheduleTemplates", endpoint, token, type, id]
        )
    })
}

export function useUpdateScheduleTemplate(
    endpoint: string,
    type: "classes" | "teachers" | "rooms",
    token?: string,
    id?: number,
    ) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ILessonTemplateIn)=>
            updateFetcher(`${API_URL}${endpoint}/${id}`, data, token),
        onSuccess: () => queryClient.invalidateQueries(
            ["scheduleTemplates", endpoint, token, type, id]
        )
    })
}