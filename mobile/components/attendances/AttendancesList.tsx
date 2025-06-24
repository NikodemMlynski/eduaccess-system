import { IAttendance } from "@/types/Attendance";
import { ScrollView, Text, View } from "react-native";
import { format } from "date-fns";
import {UserCheck, UserMinus, Clock} from "lucide-react-native";
// present - UserCheck
// absent - UserMinus

interface AttendancesListProps {
  attendances: IAttendance[];
}

const AttendancesList = ({ attendances }: AttendancesListProps) => {
  return (
    <ScrollView className="mb-[180px] p-4">
      {attendances?.map((attendance) => {
        const { id, lesson, status } = attendance;
        const subject = lesson.subject;
        const start = format(new Date(lesson.start_time), "HH:mm");
        const end = format(new Date(lesson.end_time), "HH:mm");

        // Status kolory
        const statusIcon =
          status === "present"
            ? <UserCheck color="#4ade80" />
            : status === "late"
            ? <Clock color="#facc15" />
            :  <UserMinus color="#f87171" />

        return (
          <View
            key={id}
            className="bg-background rounded-2xl shadow-md p-4 mb-4 mx-2 flex flex-row gap-10 px-6 items-center"
          >
              {statusIcon}
              <View className="flex">
                <Text className="text-text text-lg font-semibold mb-1">
                  {subject}
                </Text>
                <Text className="text-subtext text-sm mt-1">
                  {start} – {end}
                </Text>
              </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

export default AttendancesList;
