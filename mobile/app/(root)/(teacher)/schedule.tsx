import {SafeAreaView, Text, View} from "react-native";
import {useAuth} from "@/context/AuthContext";
import {useLessonInstance} from "@/hooks/schedule";
import {useTeacher} from "@/hooks/teachers";
import {useState} from "react";
import {format} from "date-fns";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";
import LessonInstancesMobile from "@/components/schedule/LessonList";
import LessonInstanceDatePickerMobile from "@/components/schedule/LessonInstanceDayPicker";
const Index = () => {
    const {user, token} = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const formattedDateStr = format(selectedDate, "yyyy-MM-dd");

    const {
        data: teacher,
        isLoading: teacherIsLoading,
        isError: teacherIsError,
        error: teacherError,
        refetch: refetchStudent,
    } = useTeacher(`school/${user?.school_id}/teachers`, user?.id, token || "");

    const {
        data: lessons,
        isLoading: lessonIsLoading,
        isError: lessonIsError,
        error: lessonError,
        refetch: refetchLessonInstances,
    } = useLessonInstance(
    `school/${user?.school_id}/lesson_instances`,
    "teachers",
        token || "",
        Number(teacher?.id),
        formattedDateStr
    );
    let content = <Loader/>;

    if (teacherIsLoading || lessonIsLoading) content = <Loader/>

    if (teacherIsError) content = (
      <ErrorMessage
          title={"Failed to load teacher"}
          message={teacherError?.message || "Please try again later"}
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
    if (!teacherIsLoading && !lessonIsLoading && !teacherIsError && !lessonIsError) content = (
        <LessonInstancesMobile lesson_instances={lessons || []} />
    )
    if (lessons?.length == 0) content = <View className="h-[70%] w-full flex items-center justify-center"><Text className="text-red-200 text-2xl font-light">Brak lekcji</Text></View>
    console.log(lessons);
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

export default Index;
