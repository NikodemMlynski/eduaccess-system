import { useQuery } from "@tanstack/react-query"
import { IClass } from "@/types/Class"
import {fetcher } from "@/utils/fetcher"
import { apiUrl } from "@/constants/constants"

export function useClass(endpoint: string, id?: number | null, token?: string) {
    return useQuery<IClass>({
        queryKey: ["classes", id],
        queryFn: () => fetcher(`${apiUrl}${endpoint}/${id}`, token),
        enabled: !!id
    })
}