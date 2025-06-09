import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IAttendanceRaw } from "@/types/Attendance.ts";
import { FC, useMemo } from "react";
import { IStudent } from "@/types/Student.ts";
import { ILessonInstance } from "@/types/schedule.ts";
import AttendanceItem from "@/components/features/Attendances/AttendanceItem.tsx";

interface Props {
  students: IStudent[];
  lessonInstances: ILessonInstance[];
  attendances: IAttendanceRaw[];
}

export interface IAttandanceCell {
  student_id: number;
  lesson_id: number;
  attendance: IAttendanceRaw | null;
}

const AttendancesTable: FC<Props> = ({
  students,
  lessonInstances,
  attendances,
}) => {
  const sortedLessons = useMemo(
    () =>
      [...lessonInstances].sort(
        (a, b) =>
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      ),
    [lessonInstances]
  );

  // lessonTable: [lesson][student] = attendanceCell
  const lessonTable: IAttandanceCell[][] = sortedLessons.map((lesson) => {
    return students.map((student) => {
      const attendance = attendances.find(
        (att) =>
          att.lesson_id === lesson.id && att.student_id === student.id
      );
      return {
        student_id: student.id,
        lesson_id: lesson.id,
        attendance: attendance || null,
      };
    });
  });
  console.log(lessonTable);

  return (
    <div className="overflow-x-auto">
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Uczeń</TableHead>
            {sortedLessons.map((lesson) => (
              <TableHead
                key={lesson.id}
                className="whitespace-nowrap text-center"
              >
                {lesson.subject}
                <br />
                <span className={"text-muted-foreground text-xs"}>
                  {new Date(lesson.start_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" - "}
                {new Date(lesson.end_time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student, studentIndex) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium border whitespace-nowrap">
                {student.user.first_name} {student.user.last_name}
              </TableCell>
              {lessonTable.map((lessonColumn, lessonIndex) => {
                const cell = lessonColumn[studentIndex]; // ← dostęp do danych danego ucznia w danej lekcji
                const att = cell?.attendance;
                return (
                 <AttendanceItem
                     key={`${student.id}-${lessonColumn[studentIndex].lesson_id}`}
                     lessonIndex={lessonIndex}
                     att={att}
                     lessonId={lessonColumn[studentIndex].lesson_id}
                     studentId={lessonColumn[studentIndex].student_id}
                     />
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendancesTable;

