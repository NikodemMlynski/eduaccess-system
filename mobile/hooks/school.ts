import {apiUrl} from "@/constants/constants";
import {useQuery} from "@tanstack/react-query";
import {ISchool} from "@/types/School";
import {fetcher} from "@/utils/fetcher";


export function useSchool(
    endpoint: string,
    id?: number,
    token?: string
) {
    const url = `${apiUrl}${endpoint}/${id}`;
    return useQuery<ISchool>({
        queryKey: ["school", id],
        queryFn: () => fetcher<ISchool>(url, token),
    })
}