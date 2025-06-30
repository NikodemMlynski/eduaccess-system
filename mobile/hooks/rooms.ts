import {useQuery} from "@tanstack/react-query";
import {IRoomAccessCode, IRoomRaw} from "@/types/Room";
import {fetcher} from "@/utils/fetcher";
import {apiUrl} from "@/constants/constants";

interface PaginatedRoomsResponse {
    total_count: number;
    has_next_page: boolean;
    rooms: IRoomRaw[];
}

export function useRooms(
    endpoint: string,
    token?: string
) {
    return useQuery<PaginatedRoomsResponse>({
        queryKey: ["rooms_raw"],
        queryFn: () => fetcher<PaginatedRoomsResponse>(
            `${apiUrl}${endpoint}/raw_rooms`,
            token
        )
    })
}

export function useRoomAccessCode(
    endpoint: string,
    token?: string,
    roomId?: number
) {
    return useQuery<IRoomAccessCode>({
        queryKey: ["room_access_code"],
        queryFn: () => fetcher<IRoomAccessCode>(
            `${apiUrl}${endpoint}/room/${roomId}`,
            token
        ),
        enabled: !!roomId,
    })
}