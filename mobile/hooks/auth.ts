import {ILoginData, ITokenOut} from "@/types/auth";
import {useMutation} from "@tanstack/react-query";
import {postFethcer} from "@/utils/fetcher";
import {apiUrl} from "@/constants/constants";

export function useLogin() {
    return useMutation({
        mutationFn: async (data: ILoginData) =>
            postFethcer<ITokenOut>(`${apiUrl}auth/login`, data),
    })
}