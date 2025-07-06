import {SafeAreaView, Text, View} from "react-native";
import {useAuth} from "@/context/AuthContext";
import {useTeacher} from "@/hooks/teachers";
import {useDeniedAccessLogsForLesson} from "@/hooks/access_logs";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";
import React from "react";
import TeacherDoorRequestsList from "@/components/access_logs/TeacherDoorRequestsList";
import {TeacherAccessLogListener} from "@/websockets/TeacherAccessLogListener";


const Index = () => {
    const {user, token} = useAuth();

    const {
        data: teacher,
        isLoading: teacherIsLoading,
        isError: teacherIsError,
        error: teacherError,
        refetch: refetchTeacher
    } = useTeacher(
        `school/${user?.school_id}/teachers`,
        user?.id,
        token || ""
    );
    const {
        data: deniedAccessLogs,
        isLoading: deniedAccessLogsIsLoading,
        isError: deniedAccessLogsIsError,
        error: deniedAccessLogsError,
        refetch: refetchDeniedAccessLogs
    } = useDeniedAccessLogsForLesson(
        `school/${user?.school_id}/access-logs`,
        user?.id || null,
        teacher?.id || null,
        token || ""
    )

    let content = <Loader/>;
    if (teacherIsLoading || deniedAccessLogsIsLoading) content = <Loader/>

    if (teacherIsError) content = (
      <ErrorMessage
          title={"Failed to load teacher"}
          message={teacherError?.message || "Please try again later"}
          retryLabel={"Retry"}
          onRetry={() => refetchTeacher()}
      />
    )
    if (deniedAccessLogsIsError) content = (
      <ErrorMessage
          title={"Something went wrong"}
          message={deniedAccessLogsError?.message || "Failed to load denied access logs"}
          retryLabel={"Retry"}
          onRetry={() => refetchDeniedAccessLogs()}
      />
    )
    if (deniedAccessLogs && teacher) content = (
        <TeacherDoorRequestsList accessLogs={deniedAccessLogs} teacherId={teacher.id} />
    )
    if (deniedAccessLogs && deniedAccessLogs.length == 0) content = (
        <View className="h-[30%] w-full flex items-center justify-center">
            <Text className="text-red-200 text-2xl font-light">
                No access logs for current lesson found</Text>
        </View>
        )
    console.log(deniedAccessLogs)
    return (
       <SafeAreaView className="flex-1 bg-black py-0">
            <TeacherAccessLogListener teacherId={`${teacher?.id}` || null} />
            <View className="flex flex-row justify-between px-5 py-3 pt-12 bg-background">
                <Text className="text-2xl text-center py-2 text-white">Access requests</Text>
            </View>
            <View className="flex items-center py-6 pb-0">
                {content}
            </View>

        </SafeAreaView>
    );
};

export default Index;
