import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {fetcher, postFethcer, updateFetcher} from "@/utils/fetcher";
import {IAttendanceIn, IAttendanceStats} from "@/types/Attendance";
import {apiUrl} from "@/constants/constants";

export function useAttendances<T>(
    endpoint: string,
    type: "student" | "classes",
    token?: string,
    id?: number,
    dateStr?: string,
) {
    const url = `${apiUrl}${endpoint}/${type}/${id}/day/${dateStr}`;
    console.log(url);
    return useQuery<T[]>({
        queryKey: ["attendances", type, token, id, dateStr],
        queryFn: () => fetcher<T[]>(url, token),
    })
}

export function useTeacherAttendances<T>(
    endpoint: string,
    token?: string,
    teacher_id?: number,
    dateStr?: string,
) {
    console.log("pobranie teacher:");
    console.log(["attendances", teacher_id, dateStr]);
    const url = `${apiUrl}${endpoint}/teacher/${teacher_id}?date_str=${dateStr}`;
    console.log(url);
    return useQuery<T[]>({
        queryKey: ["attendances", teacher_id, dateStr],
        queryFn: () => fetcher<T[]>(url, token),
    })
}

export function useAttendanceStats(
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

    const url = `${apiUrl}${endpoint}/student/${id}/stats?date_from=${date_from}&date_to=${date_to}`

    return useQuery({
        queryFn: () => fetcher<IAttendanceStats>(url, token),
        queryKey: ["attendances", id, date_from, date_to]
    })
}

export function useUpdateAttendance(
    endpoint: string,
    token?: string,
    id?: number,
    teacher_id?: number,
    dateStr?: string,
) {
    console.log(id);
    console.log(["attendances", teacher_id, dateStr])
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: IAttendanceIn) =>
            updateFetcher(`${apiUrl}${endpoint}/${id}`, data, token),
        onSuccess: () => queryClient.invalidateQueries(["attendances", teacher_id, dateStr])
    })
}