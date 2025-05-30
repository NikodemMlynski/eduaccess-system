import { View, Text, SafeAreaView } from "react-native";
import { useState } from "react";
import { useStudent } from "@/hooks/students";
import { useLessonInstance } from "@/hooks/schedule";
import { useAuth } from "@/context/AuthContext";
import LessonInstancesMobile from "@/components/schedule/LessonList";
import LessonInstanceDatePickerMobile from "@/components/schedule/LessonInstanceDayPicker";
import { format } from "date-fns";

const ScheduleScreen = () => {
  const { user, token } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    data: student,
    isLoading: studentIsLoading,
    isError: studentIsError,
  } = useStudent(`school/${user?.school_id}/students`, user?.id, token || "");

  const formattedDateStr = format(selectedDate, "yyyy-MM-dd");

  const {
    data: lessons,
    isLoading: lessonIsLoading,
    isError: lessonIsError,
  } = useLessonInstance(
    `school/${user?.school_id}/lesson_instances`,
    "classes",
    token || "",
    Number(student?.class_.id),
    formattedDateStr
  );
  let content = <Text>Loading...</Text>

  if (studentIsLoading || lessonIsLoading) content =  <Text>Loading...</Text>;
  if (studentIsError || lessonIsError) content = <Text>Error loading data</Text>;
  content = <LessonInstancesMobile lesson_instances={lessons || []} />
  if (lessons?.length == 0) content = <View className="h-[70%] w-full flex items-center justify-center"><Text className="text-red-200 text-2xl font-light">Brak lekcji</Text></View>
  return (
    <SafeAreaView className="flex-1 bg-black py-0">
      <View className="flex flex-row justify-between px-5 py-3 pt-12 bg-background">
        <Text className="text-2xl text-center py-2 text-white">Plan lekcji</Text>
      </View>
      <LessonInstanceDatePickerMobile selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      {content}
    </SafeAreaView>
  );
};

export default ScheduleScreen;
