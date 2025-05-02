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
    const [confirmInput, setConfirmInput] = useState("");
    const [fields, setFields] = useState<Field[]>([
        {name: "first_name", label: "First name", value: student.user.first_name},
        {name: "last_name", label: "Last name", value: student.user.last_name},
        {name: "email", label: "Email", value: student.user.email}
    ])
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
        </CardContent>
    </Card>
  )
}

export default Student