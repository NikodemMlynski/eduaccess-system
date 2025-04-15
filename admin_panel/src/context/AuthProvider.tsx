// contexts/AuthProvider.tsx
import { createContext, useContext } from "react";
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user, isLoading } = useAuthUser();

  const loginMutation = useMutation({
    mutationFn: async (token: string): Promise<IUser> => {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      const response = await fetch(`${API_URL}users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        localStorage.removeItem(TOKEN_STORAGE_KEY); // Opcjonalnie, ale warto wyczyścić w przypadku błędu
        const error = await response.json();
        throw new Error(error.message || "Błąd logowania");
      }
      return await response.json();
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth have to be used inside AuthProvider");
  }
  return context;
};