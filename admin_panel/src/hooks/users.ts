import { API_URL } from "@/config/constants";
import { Role } from "@/types/User";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const USERS_KEYS = {
    users: (role?: Role) => ["users", role ? role : null] as const,
    user: (id: number, role?: Role) => ["users", role ? role : null, id] as const,
}

type UpdateUserInput = {
    first_name: string;
    last_name: string;
    email: string;
}

async function fetcher<T>(
    url: string,
    token?: string,
    options?: RequestInit
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

export function useUsers<T>(endpoint: string, token?: string, role?: Role) {
    return useQuery<T[]>({
        queryKey: USERS_KEYS.users(role), // to będzie trzeba zmienić na user i role
        queryFn: () => fetcher<T[]>(`${API_URL}${endpoint}`, token),
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
