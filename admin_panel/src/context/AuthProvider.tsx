// contexts/AuthProvider.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TOKEN_STORAGE_KEY, API_URL } from "../config/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IUser } from "@/types/User";
import { useAuthUser } from "@/hooks/useAuthUser";

interface AuthContextType {
  user: IUser | null;
  login: (token: string) => Promise<IUser>;
  logout: () => void;
  isLoading: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useAuthUser();

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  });

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem(TOKEN_STORAGE_KEY));
    };
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (token: string): Promise<IUser> => {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      setToken(token); // zaktualizuj token w stanie
      const response = await fetch(`${API_URL}users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setToken(null);
        const error = await response.json();
        throw new Error(error.message || "Błąd logowania");
      }
      const data = await response.json();
      console.log(data);
      if (data.role === "admin" || data.role == "teacher") return data
      throw new Error("Permission denied")
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
      navigate("/");
    },
    onError: () => {
      logout();
    },
  });

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    queryClient.setQueryData(["user"], null);
    navigate("/signin");
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        login: loginMutation.mutateAsync,
        logout,
        isLoading,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
