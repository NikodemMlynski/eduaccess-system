import {SafeAreaView, Text, View} from "react-native";
import {useAuth} from "@/context/AuthContext";
import {useState} from "react";
import {useTeacher} from "@/hooks/teachers";
import {format} from "date-fns";
import {useLessonInstance} from "@/hooks/schedule";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";
import LessonInstancesMobile from "@/components/schedule/LessonList";
import LessonInstanceDatePickerMobile from "@/components/schedule/LessonInstanceDayPicker";
import {useTeacherAttendances} from "@/hooks/attendances";
import {IAttendance, IAttendanceCompact, IAttendanceRaw} from "@/types/Attendance";
import TeachersAttendanceList, {TeacherAttendanceItem} from "@/components/attendances/TeachersAttendanceList";
import {ILessonInstance} from "@/types/schedule";

const Index = () => {
    const { user, token } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const {
    data: teacher,
    isLoading: teacherIsLoading,
    isError: teacherIsError,
    error: teacherError,
      refetch: refetchStudent,
    } = useTeacher(`school/${user?.school_id}/teachers`, user?.id, token || "");

    const formattedDateStr = format(selectedDate, "yyyy-MM-dd");
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

    const {
        data: attendances,
        isLoading: attendancesIsLoading,
        isError: attendancesIsError,
        error: attendancesError,
        refetch: refetchAttendances,
    } = useTeacherAttendances<IAttendanceCompact>(
        `school/${user?.school_id}/attendances`,
        token || "",
        teacher?.id,
        formattedDateStr
    )

    let content = <Loader/>;

    if (teacherIsLoading || lessonIsLoading || attendancesIsLoading) content = <Loader/>

    if (teacherIsError) content = (
      <ErrorMessage
          title={"Failed to load teacher"}
          message={teacherError?.message || "Please try again later"}
          retryLabel={"Retry"}
          onRetry={() => refetchStudent()}
      />
    )
    if (lessonIsError) content = (
      <ErrorMessage
          title={"Something went wrong"}
          message={lessonError?.message || "Failed to load lesson instances"}
          retryLabel={"Retry"}
          onRetry={() => refetchLessonInstances()}
      />
    )

    if (attendancesIsError) content = (
      <ErrorMessage
          title={"Something went wrong"}
          message={attendancesError?.message || "Failed to load attendances"}
          retryLabel={"Retry"}
          onRetry={() => refetchAttendances()}
      />
    )
    console.log("Attendances")
    console.log(attendances)
    const formattedAttendances: TeacherAttendanceItem[] | undefined = lessons?.map(lesson => {
        const filteredAttendancecs = attendances?.filter((att: IAttendanceCompact) => att?.lesson_id === lesson?.id)
        return {
            lesson: lesson,
            attendances: filteredAttendancecs || []
        }
    })

    console.log(formattedAttendances)

    if (!attendancesIsLoading && !teacherIsLoading && !attendancesIsError && !lessonIsLoading && !teacherIsError && !lessonIsError) content = (
        <TeachersAttendanceList teacherAttendances={formattedAttendances || []} />
    )
    if (lessons?.length == 0) content = <View className="h-[70%] w-full flex items-center justify-center"><Text className="text-red-200 text-2xl font-light">Brak lekcji</Text></View>
    return (
    <SafeAreaView className="flex-1 bg-black py-0">
      <View className="flex flex-row justify-between px-5 py-3 pt-12 bg-background">
        <Text className="text-2xl text-center py-2 text-white">Frekwencja</Text>
      </View>
      <LessonInstanceDatePickerMobile selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      {content}
    </SafeAreaView>
  );
};

export default Index;
