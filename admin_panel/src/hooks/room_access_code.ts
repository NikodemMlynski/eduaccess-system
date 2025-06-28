import {API_URL} from "@/config/constants.ts";
import {useQuery} from "@tanstack/react-query";
import {fetcher} from "@/hooks/utils/fetcher.ts";
import {IRoomAccessCode} from "@/types/room_access_code.ts";

export function useRoomAccessCodes(endpoint: string, token?: string) {
    const url = `${API_URL}${endpoint}`;
    return useQuery<IRoomAccessCode[]>({
        queryKey: ["room_access_codes", endpoint, token],
        queryFn: () => fetcher<IRoomAccessCode[]>(url, token),

    })
}