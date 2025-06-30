import {SafeAreaView, Text, View} from "react-native";
import {useCurrentLessonInstance} from "@/hooks/schedule";
import {useAuth} from "@/context/AuthContext";
import {useStudent} from "@/hooks/students";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";
import StudentDoorRequest from "@/components/access_logs/StudentDoorRequest";
import StudentOtherRoomsRequest from "@/components/access_logs/StudentOtherRoomsRequest";
import {useRooms} from "@/hooks/rooms";
import {useState} from "react";
import {IAccessLog} from "@/types/AccessLogs";
const Index = () => {
    const {user, token} = useAuth();
    const [existingAccessLog, setExistingAccessLog] = useState<IAccessLog | null>(null);
    const [existingDeniedAccessLog, setExistingDeniedAccessLog] = useState<IAccessLog | null>(null);
    const [existingApprovedAccessLog, setExistingApprovedAccessLog] = useState<IAccessLog | null>(null);
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
     const {
        data: rooms,
        isLoading: roomsIsLoading,
        error: roomsError,
        isError: roomsIsError,
        refetch: roomRefetch,
    } = useRooms(`school/${user?.school_id}/rooms`, token || "")

    let content = <Loader/>;
    let roomsContent = <Loader/>;
    if (studentIsLoading || lessonIsLoading) content = <Loader/>
    if(roomsIsLoading) roomsContent = <Loader/>

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
    if (roomsIsError) roomsContent = (
      <ErrorMessage
          title={"Something went wrong"}
          message={"Failed to load rooms"}
          retryLabel={"Retry"}
          onRetry={() => roomRefetch()}
      />
    )

    if (!studentIsLoading && !lessonIsLoading &&
        !studentIsError && !lessonIsError &&
        currentLesson && user?.id
    ) content = (
     <StudentDoorRequest
         userId={user?.id}
         lesson={currentLesson}
         setExistingAccessLog={setExistingAccessLog}
         existingAccessLog={existingAccessLog}
     />
    )


    if (!currentLesson) content = <View className="h-[30%] w-full flex items-center justify-center"><Text className="text-red-200 text-2xl font-light">Aktualnie nie masz żadnej lekcji</Text></View>

    if (!roomsIsLoading && !roomsIsError && user?.id && rooms
    && !(existingAccessLog && !existingAccessLog.access_end_time)) roomsContent = (
            <StudentOtherRoomsRequest
                userId={user.id}
                rooms={rooms.rooms}
                existingDeniedAccessLog={existingDeniedAccessLog}
                setExistingDeniedAccessLog={setExistingDeniedAccessLog}
                existingApprovedAccessLog={existingDeniedAccessLog}
                setExistingApprovedAccessLog={setExistingApprovedAccessLog}
            />
    )
    if (rooms && rooms.rooms.length == 0) roomsContent = (
        <View className="h-[30%] w-full flex items-center justify-center">
            <Text className="text-red-200 text-2xl font-light">
                Nie znaleziono żadnej sali</Text>
        </View>
        )
    if (existingAccessLog && !existingAccessLog.access_end_time) roomsContent = <></>
    return (
        <SafeAreaView className="flex-1 bg-black py-0">
            <View className="flex flex-row justify-between px-5 py-3 pt-12 bg-background">
                <Text className="text-2xl text-center py-2 text-white">Classrooms</Text>
            </View>
            {existingAccessLog && !existingAccessLog.access_end_time && <Text className="text-3xl font-normal text-subtext text-center pt-5">You are currently in class</Text>}
            {currentLesson && <>
            <View className="flex items-center py-6 pb-0">
                 <Text className="text-text font-semibold text-2xl py-5">Your current lesson</Text>
            </View>
            {content}
            </>
                }
            <View className="flex items-center">
                {!(existingAccessLog && !existingAccessLog.access_end_time) && <Text className="text-text font-semibold text-2xl py-5">Enter other classrooms</Text>}
                {roomsContent}
            </View>
        </SafeAreaView>
    );
};

export default Index;
