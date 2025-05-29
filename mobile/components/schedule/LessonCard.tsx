import { View, Text } from "react-native";
import { ILessonInstance } from "@/types/schedule";
import { format } from "date-fns";

interface LessonInstanceMobileProps {
  lesson: ILessonInstance;
}

const LessonInstanceMobile = ({ lesson }: LessonInstanceMobileProps) => {
  return (
    <View className="w-full px-4 py-3 border-b border-[#444]">
      <Text className="text-white font-semibold text-lg mb-1">
        {lesson.subject}
      </Text>

      <View className="flex flex-row gap-2">
          <Text className="text-gray-300 text-sm mb-0.5 min-w-[65px]">
        {format(lesson.start_time, "HH:mm")} - {format(lesson.end_time, "HH:mm")}
      </Text>

      <Text className="text-green-400 text-sm mb-0.5 min-w-[55px]">
        Sala: {lesson.room.room_name}
      </Text>

      <Text className="text-gray-300 text-sm">
        {lesson.teacher.user.first_name} {lesson.teacher.user.last_name}
      </Text>
      </View>
    </View>
  );
};

export default LessonInstanceMobile;
