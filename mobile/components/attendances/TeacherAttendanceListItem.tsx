import {IAttendanceCompact, IAttendanceStatus} from "@/types/Attendance";
import {Text, TouchableOpacity, View} from "react-native";
import clsx from "clsx";
import {X, Check, Clock} from "lucide-react-native";

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
}

const TeacherAttendanceListItem = ({
    attendance
}: TeacherAttendanceListItemProps) => {
    // TODO:
    // aktualnie w tym komponencie wyświetlane są obeczności które już istnieją
    // wrzucić tutaj tyle obiektów ile jest uczniów w klasie
    // dla niektórych dodać obecność jeżeli taka istnieje
    //      - po kliknięciu funkcja update
    // niektóre będą puste
    //      - po kliknięciu funkcja create
    return (
        <View
            key={attendance.id}
            className="bg-surface my-1 rounded-xl p-3 shadow-inner px-10"
          >
            <View className="flex flex-row gap-2 items-center pb-4">

                <Text className="text-white font-medium">
                    {attendance.student.user.first_name} {attendance.student.user.last_name}
                </Text>
                {getAttendanceIcon(attendance.status, attendanceStatusColorMap[attendance.status])}


            </View>
            <View className="flex-row justify-between">
              {["absent", "late", "present"].map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => console.log(status)}
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