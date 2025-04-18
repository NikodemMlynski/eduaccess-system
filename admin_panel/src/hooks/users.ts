import { API_URL } from "@/config/constants";
import { Role } from "@/types/User";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const USERS_KEYS = {
    users: (role?: Role) => ["users", role ? role : null] as const,
    user: (id: number, role?: Role) => ["users", role ? role : null, id] as const,
}

interface PaginatedParams {
    query?: string;
    limit?: number;
    page?: number;
    paginated?: boolean;
}
interface PaginatedResponse<T> {
    items: T[];
    has_next_page: boolean;
}
type UpdateUserInput = {
    first_name: string;
    last_name: string;
    email: string;
}

async function fetcher<T>(
    url: string,
    token?: string,
    options?: RequestInit,
): Promise<T> {
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(token ? {Authorization: `Bearer ${token}`} : {})
        },
        ...options
    })

    if(!res.ok) {
        throw new Error(await res.text());
    }

    return res.json();
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
      queryKey: ["users", endpoint, role, {paginated, query, limit, page}],
      queryFn: () =>
        fetcher<PaginatedResponse<T> | T[]>(url, token).then((res) => {
          if (Array.isArray(res)) {
            return { items: res, has_next_page: false };
          }
          return res as PaginatedResponse<T>;
        }),
        enabled: !!token && !!endpoint,
    });
  }

  
export function useUser<T>(endpoint: string, id: number, token?: string, role?: Role) {
    return useQuery<T>({
        queryKey: USERS_KEYS.user(id, role), // tak samo,
        queryFn: () => fetcher<T>(`${API_URL}${endpoint}${id}`, token),
        enabled: !!id,
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
