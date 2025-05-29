import {View, Text, SafeAreaView} from "react-native";
import { useStudent } from "@/hooks/students";
import { useLessonInstance } from "@/hooks/schedule";
import { useAuth } from "@/context/AuthContext";
import LessonInstancesMobile from "@/components/schedule/LessonList";

const ScheduleScreen = () => {
  const { user, token } = useAuth();
  const {
    data: student,
    isLoading: studentIsLoading,
    isError: studentIsError,
  } = useStudent(`school/${user?.school_id}/students`, user?.id, token || "");

  const dateStr = "2025-05-29";

  const {
    data: lessons,
    isLoading: lessonIsLoading,
    isError: lessonIsError,
  } = useLessonInstance(
    `school/${user?.school_id}/lesson_instances`,
    "classes",
    token || "",
    Number(student?.class_.id),
    dateStr
  );

  if (studentIsLoading || lessonIsLoading) return <Text>Loading...</Text>;
  if (studentIsError || lessonIsError) return <Text>Error loading data</Text>;

  return (
    <SafeAreaView className="flex-1 bg-black py-12">
      <Text className="text-2xl text-center py-2 text-green-text">Plan lekcji</Text>
      <LessonInstancesMobile lesson_instances={lessons} />
    </SafeAreaView>
  );
};

export default ScheduleScreen;
