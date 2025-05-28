import {API_URL} from "@/config/constants.ts";
import {useQuery} from "@tanstack/react-query";
import {ISchool} from "@/types/School.ts";
import {fetcher} from "@/hooks/utils/fetcher.ts";


export function useSchool(
    endpoint: string,
    id?: number,
    token?: string
) {
    const url = `${API_URL}${endpoint}/${id}`;
    return useQuery<ISchool>({
        queryKey: ["school", id],
        queryFn: () => fetcher<ISchool>(url, token),
    })
}