import {Check, X, Clock, Plus, SquarePen} from "lucide-react";
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
import {Button} from "@/components/ui/button.tsx";

const attendanceStatusDictionary = {
  "absent": (
      <div className="text-red-600">
        <X className="mx-auto h-6 w-6" />
      </div>
),
  "present": (
      <div className="text-green-600">
        <Check className="mx-auto h-6 w-6" />
      </div>
  ),
  "delayed": (
      <div className="text-yellow-600">
        <Clock className="mx-auto h-6 w-6" />
      </div>
  )
}

interface Props {
  students: IStudent[];
  lessonInstances: ILessonInstance[];
  attendances: IAttendanceRaw[];
}

interface IAttandanceCell {
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

  const handleAddClick = (lessonId?: number, studentId?: number) => {
    console.log(lessonId);
    console.log(studentId);
    alert("Tutaj trzeba zrobić dodawanie frekwencji")
  }

   const handleEditClick = (attendanceId?: number) => {
    console.log(attendanceId);
    alert("Tutaj trzeba zrobić dodawanie frekwencji")
  }


  return (
    <div className="overflow-x-auto">
      <Table>
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
                  <TableCell key={lessonIndex} className="text-center border relative">
                    <div className="flex items-center justify-center py-1">
                    {att ? (
                      <>
                        {attendanceStatusDictionary[att.status]}
                        <SquarePen onClick={() => handleEditClick(att.id)} className="absolute top-3 right-2 cursor-pointer"/>
                      </>
                    ) : (
                      <Plus onClick={() => handleAddClick(lessonColumn[studentIndex].lesson_id, lessonColumn[studentIndex].student_id)} className="cursor-pointer">Add button</Plus>
                    )}

                    </div>
                  </TableCell>
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
