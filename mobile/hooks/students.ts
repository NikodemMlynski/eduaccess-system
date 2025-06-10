import {apiUrl} from "@/constants/constants";
import {useQuery} from "@tanstack/react-query";
import {IStudent} from "@/types/Student";
import {fetcher} from "@/utils/fetcher";

export function useStudent(
    endpoint: string,
    id?: number,
    token?: string
) {
    const url = `${apiUrl}${endpoint}/user_id/${id}`;
    console.log(url);
    return useQuery<IStudent>({
        queryKey: ["school", "student_user_id", id],
        queryFn: () => fetcher<IStudent>(url, token),
    })
}