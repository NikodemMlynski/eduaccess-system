import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";

const Layout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (user.role === "teacher") {
    return <Redirect href="/(root)/(teacher)/profile" />;
  }

  if (user.role === "student") {
    return <Redirect href="/(root)/(student)/profile" />;
  }

  return <Redirect href="/(auth)/sign-in" />; // fallback
};

export default Layout;
