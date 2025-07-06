import { SafeAreaView, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useCurrentLessonInstance } from "@/hooks/schedule";
import { useAuth } from "@/context/AuthContext";
import React from "react";
import { useStudent } from "@/hooks/students";
import { format, parseISO } from "date-fns";
import { useAttendances } from "@/hooks/attendances";
import { IAttendance } from "@/types/Attendance";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";
import { UserCheck, UserMinus, Clock } from "lucide-react-native";
import { useRouter } from "expo-router";

const Home = () => {
  const { user, token } = useAuth();
  const router = useRouter();

  const {
    data: student,
    isLoading: studentIsLoading,
    isError: studentIsError,
    error: studentError,
    refetch: refetchStudent,
  } = useStudent(
    `school/${user?.school_id}/students`,
    user?.id,
    token || ""
  );

  const currentDate = new Date("2025-06-16");
  const formattedDateStr = format(currentDate, "yyyy-MM-dd");

  const {
    data: attendances,
    isLoading: attendancesIsLoading,
    isError: attendancesIsError,
    error: attendancesError,
    refetch: attendancesRefetch,
  } = useAttendances<IAttendance>(
    `school/${user?.school_id}/attendances`,
    "student",
    token || "",
    student?.id,
    formattedDateStr
  );

  const {
    data: currentLesson,
    isLoading: lessonIsLoading,
    isError: lessonIsError,
    error: lessonError,
    refetch: refetchCurrentLesson,
  } = useCurrentLessonInstance(
    `school/${user?.school_id}/lesson_instances`,
    student?.class_.id,
    token || ""
  );

  const goToSchedule = () => router.push("/(root)/(student)/schedule");
  const goToAttendances = () => router.push("/(root)/(student)/attendances");

  const renderLessonBlock = () => {
    if (!currentLesson) return null;

    const { subject, room, start_time, end_time, teacher } = currentLesson;

    return (
    <View className="p-4 ">
            <Text className="py-3 text-center text-white text-2xl font-semibold mb-1">Aktualna lekcja</Text>
          <TouchableOpacity
            className="bg-background rounded-2xl shadow-md p-4 mb-4 mx-2"
            onPress={goToSchedule}
          >
              <View className="flex flex-col">
                  <Text className="text-text text-xl py-1 px-5">{subject}</Text>
                  <View className="flex flex-row justify-around py-1 pt-2">
                    <Text className="text-subtext text-md">
                      Sala: {room?.room_name}
                    </Text>
                    <Text className="text-subtext text-md">
                      {format(new Date(start_time), "HH:mm")} – {format(new Date(end_time), "HH:mm")}
                    </Text>
                      <Text className="text-subtext text-md">
                  {teacher.user.first_name} {teacher.user.last_name}
                </Text>
                  </View>

              </View>
          </TouchableOpacity>
        <TouchableOpacity
                onPress={() => router.push("/(root)/(student)/door_requests")}
                className="bg-surface p-4 mx-2 my-3 mt-0 rounded-2xl shadow-lg"
              >
                <Text className="text-text text-2xl mt-1 text-center">Wejdź do sali</Text>
          </TouchableOpacity>
        </View>
    );
  };

  const renderLatestAttendance = () => {
    if (!attendances || attendances.length === 0) return null;

    const latest = attendances.reduce((prev, curr) =>
      new Date(curr.lesson.start_time) > new Date(prev.lesson.start_time)
        ? curr
        : prev
    );

    const { id, lesson, status } = latest;
    const subject = lesson.subject;
    const start = format(new Date(lesson.start_time), "HH:mm");
    const end = format(new Date(lesson.end_time), "HH:mm");

    const statusIcon =
      status === "present" ? (
        <UserCheck color="#4ade80" />
      ) : status === "late" ? (
        <Clock color="#facc15" />
      ) : (
        <UserMinus color="#f87171" />
      );

    return (
         <View className="p-4 ">
            <Text className="py-3 text-center text-white text-2xl font-semibold mb-1">Dzisiejsze obecności</Text>
      <TouchableOpacity
        className="bg-background rounded-2xl shadow-md p-4 mb-4 mx-2 flex flex-row gap-10 px-6 items-center"
        onPress={goToAttendances}
      >
        {statusIcon}
        <View className="flex">
          <Text className="text-white text-xl font-semibold mb-1">{subject}</Text>
          <Text className="text-subtext text-md mt-1">
            {start} – {end}
          </Text>
        </View>
      </TouchableOpacity>
         </View>
    );
  };

  if (studentIsLoading || attendancesIsLoading || lessonIsLoading) {
    return <Loader />;
  }

  if (studentIsError || attendancesIsError || lessonIsError) {
    return (
      <ErrorMessage
        title={"Wystąpił błąd"}
        message={"Spróbuj ponownie za chwilę"}
        retryLabel={"Odśwież"}
        onRetry={() => {
          refetchStudent();
          attendancesRefetch();
          refetchCurrentLesson();
        }}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex flex-row justify-between px-5 py-3 pt-12 bg-background">
        <Text className="text-3xl text-center py-4 text-white">EduAccess</Text>
      </View>

      <View className="flex-1 mt-10 flex flex-col justify-around mb-[180px]">
        {renderLessonBlock()}

        {renderLatestAttendance()}
        {/* Możesz dodać kolejny bloczek np. do profilu */}

      </View>
    </SafeAreaView>
  );
};

export default Home;
