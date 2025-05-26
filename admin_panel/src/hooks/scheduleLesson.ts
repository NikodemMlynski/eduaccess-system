import {ILessonInstance, ILessonInstanceIn, ILessonTemplateIn} from "@/types/schedule.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {deleteFetcher, fetcher, postFethcer, updateFetcher} from "@/hooks/utils/fetcher.ts";
import {API_URL} from "@/config/constants.ts";
// TODO after creating schedule template operations

export function useLessonInstance(
    endpoint: string,
    type: "classes" | "rooms" | "teachers",
    token?: string,
    id?: number,
    dateStr?: string,

) {
    const url = `${API_URL}${endpoint}/${type}/${id}/?date_str=${dateStr}`;
    return useQuery<ILessonInstance[]>({
        queryKey: ["lessonInstances", id, dateStr],
        queryFn: () => fetcher<ILessonInstance[]>(url, token),

    })
}

export function useCreateLessonInstance(
    endpoint: string,
    token?: string,
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ILessonInstanceIn) =>
            postFethcer(`${API_URL}${endpoint}`, data, token),
        onSuccess: () => queryClient.invalidateQueries(
            ["lessonInstances"]
        )
    })
}

export function useDeleteLessonInstance(
    endpoint: string,
    token?: string,
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id?: number) =>
            deleteFetcher(`${API_URL}${endpoint}/${id}`, token),
        onSuccess: () => queryClient.invalidateQueries(
            ["lessonInstances"]
        )
    })
}
export function useUpdateLessonInstance(
    endpoint: string,
    token?: string,
    id?: number,
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ILessonInstanceIn) =>
            updateFetcher(`${API_URL}${endpoint}/${id}`, data, token),
        onSuccess: () => queryClient.invalidateQueries(
            ["lessonInstances"]
        )
    })
}

export function useGenerateLessonInstancesFromTemplates(
    endpoint: string,
    weeksAhead: number = 0,
    token?: string,
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () =>
            postFethcer(`${API_URL}${endpoint}/generate/weeks_ahead/${weeksAhead}`,{}, token),
        onSuccess: () => queryClient.invalidateQueries(
            ["lessonInstances"]
        )
    })
}