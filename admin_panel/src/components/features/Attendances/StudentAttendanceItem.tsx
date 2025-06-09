import {Card, CardContent} from "@/components/ui/card.tsx";
import {ClockIcon} from "lucide-react";
import {format} from "date-fns";
import {attendanceStatusDictionary} from "@/components/features/Attendances/AttendanceItem.tsx";
import {Button} from "@/components/ui/button.tsx";
import {IAttendance, IAttendanceIn, IAttendanceRaw, IAttendanceStatus} from "@/types/Attendance.ts";
import {useUpdateAttendance} from "@/hooks/attendances.ts";
import {useAuth} from "@/context/AuthProvider.tsx";
import {useState} from "react";
import {Dialog, DialogContent, DialogTrigger} from "@/components/ui/dialog.tsx";
import AttendanceModal from "@/components/features/Attendances/AttendanceModal.tsx";
import {toast} from "react-toastify";
import {useQueryClient} from "@tanstack/react-query";

interface StudentAttendanceItemProps {
    attendance: IAttendance;
}
const StudentAttendanceItem = ({
    attendance
}: StudentAttendanceItemProps) => {
    const queryClient = useQueryClient();
    const {user, token} = useAuth();
    const {
        mutate: updateAttendanceMutation,
        isPending: updateIsPending
    } = useUpdateAttendance(
        `school/${user?.school_id}/attendances`,
        token || "",
        attendance?.id
    )
    const [open, setOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<IAttendanceStatus | null>(null);

    const attendanceRaw: IAttendanceRaw = {
        lesson_id: attendance.lesson.id,
        student_id: attendance.student.id,
        created_at: attendance.created_at,
        id: attendance.id,
        status: attendance.status,
        manual_adjustment: attendance.manual_adjustment
    }

    const handleClick = () => {
        if (!selectedStatus) return;
        const data: IAttendanceIn = {
            student_id: attendanceRaw.student_id,
            lesson_id: attendanceRaw.lesson_id,
            manual_adjustment: true,
            status: selectedStatus
        }
        updateAttendanceMutation(data, {
            onSuccess: () => {
                toast.success("Attendance updated successfully.");
                setOpen(false)
                queryClient.invalidateQueries([""])
            },
            onError: () => {
                toast.error("Attendance update failed");
                setOpen(false)
            }
        })
    }
    return (
        <Card key={attendance.id} className="flex items-center justify-center p-0">
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
          <CardContent className="p-3 flex justify-around items-center w-full">
            <div>
              <div className="text-lg font-semibold">{attendance.lesson.subject}</div>
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                {format(new Date(attendance.lesson.start_time), "HH:mm")} -
                {format(new Date(attendance.lesson.end_time), "HH:mm")}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Status:</span>
              {attendanceStatusDictionary[attendance.status]}
            </div>
            <Button variant="outline" size="sm">
                {updateIsPending ? "Pending..." : "Edytuj"}
            </Button>
          </CardContent>
            </DialogTrigger>
            <AttendanceModal
                selectedStatus={selectedStatus}
                handleStatusClick={setSelectedStatus}
                att={attendanceRaw}
                handleClick={handleClick}
                lesson_id={attendanceRaw.lesson_id}
                student_id={attendanceRaw.student_id}
                />
        </Dialog>
        </Card>

    )
}

export default StudentAttendanceItem;