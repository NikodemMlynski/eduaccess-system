// hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_URL } from "../config/constants"; // Upewnij się, że ścieżka jest poprawna
import { useAuth } from "@/context/AuthProvider"; // Załóż, że AuthProvider jest w tym folderze

interface Token {
  access_token: string;
  token_type: string;
}

interface LoginIn {
  email: string;
  password: string;
}

async function loginAdminRequest(credentials: LoginIn): Promise<Token> {
  const response = await fetch(`${API_URL}auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status == 401) {
        throw new Error(error.detail)
    }
    throw new Error(error.detail || "Something went wrong");
  }

  return await response.json();
}

export const useLogin = () => {
  const { login } = useAuth();

  return useMutation({
    mutationFn: loginAdminRequest,
    onSuccess: async (data) => {
      toast.success("Succesfully log in!");
      try {
        await login(data.access_token);
      } catch (error: any) {
        toast.error(error.message || "Something went wrong");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Something went wrong");
    },
  });
};