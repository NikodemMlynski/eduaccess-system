import {SafeAreaView, Text, View} from "react-native";
import {useCurrentLessonInstance} from "@/hooks/schedule";
import {useAuth} from "@/context/AuthContext";
import {useStudent} from "@/hooks/students";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";
import StudentDoorRequest from "@/components/access_logs/StudentDoorRequest";
const Index = () => {
    const {user, token} = useAuth();

    const {
        data: student,
        isLoading: studentIsLoading,
        isError: studentIsError,
        error: studentError,
        refetch: refetchStudent
    } = useStudent(
        `school/${user?.school_id}/students`,
        user?.id,
        token || ""
    )

    const {
        data: currentLesson,
        isLoading: lessonIsLoading,
        isError: lessonIsError,
        error: lessonError,
        refetch: refetchCurrentLesson
    } = useCurrentLessonInstance(
        `school/${user?.school_id}/lesson_instances`,
        student?.class_.id,
        token || ""
    )

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
          onRetry={() => refetchCurrentLesson()}
      />
    )
    if (!studentIsLoading && !lessonIsLoading && !studentIsError && !lessonIsError && currentLesson && user?.id) content = (
     <StudentDoorRequest userId={user?.id} lesson={currentLesson} />
    )
    if (!currentLesson) content = <View className="h-[70%] w-full flex items-center justify-center"><Text className="text-red-200 text-2xl font-light">Aktualnie nie masz żadnej lekcji</Text></View>
    console.log(currentLesson);
    return (
        <SafeAreaView className="flex-1 bg-black py-0">
            <View className="flex flex-row justify-between px-5 py-3 pt-12 bg-background">
                <Text className="text-2xl text-center py-2 text-white">Classrooms</Text>
            </View>
            <View className="h-full flex items-center py-10">
                {currentLesson && <Text className="text-text font-semibold text-2xl py-5">Your current lesson</Text>}
            {content}
            </View>
        </SafeAreaView>
    );
};

export default Index;
