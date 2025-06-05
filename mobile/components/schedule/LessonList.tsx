import { View, ScrollView } from "react-native";
import { ILessonInstance } from "@/types/schedule";
import LessonInstanceMobile from "./LessonCard";

interface LessonInstancesMobileProps {
  lesson_instances: ILessonInstance[];
}

const LessonInstancesMobile = ({ lesson_instances }: LessonInstancesMobileProps) => {
  const sortedLessons = [...lesson_instances].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  return (
    <ScrollView className="flex-1 bg-black">
      <View className="pt-4">
        {sortedLessons.map((lesson) => (
          <LessonInstanceMobile key={lesson.id} lesson={lesson} />
        ))}
      </View>
    </ScrollView>
  );
};

export default LessonInstancesMobile;
