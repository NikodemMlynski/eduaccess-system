import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {IAccessLog, IAccessLogApproval, IAccessLogIn, IAccessLogRequestIn} from "@/types/AccessLog.ts";
import {fetcher, postFethcer, updateFetcher} from "@/hooks/utils/fetcher.ts";
import {API_URL} from "@/config/constants.ts";

export interface PaginatedAccessLogsParams {
    room_id: string | null;
    page?: number;
    limit?: number;
    start_date: string | null;
    end_date: string | null;
    paginated?: boolean;
}

export interface PaginatedAccessLogsResonse<T> {
    access_logs: T[];
    total_count: number;
    has_next_page: boolean;
}

export function useDeniedAccessLogsForLesson(
    endpoint: string,
    userId: number | null,
    teacherId: number | null,
    token?: string,
) {
    console.log(userId);
    const currentTime = "2025-06-16T09:20:52.681559";
    const url = `${API_URL}${endpoint}/request/teacher_id/${userId}/current_time/${currentTime}`;
    return useQuery<IAccessLog[]>({
        queryKey: ["access_logs", teacherId],
        queryFn: async () => fetcher<IAccessLog[]>(
            url, token
        ),
        enabled: !!userId,
    })
}

export function useAccessLogApproval(
    endpoint: string,
    accessLogId: number,
    teacherId: number | null,
    token?: string,
) {
    const url = `${API_URL}${endpoint}/handle_approval/${accessLogId}`;
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: IAccessLogApproval) =>
            updateFetcher(url, data, token),
        onSuccess: () => queryClient.invalidateQueries(["access_logs", teacherId])
    })
}

export function useAccessLogs<T>(
    endpoint: string,
    token?: string,
    options: PaginatedAccessLogsParams = {}
) {
    const {paginated = false, page = 1, limit = 10, room_id = "", start_date = "", end_date = ""} = options;

    const params = new URLSearchParams();
    if (paginated) {
        if (room_id) params.append("room_id", room_id);
        if (start_date) params.append("start_date", start_date);
        if (end_date) params.append("end_date", end_date);
        if (limit) params.append("limit", String(limit));
        if (page) params.append("page", String(page));
    }
    const dateEnabler = !start_date && !end_date || !!start_date && !!end_date;

    const url = `${API_URL}${endpoint}${paginated ? `?${params.toString()}` : ""}`;

    return useQuery<PaginatedAccessLogsResonse<T>>({
        queryKey: ["access_logs", room_id, start_date, end_date, limit, page],
        queryFn: () =>
            fetcher<PaginatedAccessLogsResonse<T>  | T[]>(url, token).then((res) => {
                return res as PaginatedAccessLogsResonse<T>;
            }),
        enabled: !!token && !!endpoint && dateEnabler,
    })
}

export function useSendAccessLogRequest(
    endpoint: string,
    token?: string,
) {
    const url = `${API_URL}${endpoint}/request`;
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: IAccessLogRequestIn) =>
            postFethcer<IAccessLog>(url, data, token),
        onSuccess: () => queryClient.invalidateQueries(["access_logs"])
    })
}