import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {IAccessLog, IAccessLogApproval} from "@/types/AccessLog.ts";
import {fetcher, updateFetcher} from "@/hooks/utils/fetcher.ts";
import {API_URL} from "@/config/constants.ts";

export function useDeniedAccessLogsForLesson(
    endpoint: string,
    userId: number | null,
    token?: string,
) {
    const currentTime = "2025-06-16T08:43:52.681559";
    const url = `${API_URL}${endpoint}/request/teacher_id/${userId}/current_time/${currentTime}`;
    return useQuery<IAccessLog[]>({
        queryKey: ["access_logs", currentTime, userId],
        queryFn: async () => fetcher<IAccessLog[]>(
            url, token
        ),
        enabled: !!userId
    })
}

export function useAccessLogApproval(
    endpoint: string,
    accessLogId: number,
    token?: string,
) {
    const url = `${API_URL}${endpoint}/handle_approval/${accessLogId}`;
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: IAccessLogApproval) =>
            updateFetcher(url, data, token),
        onSuccess: () => queryClient.invalidateQueries(["access-logs", accessLogId])
    })
}