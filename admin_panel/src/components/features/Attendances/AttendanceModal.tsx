import {Button} from "@/components/ui/button.tsx";
import {Check, Clock, X} from "lucide-react";
import {DialogContent} from "@/components/ui/dialog.tsx";
import {IAttendanceRaw, IAttendanceStatus} from "@/types/Attendance.ts";

interface AttendanceModalProps {
    selectedStatus: IAttendanceStatus | null;
    handleStatusClick: (status: IAttendanceStatus) => void;
    att: IAttendanceRaw | null;
    handleClick: (
        type: "update" | "create",
        lesson_id: number,
        student_id: number) => void;
    lesson_id: number;
    student_id: number;
}

const AttendanceModal = ({
    selectedStatus,
    handleStatusClick,
    att,
    handleClick,
    lesson_id,
    student_id,
}: AttendanceModalProps) => {
    return (
        <DialogContent className="w-[250px] h-[150px] p-4 py-10 flex flex-col gap-1">
          <div className="flex justify-around mb-4">
            <Button
              variant={selectedStatus === "present" ? "default" : "outline"}
              className="px-2"
              onClick={() => handleStatusClick("present")}
            >
              <Check className="text-green-600" />
            </Button>
            <Button
              variant={selectedStatus === "late" ? "default" : "outline"}
              className="px-2"
              onClick={() => handleStatusClick("late")}
            >
              <Clock className="text-yellow-600" />
            </Button>
            <Button
              variant={selectedStatus === "absent" ? "default" : "outline"}
              className="px-2"
              onClick={() => handleStatusClick("absent")}
            >
              <X className="text-red-600" />
            </Button>
          </div>

          <Button onClick={() =>
              handleClick(att ? "update" : "create", lesson_id, student_id)} className="w-full cursor-pointer">
            Ustaw
          </Button>
        </DialogContent>
    )
}

export default AttendanceModal;