import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "@/types/User";
import { apiUrl, tokenStorageKey } from "@/constants/constants";
import { useRouter } from "expo-router";

interface AuthContextType {
  user: IUser | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = await AsyncStorage.getItem(tokenStorageKey);
      if (storedToken) {
        try {
          const res = await fetch(`${apiUrl}users`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
          if (!res.ok) throw new Error("Unauthorized");
          const data: IUser = await res.json();
          setUser(data);
          setToken(storedToken);
        } catch {
          await AsyncStorage.removeItem(tokenStorageKey);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (newToken: string) => {
    await AsyncStorage.setItem(tokenStorageKey, newToken);
    const res = await fetch(`${apiUrl}users`, {
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    });
    if (!res.ok) throw new Error("Unauthorized");

    const userData: IUser = await res.json();

    if (!["student", "teacher"].includes(userData.role)) {
      throw new Error("Unauthorized role");
    }

    setUser(userData);
    setToken(newToken);

    router.replace(`/(root)/(${userData.role as "teacher" | "student"})/profile`);
  };

  const logout = async () => {
    await AsyncStorage.removeItem(tokenStorageKey);
    setUser(null);
    setToken(null);
    router.replace("/(auth)/sign-in");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
