import { IRoom } from './../types/rooms';
import { IRoomIn } from "@/types/rooms";
import { IRoom } from "@/types/rooms";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaginatedParams } from "./users";
import { API_URL } from "@/config/constants";
import { deleteFetcher, fetcher, postFethcer, updateFetcher } from "./utils/fetcher";

export interface PaginatedRoomsResponse<T> {
    rooms: T[];
    total_count: number;
    has_next_page: boolean;
}

export const ROOM_KEYS = {
    all: ["rooms"] as const,
    one: (id: number) => [...ROOM_KEYS.all, id] as const,
    query: (query: string) => [...ROOM_KEYS.all, "query", query] as const,
};

export function useRooms<T>(
    endpoint: string,
    token?: string,
    options: PaginatedParams = {},
) {
    const { paginated = false, query = "", limit = 10, page = 1 } = options;

    const params = new URLSearchParams();
    if (paginated) {
        if (query) params.append("query", query);
        if (limit) params.append("limit", String(limit));
        if (page) params.append("page", String(page));
    }

    const url = `${API_URL}${endpoint}${paginated ? `?${params.toString()}` : ""}`;

    return useQuery<PaginatedRoomsResponse<T>>({
        queryKey: ["rooms", endpoint, paginated, limit, page, query],
        queryFn: () =>
            fetcher<PaginatedRoomsResponse<T>>(url, token),
        enabled: !!token && !!endpoint,
    });
}

export function useCreateRoom(school_id?: number, token?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: IRoomIn) =>
            postFethcer(`${API_URL}school/${school_id}/rooms`, data, token),
        onMutate: async (newRoom) => {
            await queryClient.cancelQueries(ROOM_KEYS.all);
            const previous = queryClient.getQueryData<PaginatedRoomsResponse<IRoom>>(ROOM_KEYS.all);

            if (previous) {
                queryClient.setQueryData<PaginatedRoomsResponse<IRoom>>(ROOM_KEYS.all, {
                    ...previous,
                    total_count: previous.total_count + 1,
                    rooms: [...previous.rooms, { id: Math.random(), ...newRoom } as IRoom],
                });
            }

            return { previous };
        },
        onError: (_err, _newRoom, context) => {
            if (context?.previous) {
                queryClient.setQueryData(ROOM_KEYS.all, context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries(ROOM_KEYS.all);
        },
    });
}

export function useUpdateRoom(endpoint: string, token?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: IRoomIn }) => {
            return updateFetcher<IRoom>(`${API_URL}${endpoint}/${id}`, data, token);
        },
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries(ROOM_KEYS.all);
            const previous = queryClient.getQueryData<PaginatedRoomsResponse<IRoom>>(ROOM_KEYS.all);

            if (previous) {
                queryClient.setQueryData<PaginatedRoomsResponse<IRoom>>(ROOM_KEYS.all, {
                    ...previous,
                    rooms: previous.rooms.map((room) =>
                        room.id === id ? { ...room, ...data } : room
                    ),
                });
            }

            return { previous };
        },
        onError: (_err, _updatedRoom, context) => {
            if (context?.previous) {
                queryClient.setQueryData(ROOM_KEYS.all, context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries(ROOM_KEYS.all);
        },
    });
}

export function useDeleteRoom(endpoint: string, token?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            return deleteFetcher(`${API_URL}${endpoint}/${id}`, token);
        },
        onMutate: async (id) => {
            await queryClient.cancelQueries(ROOM_KEYS.all);
            const previous = queryClient.getQueryData<PaginatedRoomsResponse<IRoom>>(ROOM_KEYS.all);

            if (previous) {
                queryClient.setQueryData<PaginatedRoomsResponse<IRoom>>(ROOM_KEYS.all, {
                    ...previous,
                    total_count: previous.total_count - 1,
                    rooms: previous.rooms.filter((room) => room.id !== id),
                });
            }

            return { previous };
        },
        onError: (_err, _id, context) => {
            if (context?.previous) {
                queryClient.setQueryData(ROOM_KEYS.all, context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries(ROOM_KEYS.all);
        },
    });
}
