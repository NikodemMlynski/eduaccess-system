import { View, Text } from 'react-native';
import {useAuth} from "@/context/AuthContext";
import {useStudent} from "@/hooks/students";
import {useAttendanceStats} from "@/hooks/attendances";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";
import AttendancesList from "@/components/attendances/AttendancesList";
import AttendanceStats from "@/components/attendances/AttendancesStats";

export default function StudentStatsScreen() {
    const {user, token} = useAuth();

    const {
        data: student,
        isLoading: studentIsLoading,
        isError: studentIsError,
        error: studentError,
        refetch: refetchStudent
    } = useStudent(`school/${user?.school_id}/students`, user?.id, token || "");

    const {
        data: attendanceStats,
        isLoading: attendanceStatsIsLoading,
        isError: attendanceStatsIsError,
        error: attendanceStatsError,
        refetch: refetchAttendanceStats
    } = useAttendanceStats(
        `school/${user?.school_id}/attendances`,
        token || "",
        student?.id
    )
    let content = <Loader/>

    if (studentIsLoading || attendanceStatsIsLoading) content = <Loader/>

    if (studentIsError) content = (
        <ErrorMessage
            title={"Failed to load student"}
            message={studentError?.message || "Please try again later"}
            retryLabel={"Retry"}
            onRetry={() => refetchStudent()}
            />
    )
    if (attendanceStatsIsError) content = (
        <ErrorMessage
            title={"Failed to load attendances"}
            message={attendanceStatsError?.message || "Please try again later"}
            retryLabel={"Retry"}
            onRetry={() => refetchAttendanceStats()}
            />
    )
    console.log("attendances:")
    console.log(attendanceStats);
    if(!studentIsLoading && !attendanceStatsIsLoading && !attendanceStatsIsError && !studentIsError) content = (
        <AttendanceStats attendancesStats={attendanceStats || []} />
    )
      if (attendanceStats?.length == 0) content = <View className="h-[70%] w-full flex items-center justify-center"><Text className="text-red-200 text-2xl font-light">Brak frekwencji</Text></View>

  return (
    <View className="flex-1 py-5 bg-black">
        {content}
    </View>
  );
}
