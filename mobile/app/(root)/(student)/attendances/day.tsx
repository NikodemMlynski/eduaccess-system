import { View, Text } from 'react-native';
import {useAuth} from "@/context/AuthContext";
import {useState} from "react";
import {useStudent} from "@/hooks/students";
import {format} from "date-fns";
import {useAttendances} from "@/hooks/attendances";
import Loader from "@/components/Loader";
import ErrorMessage from "@/components/ErrorMessage";
import AttendancesList from "@/components/attendances/AttendancesList";
import LessonInstanceDatePickerMobile from "@/components/schedule/LessonInstanceDayPicker";
import {IAttendance} from "@/types/Attendance";

export const unstable_settings = {
  // zapobiega dodaniu do tabów
  href: null,
};

const StudentAttendanceByDay = () => {
    const {user, token} = useAuth()
    const [selectedDate, setSelectedDate] = useState(new Date());

    const {
        data: student,
        isLoading: studentIsLoading,
        isError: studentIsError,
        error: studentError,
        refetch: refetchStudent
    } = useStudent(`school/${user?.school_id}/students`, user?.id, token || "");

    const formattedDateStr = format(selectedDate, "yyyy-MM-dd");

    const {
        data: attendances,
        isLoading: attendancesIsLoading,
        isError: attendancesIsError,
        error: attendancesError,
        refetch: attendancesRefetch
    } = useAttendances<IAttendance>(
        `school/${user?.school_id}/attendances`,
        "student",
        token || "",
        student?.id,
        formattedDateStr,
    )

    let content = <Loader/>

    if (studentIsLoading || attendancesIsLoading) content = <Loader/>

    if (studentIsError) content = (
        <ErrorMessage
            title={"Failed to load student"}
            message={studentError?.message || "Please try again later"}
            retryLabel={"Retry"}
            onRetry={() => refetchStudent()}
            />
    )
    if (attendancesIsError) content = (
        <ErrorMessage
            title={"Failed to load attendances"}
            message={attendancesError?.message || "Please try again later"}
            retryLabel={"Retry"}
            onRetry={() => attendancesRefetch()}
            />
    )
    console.log("attendances:")
    console.log(attendances);
    if(!studentIsLoading && !attendancesIsError && !attendancesIsError && !studentIsError) content = (
        <AttendancesList attendances={attendances || []}/>
    )
      if (attendances?.length == 0) content = <View className="h-[70%] w-full flex items-center justify-center"><Text className="text-red-200 text-2xl font-light">Brak frekwencji</Text></View>


  return (
    <View className="flex-1 py-1 bg-black">
        <LessonInstanceDatePickerMobile selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        <View className="mt-1">
        {content}
        </View>
    </View>
  );
};

export default StudentAttendanceByDay;
