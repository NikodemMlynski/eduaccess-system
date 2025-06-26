import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {IAttendanceCompact, TeacherAttendanceItem} from "@/types/Attendance";
import { ChevronDown, ChevronUp } from "lucide-react-native"; // lucide-react-native dla React Native
import clsx from "clsx";
import TeacherAttendanceListItem from "@/components/attendances/TeacherAttendanceListItem";
import {format} from "date-fns";

interface TeachersAttendanceListProps {
  teacherAttendances: TeacherAttendanceItem[];
}

const TeacherAttendanceList = ({ teacherAttendances }: TeachersAttendanceListProps) => {
  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <ScrollView className="px-4 py-2 mb-[110px]">
      {teacherAttendances.map(({ lesson, attendances }) => {
        const isExpanded = expandedIds.includes(lesson.id);
        const formattedLesonDate = format(lesson.start_time, "yyyy-MM-dd");
        const sortedAttendances = attendances.sort((a, b) =>
          a.student.user.first_name.localeCompare(b.student.user.first_name, 'pl', { sensitivity: 'base' })
        );

        return (
          <View key={lesson.id} className="bg-background rounded-2xl p-4 mb-4  shadow-md">
            <View className="flex-row justify-between items-center mb-2">
              <View>
                <Text className="text-white text-lg font-semibold">
                  {lesson.class_.class_name} - {lesson.subject}
                </Text>
                <Text className="text-subtext text-sm mt-1">
                  {new Date(lesson.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -{" "}
                  {new Date(lesson.end_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => toggleExpand(lesson.id)}
                className="p-2"
              >
                {isExpanded ? (
                  <ChevronUp color="#7AC8F9" size={24} />
                ) : (
                  <ChevronDown color="#7AC8F9" size={24} />
                )}
              </TouchableOpacity>
            </View>

            {isExpanded && (
              <View className="mt-2 space-y-3">
                {sortedAttendances.map((attendance: IAttendanceCompact) => (
                  <TeacherAttendanceListItem
                      key={`${lesson.id}-${attendance.id}`}
                      attendance={attendance}
                      teacher_id={lesson.teacher.id}
                      dateStr={formattedLesonDate}
                  />
                 ))}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default TeacherAttendanceList;
