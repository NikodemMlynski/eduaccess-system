import {apiUrl} from "@/constants/constants";
import {useQuery} from "@tanstack/react-query";
import {ITeacher} from "@/types/Teacher";
import {fetcher} from "@/utils/fetcher";

export function useTeacher(
    endpoint: string,
    id?: number,
    token?: string
) {
    const url = `${apiUrl}${endpoint}/user_id/${id}`;
    console.log(url);
    return useQuery<ITeacher>({
        queryKey: ["school", "teacher_user_id", id],
        queryFn: () => fetcher<ITeacher>(url, token),
    })
}