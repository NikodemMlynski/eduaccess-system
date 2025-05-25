import {z} from "zod";
import {ILessonInstance, ILessonInstanceIn} from "@/types/schedule.ts";
import {ReactNode, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog.tsx";
import LessonTemplateSelect from "@/components/features/Schedules/selecters/LessonTemplateSelect.tsx";
import {SelectItem} from "@/components/ui/select.tsx";
import {useRooms} from "@/hooks/rooms.ts";
import {IRoom} from "@/types/rooms.ts";
import {useClasses} from "@/hooks/classes.ts";
import {useUsers} from "@/hooks/users.ts";
import {ITeacher} from "@/types/Teacher.ts";
import {useAuth} from "@/context/AuthProvider.tsx";
import {useCreateLessonInstance, useUpdateLessonInstance} from "@/hooks/scheduleLesson.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {InputContainer} from "@/components/features/Schedules/modals/Inputs/InputContainer.tsx";
import LessonInstanceTimeInput from "@/components/features/Schedules/modals/Inputs/LessonInstanceTimeInput.tsx";
import {format} from "date-fns";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "react-toastify";

function formatLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // miesiące od 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}


const lessonInstanceSchema = z.object({
    template_id: z.coerce.number().min(1, "Template ID is required"),
    class_id: z.coerce.number().min(1, "Class ID is required"),
    room_id: z.coerce.number().min(1, "Room ID is required"),
    teacher_id: z.coerce.number().min(1, "Teacher ID is required"),
    subject: z.string().min(1, "Subject is required"),
    start_time: z.date().min(new Date(), "Start time is required"),
    end_time: z.date().min(new Date(), "End time is required"),
})

type LessonInstanceFormData = z.infer<typeof lessonInstanceSchema>;

interface LessonInstanceFormModalProps {
    class_?: {
        classId?: number;
        className?: string;
    }
    room?: {
        roomId?: number;
        roomName?: string;
    }
    teacher?: {
        teacherId?: number;
        fullName?: string;
    }
    lessonInstanceData?: ILessonInstance;
    children: ReactNode
}

export default function LessonInstanceFormModal({
    class_,
    room,
    teacher,
    lessonInstanceData,
    children
}: LessonInstanceFormModalProps) {
    const [open, setOpen] = useState(false);
    return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {
                children
            }
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{lessonInstanceData ? "Update" : "Add"} lesson instance
                {
                  class_?.classId && ` for class ${class_?.className}`
                }
                {
                  room?.roomId && ` for room ${room?.roomName}`
                }
                {
                  teacher?.teacherId && ` for teacher ${teacher?.fullName}`
                }
                </DialogTitle>
                <LesonInstanceInnerForm
                    class_={class_}
                    room={room}
                    teacher={teacher}
                    lessonInstanceData={lessonInstanceData}
                    onClose={() => setOpen(false)}
                />
            </DialogHeader>

        </DialogContent>
    </Dialog>
    )
}

const LesonInstanceInnerForm = ({
    class_,
    room,
    teacher,
    lessonInstanceData,
    onClose
}: Omit<LessonInstanceFormModalProps, "children"> & { onClose: () => void })=>  {
    const {user, token} = useAuth();
    const createLessonInstanceMutation = useCreateLessonInstance(
        `school/${user?.school_id}/lesson_instances`,
        token || ""
    )
    const updateLessonInstanceMutation = useUpdateLessonInstance(
        `school/${user?.school_id}/lesson_instances`,
        token || "",
        lessonInstanceData?.id,
    )
    const {data: rooms, isLoading: isRoomsLoading, isError: isRoomsError} = useRooms<IRoom>(
      `school/${user?.school_id}/rooms`,
      token || "",
        {
            paginated: false,
        }
    )
    const {data: classes, isLoading: isClassesLoading, isError: isClassesError} = useClasses(
      `school/${user?.school_id}/classes`,
      token || ""
    )

    const {data: teachers, isLoading: isTeachersLoading, isError: isTeachersError} = useUsers<ITeacher>(
      `school/${user?.school_id}/teachers`,
      token || "",
      "teacher"
    )
    const formattedLessonInstanceData: ILessonInstanceIn | null = lessonInstanceData ? {
        template_id: lessonInstanceData.template_id,
        class_id: lessonInstanceData.class_.id,
        room_id: lessonInstanceData.room.id,
        teacher_id: lessonInstanceData.teacher.id,
        subject: lessonInstanceData.subject,
        start_time: lessonInstanceData?.start_time,
        end_time: lessonInstanceData?.end_time,
    } : null;
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<LessonInstanceFormData>({
        resolver: zodResolver(lessonInstanceSchema),
        defaultValues: {
            class_id: class_?.classId,
            room_id: room?.roomId,
            teacher_id: teacher?.teacherId,
            ...formattedLessonInstanceData
        }
    })

    const handleTimeChange = (identifier: "start_time" | "end_time", time: string, date: Date | null) => {
        if (!date) return;
        const formated = new Date(date);
        const [hours, minutes] = time.split(":");
        formated.setHours(+hours);
        formated.setMinutes(+minutes);
        setValue(identifier, formated);
    }
    const onSubmit = (data: LessonInstanceFormData) => {
        if(lessonInstanceData) {
            const start_time = new Date(data.start_time);
            console.log(start_time.toLocaleString())
            const formatedData = {
                ...data,
                start_time: formatLocalDate(new Date(data.start_time)),
                end_time: formatLocalDate(new Date(data.end_time)),
            }
            updateLessonInstanceMutation.mutate(formatedData, {
                onSuccess: () => {
                    toast.success("Lesson instance updated successfully");
                    onClose();
                    reset();
                },
                onError: (error) => {
                    toast.error(error.message || "Failed to update lesson instance")
                }
            })
            console.log(data);
        } else {
            createLessonInstanceMutation.mutate(data, {
                onSuccess: () => {
                toast.success("Lesson template created successfully");
                onClose();
                reset();
            },
            onError: (error) => {
                toast.error(error.message || "Failed to create lesson instance");
            }
            })
        }
        onClose();
        reset();
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {
            !class_?.classId && (
                <LessonTemplateSelect
                    isLoading={isClassesLoading}
                    isError={isClassesError}
                    errorMessage={"Failed to fetch classes"}
                    content={
                      <>
                      {
                        classes && classes.map((class_) => (
                              <SelectItem value={`${class_.id}`} key={`${class_.id}`}>{class_.class_name}</SelectItem>
                          ))
                      }
                      </>
                    }
                    onValueChange={(id) => setValue("class_id", Number(id))}
                    onButtonClick={() => {}}
                    label={"Select class"}
                    isSearch={false}
                    defaultValue={formattedLessonInstanceData?.class_id}
                />
              )
          }
          {
            !room?.roomId && (
                <LessonTemplateSelect
                    isLoading={isRoomsLoading}
                    isError={isRoomsError}
                    errorMessage={"Failed to fetch rooms"}
                    content={
                      <>
                      {
                        rooms && rooms.rooms.map((room) => (
                              <SelectItem value={`${room.id}`} key={`${room.id}`}>{room.room_name}</SelectItem>
                          ))
                      }
                      </>
                    }
                    onValueChange={(id) => setValue("room_id", Number(id))}
                    onButtonClick={() => {}}
                    label={"Select room"}
                    isSearch={false}
                    defaultValue={formattedLessonInstanceData?.room_id}
                />
              )
          }
          {
            !teacher?.teacherId && (
                <LessonTemplateSelect
                    isLoading={isTeachersLoading}
                    isError={isTeachersError}
                    errorMessage={"Failed to fetch teachers"}
                    content={
                      <>
                      {
                        teachers && teachers.users.map((teacher) => (
                              <SelectItem value={`${teacher.id}`} key={`${teacher.id}`}>{teacher.user.first_name} {teacher.user.last_name}</SelectItem>
                          ))
                      }
                      </>
                    }
                    onValueChange={(id) => setValue("teacher_id", Number(id))}
                    onButtonClick={() => {}}
                    label={"Select teacher"}
                    isSearch={false}
                    defaultValue={formattedLessonInstanceData?.teacher_id}
                />
              )
          }
            <InputContainer register={register} errors={errors} label={"Enter subject"} name={"subject"} />
            <div className="flex space-y-4">
                <LessonInstanceTimeInput
                    identifier={"start_time"}
                    time={format(new Date(lessonInstanceData?.start_time || 0), "HH:mm")}
                    date={new Date(lessonInstanceData?.start_time || 0)}
                    setTimeAndDate={handleTimeChange}
                />
                <LessonInstanceTimeInput
                    identifier={"end_time"}
                    time={format(new Date(lessonInstanceData?.end_time || 0), "HH:mm")}
                    date={new Date(lessonInstanceData?.end_time || 0)}
                    setTimeAndDate={handleTimeChange}
                />
            </div>
                <DialogFooter>
                    <Button>Zapisz</Button>
                </DialogFooter>
            </form>
    )
}