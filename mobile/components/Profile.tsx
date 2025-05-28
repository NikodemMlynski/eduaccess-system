import {Text, TouchableOpacity, View} from "react-native";
import {Calendar, LogOut, Mail, MapPin, School, User, Users} from "lucide-react-native";
import {format} from "date-fns";
import {IUser} from "@/types/User";
import {ISchool} from "@/types/School";

interface ProfileProps {
    user: IUser | null;
    school: ISchool | null;
    logout: () => void;
}

const Profile = ({
    user,
    school,
    logout
}: ProfileProps) => {
    return (
        <View className="flex-1 bg-background px-6 pt-20">
          <View className="items-center mb-20">
            <View className="bg-surface rounded-full w-28 h-28 items-center justify-center mb-3">
              <User size={50} color="#00CFFF" />
            </View>
            <Text className="text-white text-3xl font-bold">{user?.first_name} {user?.last_name}</Text>
            <Text className="text-subtext text-md">{user?.email}</Text>
          </View>

          <View className="bg-surface rounded-2xl p-5 mb-8">
            <Text className="text-subtext text-lg font-semibold mb-3">Informacje ogólne</Text>

            <View className="flex-row items-center mb-4 gap-3">
              <Mail size={20} color="#00CFFF" className="mr-2" />
              <Text className="text-white text-base">{user?.email}</Text>
            </View>

            <View className="flex-row items-center mb-4 gap-3">
              <Calendar size={20} color="#00CFFF" className="mr-2" />
              <Text className="text-white text-base">
                Dołączył: {format(new Date(user?.created_at), "dd.MM.yyyy")}
              </Text>
            </View>
          </View>

          {/* School Section */}
          <View className="bg-surface rounded-2xl p-5 mb-9">
            <Text className="text-subtext text-lg font-semibold mb-3">Szkoła</Text>

            <View className="flex-row items-center mb-4 gap-3">
              <School size={20} color="#00CFFF" className="mr-2" />
              <Text className="text-white text-base pr-8">{school?.name}</Text>
            </View>

            <View className="flex-row items-center mb-4 gap-3">
              <MapPin size={20} color="#00CFFF" className="mr-2" />
              <Text className="text-white text-base">{school?.address}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => logout()}
            className={`bg-red-600 mt-10 py-4 rounded-xl flex-row items-center justify-center`}
          >
            <LogOut size={20} color="#FFFFFF" className="mr-2" />
            <Text className="text-white font-medium text-xl">Wyloguj się</Text>
          </TouchableOpacity>
        </View>
  );
}

export default Profile;