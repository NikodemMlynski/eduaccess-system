import {useQuery} from "@tanstack/react-query";
import {fetcher} from "@/hooks/utils/fetcher.ts";
import {API_URL} from "@/config/constants.ts";

export function useAttendances<T>(
    endpoint: string,
    type: "students" | "classes",
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