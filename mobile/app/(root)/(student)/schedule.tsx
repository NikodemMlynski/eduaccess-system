import { View, Text, SafeAreaView } from "react-native";
import { useState } from "react";
import { useStudent } from "@/hooks/students";
import { useLessonInstance } from "@/hooks/schedule";
import { useAuth } from "@/context/AuthContext";
import LessonInstancesMobile from "@/components/schedule/LessonList";
import LessonInstanceDatePickerMobile from "@/components/schedule/LessonInstanceDayPicker";
import { format } from "date-fns";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";

const ScheduleScreen = () => {
  const { user, token } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const {
    data: student,
    isLoading: studentIsLoading,
    isError: studentIsError,
    error: studentError,
      refetch: refetchStudent,
  } = useStudent(`school/${user?.school_id}/students`, user?.id, token || "");

  const formattedDateStr = format(selectedDate, "yyyy-MM-dd");

  const {
    data: lessons,
    isLoading: lessonIsLoading,
    isError: lessonIsError,
    error: lessonError,
      refetch: refetchLessonInstances,
  } = useLessonInstance(
    `school/${user?.school_id}/lesson_instances`,
    "classes",
    token || "",
    Number(student?.class_.id),
    formattedDateStr
  );
  let content = <Loader/>;

  if (studentIsLoading || lessonIsLoading) content = <Loader/>

  if (studentIsError) content = (
      <ErrorMessage
          title={"Failed to load student"}
          message={studentError?.message || "Please try again later"}
          retryLabel={"Retry"}
          onRetry={() => refetchStudent()}
      />
  )
  if (lessonError) content = (
      <ErrorMessage
          title={"Something went wrong"}
          message={lessonError?.message || "Failed to load lesson instances"}
          retryLabel={"Retry"}
          onRetry={() => refetchLessonInstances()}
      />
  )
 if (!studentIsError && !lessonIsLoading && !studentIsError && !lessonIsError) content = <LessonInstancesMobile lesson_instances={lessons || []} />
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
