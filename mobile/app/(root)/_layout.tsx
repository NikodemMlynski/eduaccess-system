import {Stack} from "expo-router";

const Layout = () => {

    return (
        <Stack>
            <Stack.Screen name="(teacher)" options={{headerShown: false}} />
            <Stack.Screen name="(student)" options={{headerShown: false}} />
        </Stack>
    )
}

export default Layout;