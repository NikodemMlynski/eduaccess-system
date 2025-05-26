import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IClass } from "@/types/Class";
import { IStudent } from "@/types/Student"
import { useState } from "react";
import {format} from "date-fns"
import { DeleteModal } from "@/components/utils/deleteModal";
import { Field, UpdateModal } from "@/components/utils/UpdateModal";
import { UpdateUserInput, useDeleteUser, useUpdateUser } from "@/hooks/users";
import { useAuth } from "@/context/AuthProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Button} from "@/components/ui/button.tsx";
import {useAssignStudentToClass, useClasses, useRemoveStudentsFromClass} from "@/hooks/classes.ts";
import {Input} from "@/components/ui/input.tsx";
interface StudentProps {
    student: IStudent;
    studentClass?: IClass | null;
}
const Student = ({
    student,
    studentClass
}: StudentProps) => {
    const navigate = useNavigate();
    const {user, token} = useAuth();
    const assignUserToClassMutation = useAssignStudentToClass(user?.school_id, token || "");
    const removeUserFromClassMutation = useRemoveStudentsFromClass(user?.school_id, token || "")
    const [confirmInput, setConfirmInput] = useState("");
    const [fields, setFields] = useState<Field[]>([
        {name: "first_name", label: "First name", value: student.user.first_name},
        {name: "last_name", label: "Last name", value: student.user.last_name},
        {name: "email", label: "Email", value: student.user.email}
    ])

    const {data: classesData,
        isLoading: classesIsLoading,
        isError: classesIsError,
    } = useClasses(`school/${user?.school_id}/classes`, token || "");
    const [selectedClassId, setSelectedClassId] = useState<number | undefined>(undefined);

    console.log(classesData);
    const queryClient = useQueryClient();
    const deleteStudent = useDeleteUser(`school/${user?.school_id}/students`, token || "");
    const updateStudent = useUpdateUser(`school/${user?.school_id}/students`, token || "");


    const handleDelete = () => {
        deleteStudent.mutate(student.id, {
            onSuccess: () => {
                toast.success("Student successfully deleted");
                navigate("/students");
            },
            onError: (error) => {
                toast.error("Failed to update student");
                console.log(error);
            }
        })
    }

    const handleUpdate = () => {
        const updatedStudentData: UpdateUserInput = Object.fromEntries(
            fields.map(f => [f.name, f.value])
        )
        updateStudent.mutate({
            id: student.id,
            data: updatedStudentData
        }, {
            onSuccess: () => {
                const key = ["users", "student", student.id] as const;
                toast.success("Successfully update student");
                queryClient.invalidateQueries(key);
                console.log(key);
            },
            onError: (error) => {
                alert("Failed to update student");
                console.log(error);
            }
        })
    }

    const handleAssignUserToClass = () => {
        assignUserToClassMutation.mutate({
            studentId: student.id,
            classId: selectedClassId
        }, {
            onSuccess: () => {
                const key = ["users", "student", student.id] as const;
                toast.success("Successfully assign student to class");
                queryClient.invalidateQueries(key);
                console.log(key);
            },
            onError: (error) => {
                toast.error("Failed to assigned student to class");
                console.log(error);
            }
            }
        )
    }

    const handleRemoveUserFromClass = () => {
        removeUserFromClassMutation.mutate({
            studentId: student.id,
            classId: studentClass?.id
        }, {
            onSuccess: () => {
                const key = ["users", "student", student.id] as const;
                toast.success("Successfully removed student from class");
                queryClient.invalidateQueries(key);
                console.log(key);
            },
            onError: (error) => {
                toast.error("Failed to remove student from class");
                console.log(error);
            }
        })
    }
    const fullName = `${student.user.first_name} ${student.user.last_name}`
  return (
    <Card className="bg-white text-gray-800 border shadow-md rounded-2xl p-6 ">
        <CardHeader>
            <CardTitle className="text-xl font-semibold">{fullName}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
            <p><span className="font-medium">Email: </span>{student.user.email}</p>
            <p><span className="font-medium">Creation Date: </span>{format(new Date(student.user.created_at), "yyyy-MM-dd HH:mm")}</p>
            <p>
                <span className="font-medium">Class: </span>{" "}
                {studentClass ? studentClass.class_name : (
                    <span className="italic text-gray-500 ">Not assigned</span>
                )}
            </p>
            <div className="flex gap-4 pt-4">
                <DeleteModal
                confirmInput={confirmInput}
                setConfirmInput={setConfirmInput}
                valueToConfirm={fullName}
                handleDelete={handleDelete}
                item_name="Student"
                />
                <UpdateModal
                fields={fields}
                onSubmit={handleUpdate}
                setFields={setFields}
                title="Update Student"
                />
            </div>
            <div className="flex flex-col gap-4 lg:w-[50%] py-4 pt-8">
                <div className="flex gap-4 justify-around">
                <Select onValueChange={(value) => setSelectedClassId(+value)}>

                    <SelectTrigger className="w-[250px]">
                        <SelectValue placeholder="Class" />
                    </SelectTrigger>
                    {
                        classesIsLoading ? <SelectContent>Loading...</SelectContent>
                            : classesIsError ? <SelectContent>Error</SelectContent> : (
                            <SelectContent  className="cursor-pointer">
                                {
                                    classesData && classesData.map((class_) => (
                                        <SelectItem className="cursor-pointer" key={class_.id} value={`${class_.id}`}>{class_.class_name}</SelectItem>
                                    ))
                                }


                            </SelectContent>
                        )
                    }

                </Select>
                <Button
                    className="cursor-pointer"
                    onClick={handleAssignUserToClass}
                >Assign to class</Button>
                </div>

                {
                    studentClass?.class_name && (<div className="flex justify-around">
                    <h3 className="p-2 text-md font-semibold">Delete {student.user.first_name} from {studentClass?.class_name}</h3>
                    <Button
                        onClick={handleRemoveUserFromClass}
                        className="cursor-pointer"
                    >Delete</Button>
                    </div>)
                }

            </div>
        </CardContent>
    </Card>
  )
}

export default Student