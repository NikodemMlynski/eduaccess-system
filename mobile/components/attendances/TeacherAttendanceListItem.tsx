import {IAttendanceCompact, IAttendanceStatus} from "@/types/Attendance";
import {Text, TouchableOpacity, View} from "react-native";
import clsx from "clsx";
import {X, Check, Clock} from "lucide-react-native";
import {useUpdateAttendance} from "@/hooks/attendances";
import {useAuth} from "@/context/AuthContext";
import {Toast} from "toastify-react-native";

const attendanceStatusIconMap = {
  absent: X,
  present: Check,
  late: Clock,
};
const attendanceStatusColorMap = {
    absent: "#e7000b",
    present: "#00a63e",
    late: "#d08700"
}

export const getAttendanceIcon = (
  status: IAttendanceStatus,
  color: string = "#FFFFFF",
  size: number = 20
) => {
  const IconComponent = attendanceStatusIconMap[status];
  return <IconComponent color={color} size={size} />;
};


interface TeacherAttendanceListItemProps {
    attendance: IAttendanceCompact;
    teacher_id: number;
    dateStr: string;
}

const TeacherAttendanceListItem = ({
    attendance,
    teacher_id,
    dateStr,
}: TeacherAttendanceListItemProps) => {
    const {user, token} = useAuth();
    // nie trzeba pobierać wszystkich studentów ponieważ system sam z siebie wpisuje
    // automatyczne obecności po 7 minutach od rozpoczęcia lekcji
    const updateAttendanceMutation = useUpdateAttendance(
        `school/${user?.school_id}/attendances`,
        token || "",
        attendance.id,
        teacher_id,
        dateStr
    )
    const handleUpdate = (status: IAttendanceStatus) => {
        if (!status) return;
        updateAttendanceMutation.mutate({
            student_id: attendance.student.id,
            lesson_id: attendance.lesson_id,
            status: status,
            manual_adjustment: true,
        }, {
            onError: (err) => {
                Toast.error(err.message || "Failed to update attendance");
            }
        })
    }

    return (
        <View
            key={attendance.id}
            className="bg-surface my-1 rounded-xl p-3 shadow-inner px-10"
          >
            <View className="flex flex-row gap-2 items-center pb-4">

                <Text className="text-white font-medium w-[70%]">
                    {attendance.student.user.first_name} {attendance.student.user.last_name}
                </Text>
                {getAttendanceIcon(attendance.status, attendanceStatusColorMap[attendance.status])}


            </View>
            <View className="flex-row justify-between">
              {["absent", "late", "present"].map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => handleUpdate(status as IAttendanceStatus)}
                  className={clsx(
                    "px-3 py-1 rounded-3xl w-8 h-8 flex items-center justify-center text-text",
                    status === "present"
                      ? "bg-green-500"
                      : status === "late"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  )}
                >
                    {getAttendanceIcon(status as IAttendanceStatus)}
                  {/*<Text className="text-white text-sm font-semibold capitalize">*/}
                  {/*  {status}*/}
                  {/*</Text>*/}
                </TouchableOpacity>
              ))}
            </View>
          </View>
    )
}
export default TeacherAttendanceListItem;