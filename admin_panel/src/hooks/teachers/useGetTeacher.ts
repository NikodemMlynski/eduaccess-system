import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export function useUsers<T>(endpoint: string, token?: string) {
    return useQuery<T[]>({
        queryKey: [endpoint], // to będzie trzeba zmienić na user i role
        queryFn: () => fetcher<T[]>(`/api${endpoint}`, token),
    });
}

export function useUser<T>(endpoint: string, id: number, token?: string) {
    return useQuery<T>({
        queryKey: [endpoint, id], // tak samo,
        queryFn: () => fetcher<T>(`/api/${endpoint}${id}`, token),
        enabled: !!id,
    })
}

export function useUpdateUser<T>(endpoint: string, token?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: UpdateUserInput }) => {
            return fetcher<T>(`/api/${endpoint}/${id}`, token, {
                method: 'PUT',
                body: JSON.stringify(data),
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [endpoint]})
        } // potem sie zrobi optimistic update
    })
}

export function useDeleteUser(endpoint: string, token?: string) {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (id: number) => {
        return fetcher(`/api/${endpoint}/${id}`, token, {
          method: 'DELETE',
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [endpoint] });
      },
    });
  }