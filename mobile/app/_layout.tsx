import { Stack } from "expo-router";
import "@/global.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import ToastManager from "toastify-react-native";
import {AuthProvider} from "@/context/AuthContext";
const queryClient = new QueryClient();
export default function RootLayout() {
  return (
      <QueryClientProvider client={queryClient}>
          <AuthProvider>

              <Stack screenOptions={{navigationBarHidden: true}}>
                  <Stack.Screen name="index" options={{headerShown: false}} />
                  <Stack.Screen name="(root)" options={{headerShown: false}} />
                  <Stack.Screen name="(auth)" options={{headerShown: false}} />
              </Stack>
              <ToastManager/>
          </AuthProvider>
      </QueryClientProvider>
  )
}
