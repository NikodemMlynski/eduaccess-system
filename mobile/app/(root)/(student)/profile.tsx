import { View, Text, TouchableOpacity, Alert } from "react-native";
import { format } from "date-fns";
import { User, Mail, Calendar, School, MapPin, LogOut } from "lucide-react-native";
import {useAuth} from "@/context/AuthContext";
import {useSchool} from "@/hooks/school";

const hardcodedUser = {
  school: {
    address: "Wojska Polskiego 24",
    teacher_addition_code: "URzklBJV9BjkBrQUA9c9m9dDJ",
    id: 1,
    name: "Technikum Budowlane nr.4 w Kościerzynie",
    student_addition_code: "i64aNMTc9GbCCyJ1Q8s3YBiUO",
  },
  id: 10,
  first_name: "Nikodem",
  last_name: "Młyński",
  email: "niko@niko.pl",
  role: "admin",
  created_at: "2025-03-20T19:30:34.030765",
  updated_at: "2025-03-20T19:30:34.030765",
};

const Profile = () => {
  const {user, logout, token } = useAuth();
  console.log(user);

   const {data: school, isLoading, isError, error} = useSchool(`school`, user?.school_id, token || "");
   if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error: {error.message}</Text>;

  return (
    <View className="flex-1 bg-background px-6 pt-14">
      {/* Header */}
      <View className="items-center mb-8">
        <View className="bg-surface rounded-full w-24 h-24 items-center justify-center mb-3">
          <User size={36} color="#00CFFF" />
        </View>
        <Text className="text-white text-2xl font-bold">{user?.first_name} {user?.last_name}</Text>
        <Text className="text-subtext text-sm">{user?.email}</Text>
      </View>

      {/* Info Section */}
      <View className="bg-surface rounded-2xl p-4 mb-4">
        <Text className="text-subtext font-semibold mb-3">Informacje ogólne</Text>

        <View className="flex-row items-center mb-2">
          <Mail size={20} color="#00CFFF" className="mr-2" />
          <Text className="text-white text-base">{user?.email}</Text>
        </View>

        <View className="flex-row items-center mb-2">
          <Calendar size={20} color="#00CFFF" className="mr-2" />
          <Text className="text-white text-base">
            Dołączył: {format(new Date(user?.created_at), "dd.MM.yyyy")}
          </Text>
        </View>
      </View>

      {/* School Section */}
      <View className="bg-surface rounded-2xl p-4 mb-6">
        <Text className="text-subtext font-semibold mb-3">Szkoła</Text>

        <View className="flex-row items-center mb-2">
          <School size={20} color="#00CFFF" className="mr-2" />
          <Text className="text-white text-base">{school?.name}</Text>
        </View>

        <View className="flex-row items-center">
          <MapPin size={20} color="#00CFFF" className="mr-2" />
          <Text className="text-white text-base">{school?.address}</Text>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity
        onPress={() => logout()}
        className="bg-red-600 py-3 rounded-xl flex-row items-center justify-center"
      >
        <LogOut size={20} color="#FFFFFF" className="mr-2" />
        <Text className="text-white text-base font-medium">Wyloguj się</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Profile;
