import { useLocalSearchParams } from 'expo-router';
import { View, Text } from 'react-native';

export const unstable_settings = {
  // zapobiega dodaniu do tabów
  href: null,
};

const ClassAttendanceByDay = () => {

  return (
    <View className="flex-1 py-10 bg-black">
      <Text className={'text-2xl text-white text-center'}>Po dacie</Text>
    </View>
  );
};

export default ClassAttendanceByDay;
