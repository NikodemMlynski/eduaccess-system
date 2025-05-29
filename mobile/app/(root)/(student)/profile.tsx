import { Text } from "react-native";
import {useAuth} from "@/context/AuthContext";
import {useSchool} from "@/hooks/school";
import Profile from "@/components/Profile"
import {useStudent} from "@/hooks/students";
const Index = () => {
  const {user, logout, token } = useAuth();
  console.log(user);
    const {data: teacher, isLoading: teacherIsLoading,
        isError: teacherIsError, error: teacherError
    } = useStudent(`school/${user?.school_id}/students`, user?.id, token || "");

   const {data: school, isLoading, isError, error} = useSchool(`school`, user?.school_id, token || "");
   if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error: {error.message}</Text>;
    console.log(teacher);
  return (
    <Profile
        user={user}
        logout={logout}
        school={school || null}
    />
  );
};

export default Index;
