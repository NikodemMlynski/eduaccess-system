import { createContext, useContext, useEffect, useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { API_URL, TOKEN_STORAGE_KEY } from "../config/constants";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface IUser {
    school_id: number;
    id: number; 
    first_name: string;
    last_name: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
    created_at: Date;
    updated_at: Date;
}

interface AuthContextType {
    user: IUser | null;
    login: (token: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {data: user, isLoading} = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const token = localStorage.getItem(TOKEN_STORAGE_KEY);
            if(!token) return null;

            const response = await fetch(`${API_URL}users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(!response.ok) throw new Error("Błąd autoryzacji");
            return response.json();
        },
        staleTime: 1000 * 60 * 5,
        retry: false
    });

    const loginMutation = useMutation({
        mutationFn: async (token: string) => {
            localStorage.setItem(TOKEN_STORAGE_KEY, token);

            const response = await fetch(`${API_URL}users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(!response.ok) throw new Error("Błąd logowania");
            return response.json();
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["user"], data);
            navigate("/");
        },
        onError: () => {
            logout();
        }
    });

    const logout = () => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        queryClient.setQueryData(["user"], null);
        navigate("/signin");
    }
    return (
        <AuthContext.Provider value={{
            user: user || null,
            login: loginMutation.mutateAsync,
            logout,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        throw new Error("useAuth have to be used inside AuthProvider");
    }
    return context;
}
