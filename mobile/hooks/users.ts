import {useMutation} from "@tanstack/react-query";
import {IUserIn} from "@/types/User";
import {postFethcer} from "@/utils/fetcher";
import {apiUrl} from "@/constants/constants";

export function useCreateUser() {
    console.log(`${apiUrl}users`);
    return useMutation({
        mutationFn: async (data: IUserIn) =>
            postFethcer(`${apiUrl}users`, data),
    })
}