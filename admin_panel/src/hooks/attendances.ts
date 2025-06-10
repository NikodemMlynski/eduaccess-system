import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {deleteFetcher, fetcher, postFethcer, updateFetcher} from "@/hooks/utils/fetcher.ts";
import {API_URL} from "@/config/constants.ts";
import {IAttendanceIn, IAttendanceStats} from "@/types/Attendance.ts";

export function useAttendances<T>(
    endpoint: string,
    type: "student" | "classes",
    token?: string,
    id?: number,
    dateStr?: string,
) {
    const url = `${API_URL}${endpoint}/${type}/${id}/day/${dateStr}`;
    return useQuery<T[]>({
        queryKey: ["attendances", type, token, id, dateStr],
        queryFn: () => fetcher<T[]>(url, token)
    })
}

export function useAttendancesStats(
    endpoint: string,
    token?: string,
    id?: number,
) {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    let date_from, date_to;
    if (month > 8) {
        date_from = `${year}-09-01`;
        date_to = `${year+1}-06-30`;
    } else {
        date_from = `${year-1}-09-01`;
        date_to = `${year}-06-30`;
    }
    const url = `${API_URL}${endpoint}/student/${id}/stats?date_from=${date_from}&date_to=${date_to}`;

    return useQuery({
        queryFn: () => fetcher<IAttendanceStats>(url, token),
        queryKey: ["attendances", id, date_from, date_to],
    })
}

export function useCreateAttendances(
    endpoint: string,
    token?: string,
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: IAttendanceIn) =>
            postFethcer(`${API_URL}${endpoint}/`, data, token),
        onSuccess: () => queryClient.invalidateQueries(["attendances"])
    })
}

export function useUpdateAttendance(
    endpoint: string,
    token?: string,
    id?: number
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: IAttendanceIn) =>
            updateFetcher(`${API_URL}${endpoint}/${id}`, data, token),
        onSuccess: () => queryClient.invalidateQueries(["attendances", id])
    })
}