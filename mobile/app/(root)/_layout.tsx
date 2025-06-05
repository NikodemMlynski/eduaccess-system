import {Stack} from "expo-router";
import {useAuth} from "@/context/AuthContext";
import {Text, View} from "react-native";

const Layout = () => {
    const {token, isLoading} = useAuth();

    if (isLoading) return <View><Text>Loading...</Text></View>;
    if(!token) return null;
    return (
        <Stack>
            <Stack.Screen name="(teacher)" options={{headerShown: false}} />
            <Stack.Screen name="(student)" options={{headerShown: false}} />
        </Stack>
    )
}

export default Layout;

