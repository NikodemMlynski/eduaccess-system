import {Check, Clock, Plus, SquarePen, X} from "lucide-react";
import {IAttendanceIn, IAttendanceRaw, IAttendanceStatus} from "@/types/Attendance.ts";
import {TableCell} from "@/components/ui/table.tsx";
import {IAttandanceCell} from "@/components/features/Attendances/AttendancesClassTable.tsx";
import {useCreateAttendances, useUpdateAttendance} from "@/hooks/attendances.ts";
import {useAuth} from "@/context/AuthProvider.tsx";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog.tsx";
import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "react-toastify";

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
  "late": (
      <div className="text-yellow-600">
        <Clock className="mx-auto h-6 w-6" />
      </div>
  )
}

interface IAttendanceItemProps {
  lessonIndex: number;
  att: IAttendanceRaw | null;
  lessonColumn: IAttandanceCell[];
  studentIndex: number;
}



const AttendanceItem = ({
    lessonColumn,
    lessonIndex,
    att,
    studentIndex
}: IAttendanceItemProps) => {
    const {user, token} = useAuth();
    const {
        mutate: createAttendanceMutation,
        isPending: createIsPending
    } = useCreateAttendances(
        `school/${user?.school_id}/attendances`,
        token || "",
    );
    const {
        mutate: updateAttendanceMutation,
        isPending: updateIsPending
    } = useUpdateAttendance(
        `school/${user?.school_id}/attendances`,
        token || "",
        att?.id
    )
    const [open, setOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<IAttendanceStatus | null>(null);

    const handleStatusClick = (status: "present" | "absent" | "late") => {
        setSelectedStatus(status);
    };

    const handleClick = (type: "update" | "create", lessonId?: number, studentId?: number) => {
        if (!selectedStatus || !lessonId || !studentId) return;
        const data: IAttendanceIn = {
            lesson_id: lessonId,
            student_id: studentId,
            status: selectedStatus,
            manual_adjustment: true
        }
        if(type === "update") {
            updateAttendance(data);
        } else {
            createAttendance(data)
        }
    }

    const createAttendance = (data: IAttendanceIn) => {
        createAttendanceMutation(data, {
            onSuccess: () => {
                toast.success("Attendance added successfully.");
                setOpen(false)
            },
            onError: () => {
                toast.error("Attendance added failed");
                setOpen(false)
            }
        })
    }

    const updateAttendance = (data: IAttendanceIn) => {
        updateAttendanceMutation(data, {
            onSuccess: () => {
                toast.success("Attendance updated successfully.");
                setOpen(false)
            },
            onError: () => {
                toast.error("Attendance update failed");
                setOpen(false)
            }
        })
    }

    return (
    <TableCell key={lessonIndex} className="text-center border relative">
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
            <div className="flex items-center justify-center py-1">
                {att ? (
                    <>
                        {attendanceStatusDictionary[att.status]}
                        <SquarePen onClick={() => setOpen(true)}
                                   className="absolute top-3 right-2 cursor-pointer"/>
                    </>
                ) : (
                    <Plus
                        onClick={() => setOpen(true)}
                        className="cursor-pointer">Add button</Plus>
                )}

            </div>
            </DialogTrigger>

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
              handleClick(att ? "update" : "create", lessonColumn[studentIndex].lesson_id, lessonColumn[studentIndex].student_id)} className="w-full cursor-pointer">
            Ustaw
          </Button>
        </DialogContent>
        </Dialog>

    </TableCell>
    )
}

export default AttendanceItem;
