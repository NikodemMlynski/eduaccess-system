// hooks/useAuthUser.ts
import { useQuery } from "@tanstack/react-query";
import { API_URL, TOKEN_STORAGE_KEY } from "../config/constants";
import { IUser } from "@/types/User";

async function fetchUser(token: string | null): Promise<IUser | null> {
  if (!token) return null;

  const response = await fetch(`${API_URL}users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    localStorage.removeItem(TOKEN_STORAGE_KEY); // Wyczyść token w przypadku błędu
    throw new Error("Błąd autoryzacji");
  }
  return await response.json();
}

export const useAuthUser = () => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return useQuery({
    queryKey: ["user"],
    queryFn: () => fetchUser(token),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
};