import { API_URL } from "@/config/constants";
import { Role } from "@/types/User";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "./utils/fetcher";
import {IStudent} from "@/types/Student.ts";

export const USERS_KEYS = {
    users: (role?: Role) => ["users", role ? role : null] as const,
    user: (id?: number, role?: Role) => ["users", role ? role : null, id] as const,
}

export interface PaginatedParams {
    query?: string;
    limit?: number;
    page?: number;
    paginated?: boolean;
}
export interface PaginatedResponse<T> {
    users: T[];
    total_count: number;
    has_next_page: boolean;
}
export type UpdateUserInput = {
    first_name: string;
    last_name: string;
    email: string;
}

export function useUsers<T>(
    endpoint: string,
    token?: string,
    role?: Role,
    options: PaginatedParams = {}
  ) {
    const { paginated = false, query = "", limit = 10, page = 1 } = options;
  
    const params = new URLSearchParams();
    if (paginated) {
      if (query) params.append("query", query);
      if (limit) params.append("limit", String(limit));
      if (page) params.append("page", String(page));
    }
  
    const url = `${API_URL}${endpoint}${paginated ? `?${params.toString()}` : ""}`;
  
    return useQuery<PaginatedResponse<T>>({
      queryKey: ["users", endpoint, role, paginated, limit, page, query],
      queryFn: () =>
        fetcher<PaginatedResponse<T> | T[]>(url, token).then((res) => {
          return res as PaginatedResponse<T>;
        }),
        enabled: !!token && !!endpoint,
    });
  }

  
export function useUser<T>(endpoint: string, id?: number, token?: string, role?: Role) {
    return useQuery<T>({
        queryKey: USERS_KEYS.user(id, role), // tak samo,
        queryFn: () => fetcher<T>(`${API_URL}${endpoint}${id}`, token),
        enabled: !!id,
    })
}

export function useStudentsForClass(
    endpoint: string,
    token?: string,
    classId?: number
) {
    return useQuery<IStudent[]>({
        queryKey: ["students", "class", classId],
        queryFn: () => fetcher<IStudent[]>(`${API_URL}${endpoint}/class_id/${classId}`, token)
    })
}

export function useUpdateUser<T>(endpoint: string, token?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: UpdateUserInput }) => {
            return fetcher<T>(`${API_URL}${endpoint}/${id}`, token, {
                method: 'PUT',
                body: JSON.stringify(data),
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [endpoint]})
        } 
    })
}

export function useDeleteUser(endpoint: string, token?: string) {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (id: number) => {
        return fetcher(`${API_URL}${endpoint}/${id}`, token, {
          method: 'DELETE',
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [endpoint] });
      },
    });
  }
