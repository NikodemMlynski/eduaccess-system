import { View, Text, Image, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 bg-background">
      <View className="mt-5 h-[68%] w-full">
        <Image
          source={require("@/assets/images/welcome_screen.png")}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <View className="flex-1 items-center justify-start px-6 pt-20 gap-5">
        {/* Przycisk Sign Up */}
        <Link href="(auth)/sign-up" asChild>
          <TouchableOpacity className="w-full bg-primary py-4 rounded-2xl shadow-md mb-4">
            <Text className="text-white text-center text-lg font-semibold">Zarejestruj się</Text>
          </TouchableOpacity>
        </Link>

        {/* Link Login */}
        <Link href="(auth)/sign-in" asChild>
          <TouchableOpacity>
            <Text className="text-accent text-base font-medium">Mam już konto</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
