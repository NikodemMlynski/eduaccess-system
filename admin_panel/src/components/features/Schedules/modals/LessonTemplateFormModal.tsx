// LessonTemplateModal.tsx
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {ReactNode, useState} from "react";
import {ILessonTemplate, ILessonTemplateIn} from "@/types/schedule.ts";
import {useRooms} from "@/hooks/rooms.ts";
import {IRoom} from "@/types/rooms.ts";
import {useAuth} from "@/context/AuthProvider.tsx";
import {useClasses} from "@/hooks/classes.ts";
import {useUsers} from "@/hooks/users.ts";
import {ITeacher} from "@/types/Teacher.ts";
import LessonTemplateSelect from "@/components/features/Schedules/selecters/LessonTemplateSelect.tsx";
import {SelectItem} from "@/components/ui/select.tsx";
import {useCreateScheduleTemplate, useUpdateScheduleTemplate, weekdays} from "@/hooks/scheduleTemplate.ts";
import {toast} from "react-toastify";
import {InputContainer} from "@/components/features/Schedules/modals/Inputs/InputContainer.tsx";

const lessonTemplateSchema = z.object({
  class_id: z.coerce.number().min(1, "Class ID is required"),
  room_id: z.coerce.number().min(1, "Room ID is required"),
  teacher_id: z.coerce.number().min(1, "Teacher ID is required"),
  subject: z.string().min(1, "Subject is required"),
  weekday: z.coerce.number().min(0).max(6, "Weekday must be between 0 (Sunday) and 6 (Saturday)"),
  start_time: z.string().regex(/^\d{2}:\d{2}$/, "Start time must be in HH:MM format"),
  end_time: z.string().regex(/^\d{2}:\d{2}$/, "End time must be in HH:MM format"),
});

type LessonTemplateFormData = z.infer<typeof lessonTemplateSchema>;

interface LessonTemplateFormModalProps {
  class_?: {
      classId?: number;
      className?: string;
  };
  room?: {
      roomId?: number;
      roomName?: string;
  };
  teacher?: {
      teacherId?: number;
      fullName?: string;
  }
  lessonTemplateData?: ILessonTemplate;
  children: ReactNode
}

export default function LessonTemplateFormModal({
    class_,
    room,
    teacher,
    lessonTemplateData,
    children
}: LessonTemplateFormModalProps) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          {
              children
          }
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{lessonTemplateData ? "Update" : "Add"} lesson template
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
        </DialogHeader>
        <LessonTemplateInnerForm
            class_={class_}
            room={room}
            teacher={teacher}
            lessonTemplateData={lessonTemplateData}
            onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

const LessonTemplateInnerForm = ({
    class_,
    room,
    teacher,
    lessonTemplateData,
    onClose
}: Omit<LessonTemplateFormModalProps, "children"> & {onClose: () => void}) => {
    const {user, token} = useAuth();
  const id = class_?.classId ? class_?.classId : room?.roomId ? room?.roomId : teacher?.teacherId ? teacher?.teacherId : 0;
  const type = class_?.classId ? "classes" : room?.roomId ? "rooms" : teacher?.teacherId ? "teachers" : "classes";
  const createScheduleTemplateMutation = useCreateScheduleTemplate(
      `school/${user?.school_id}/lesson_templates`,
      type,
      token || "",
      id
  )
    const updateScheduleTemplateMutation = useUpdateScheduleTemplate(
      `school/${user?.school_id}/lesson_templates`,
      type,
      token || "",
      lessonTemplateData?.id,
  )
  const {data: rooms, isLoading: isRoomsLoading, isError: isRoomsError} = useRooms<IRoom>(
      `school/${user?.school_id}/rooms`,
      token || ""
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
    const formattedLessonTemplateData: ILessonTemplateIn | null = lessonTemplateData ? {
        class_id: lessonTemplateData.class_.id,
        room_id: lessonTemplateData.room.id,
        teacher_id: lessonTemplateData.teacher.id,
        subject: lessonTemplateData.subject,
        start_time: lessonTemplateData?.start_time,
        end_time: lessonTemplateData?.end_time,
        weekday: lessonTemplateData?.weekday,
    } : null;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<LessonTemplateFormData>({
    resolver: zodResolver(lessonTemplateSchema),
    defaultValues: {
      class_id: class_?.classId,
      room_id: room?.roomId,
      teacher_id: teacher?.teacherId,
      ...formattedLessonTemplateData
    }
  });
  const onSubmit = (data: LessonTemplateFormData) => {
    console.log("Submitted data:", data);
    if (lessonTemplateData) {
        updateScheduleTemplateMutation.mutate(data, {
            onSuccess: () => {
                toast.success("Lesson template updated successfully");
                onClose();
                reset();
            },
            onError: (error) => {
                toast.error(error.message || "Failed to update lesson template");
            }
        })
    } else {
        createScheduleTemplateMutation.mutate(data, {
            onSuccess: () => {
                toast.success("Lesson template created successfully");
                onClose();
                reset();
            },
            onError: (error) => {
                toast.error(error.message || "Failed to create lesson template");
            }
        })
    }
    onClose();
    reset();
  };

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
                    defaultValue={formattedLessonTemplateData?.class_id}
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
                    defaultValue={formattedLessonTemplateData?.room_id}
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
                    defaultValue={formattedLessonTemplateData?.teacher_id}
                />
              )
          }
              <LessonTemplateSelect
                  isLoading={false}
                  isError={false}
                  errorMessage={""}
                  content={
                  <>
                  {
                      weekdays.map((weekday, index) => (
                          <SelectItem value={`${index}`} key={`${index}`}>{weekday}</SelectItem>
                      ))
                  }
                  </>
                  }
                  onValueChange={(weekdayIndex) => setValue("weekday", Number(weekdayIndex))}
                  onButtonClick={() => {}}
                  label={"Select weekday"}
                  isSearch={false}
                  defaultValue={formattedLessonTemplateData?.weekday}
                  />
              <InputContainer register={register} errors={errors} name={"subject"} label={"Enter subject"}/>
              <InputContainer register={register} errors={errors} name={"start_time"} label={"Enter start time"} type={"time"}/>
              <InputContainer register={register} errors={errors} name={"end_time"} label={"Entr end time"} type={"time"}/>

          <DialogFooter>
            <Button type="submit">Zapisz</Button>
          </DialogFooter>
        </form>
    )
}