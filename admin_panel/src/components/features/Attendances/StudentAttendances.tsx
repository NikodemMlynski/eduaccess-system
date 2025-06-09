import {IAttendance} from "@/types/Attendance.ts";
import StudentAttendanceItem from "@/components/features/Attendances/StudentAttendanceItem.tsx";

interface StudentAttendancesProps {
    attendances: IAttendance[];
}

const StudentAttendances = ({
    attendances
}: StudentAttendancesProps) => {

  return (
    <div className="space-y-2 w-[400px] mx-auto">
      {attendances.map((attendance) => (
        <StudentAttendanceItem key={attendance.id} attendance={attendance}/>
      ))}
    </div>
  );
};
export default StudentAttendances;