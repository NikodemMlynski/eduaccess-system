import { Text } from "react-native";
import {useAuth} from "@/context/AuthContext";
import {useSchool} from "@/hooks/school";
import Profile from "@/components/Profile"
const Index = () => {
    const {user, logout, token } = useAuth();
    const {data: school, isLoading, isError, error} = useSchool(`school`, user?.school_id, token || "");
    if (isLoading) return <Text>Loading...</Text>;
    if (isError) return <Text>Error: {error.message}</Text>;

    return (
        <Profile
            user={user}
            logout={logout}
            school={school || null}
            class_={null}
        />
    );
};

export default Index;
