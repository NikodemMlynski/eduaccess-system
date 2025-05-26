import { Text, View } from "react-native";
import {Link} from "expo-router";

export default function Index() {
  return (
    <View
      className="bg-red-200"
    >
      <Text className="text-2xl">Edit app/index.tsx to edit this screen.</Text>
      <Link href={"/(auth)/sign-up"}>Zarejestruj się</Link>
    </View>
  );
}
