import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IUser } from "@/types/User";
import { apiUrl, tokenStorageKey } from "@/constants/constants";
import {usePathname, useRouter} from "expo-router";
import {ITeacher} from "@/types/Teacher";
import {IStudent} from "@/types/Student";

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
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname()

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
      setIsInitialized(true);
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    if ((!user || !token) && (pathname !== "/sign-in" && pathname !== "/sign-up" && pathname !== "/")) {
      setUser(null);
      setToken(null);
      router.replace("/(auth)/sign-in");
    } else {
      console.log(pathname);
      if (user && token) {
        const validPathnames = ["/profile", "/door_requests", "/attendances", "/schedule", "/home"]
        if (!validPathnames.includes(pathname)) {
          router.replace(`/(root)/(${user.role as "teacher" | "student"})/profile`);
        }
      }
    }
  }, [user, pathname, token, router, isInitialized]);

  const login = async (newToken: string) => {
    await AsyncStorage.setItem(tokenStorageKey, newToken);
    const res = await fetch(`${apiUrl}users`, {
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    });
    if (!res.ok) throw new Error("Unauthorized");

    const userData: IUser = await res.json();
    if (userData.role === "admin") {
      throw new Error("You're admin use admin panel instead of app");
    }
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
