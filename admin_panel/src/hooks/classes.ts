import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { IClass } from "@/types/Class"
import { deleteFetcher, fetcher, postFethcer, updateFetcher } from "./utils/fetcher"
import { API_URL } from "@/config/constants"
export const CLASSES_KEYS = {
    all: ["classes"] as const,
    one: (id: number) => [...CLASSES_KEYS.all, id] as const,
    year: (year: number) => [...CLASSES_KEYS.all, "year", year] as const,
}

export function useClasses(endpoint: string, token?: string, options = {}) {
    return useQuery<IClass[]>({
        queryKey: CLASSES_KEYS.all,
        queryFn: () => fetcher<IClass[]>(`${API_URL}${endpoint}`, token),
        ...options,
    })
}

export function useClass(endpoint: string, id: number, token?: string) {
    return useQuery<IClass>({
        queryKey: CLASSES_KEYS.one(id),
        queryFn: () => fetcher(`${API_URL}${endpoint}/${id}`, token),
    })
}

export function useClassesByYear(
    endpoint: string,
    year: number,
    token?: string,
    options = {}
) {
    return useQuery<IClass[]>({
        queryKey: CLASSES_KEYS.year(year),
        queryFn: () => fetcher<IClass[]>(`${API_URL}${endpoint}/class_year/${year}`, token),
        ...options
    })
}

export function useCreateClass(school_id?: number, token?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<IClass>) => 
            postFethcer(`${API_URL}school/${school_id}/classes`, data, token),
        onSuccess: () => queryClient.invalidateQueries(CLASSES_KEYS.all),
    })
}

export function useDeleteClass(school_id?: number, token?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) =>
            deleteFetcher(`${API_URL}school/${school_id}/classes/${id}`, token),
        onMutate: async (id) => {
            await queryClient.cancelQueries(CLASSES_KEYS.all);
            const previous = queryClient.getQueryData<IClass[]>(CLASSES_KEYS.all);
            queryClient.setQueryData<IClass[]>(
                CLASSES_KEYS.all,
                (old) => old?.filter((cls) => cls.id !== id) || []
            );
            return {previous};
        },
        onError: (_err, _id, context) => {
            if(context?.previous) {
                queryClient.setQueryData(CLASSES_KEYS.all, context.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries(CLASSES_KEYS.all);
        }
    })
}

export function useUpdateClass(school_id?: number, token?: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { id: number; updates: Partial<IClass> }) =>
            updateFetcher<IClass>(
                `${API_URL}school/${school_id}/classes/${data.id}`,
                data.updates,
                token
            ),
        onSuccess: () => {
            queryClient.invalidateQueries(CLASSES_KEYS.all);
        },
        onError: (error) => {
            console.error("Update class error:", error);
        },
    });
}


interface ClassStudentProps {
    studentId: number;
    classId: number;
}

export function useAssignStudentToClass(school_id: number, token?: string) {
    return useMutation({
        mutationFn: ({
            studentId,
            classId
        }: ClassStudentProps) => 
            updateFetcher(`${API_URL}school/${school_id}/students/${studentId}/classes/${classId}`, {}, token)
    })
}


export function useRemoveStudentsFromClass(school_id: number, token?: string) {
    return useMutation({
        mutationFn: ({
            studentId,
            classId
        }: ClassStudentProps) => 
            deleteFetcher(`${API_URL}school/${school_id}/students/${studentId}/classes/${classId}`, token)
    })
}


