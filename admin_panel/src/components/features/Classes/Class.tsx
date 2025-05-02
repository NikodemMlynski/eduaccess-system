import { Card, CardContent } from "@/components/ui/card";
import { DeleteModal } from "@/components/utils/deleteModal";
import { Field, UpdateModal } from "@/components/utils/UpdateModal";
import { useAuth } from "@/context/AuthProvider";
import { useDeleteClass, useUpdateClass } from "@/hooks/classes";
import { IClass, IClassIn } from "@/types/Class";
import { useState } from "react";


interface ClassProps {
    class_: IClass
}

export default function Class({class_}: ClassProps) {
    const {user, token} = useAuth();
    const [fields, setFields] = useState<Field[]>([
        {name: "class_name", label: "Class Name", value: class_.class_name}
    ]);
  const deleteClass = useDeleteClass(user?.school_id, token || "");
  const updateClass = useUpdateClass(user?.school_id, token || "");

    const [confirmInput, setConfirmInput] = useState("");
    
    const handleDelete = () => {
        if (class_.id) {
          deleteClass.mutate(class_.id);
          setConfirmInput("");
        }
    };

    const handleUpdate = () => {
        const updatedClassData: IClassIn = Object.fromEntries(
            fields.map(f => [f.name, f.value])
        )
        updateClass.mutate({
          id: class_.id,
          updates: updatedClassData
      });
      
    }

    return (
        <Card key={class_.id} className="relative">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold">
                    Class {class_.class_name}
                  </h2>
                  <p>Number of students: TO DO</p>
                </div>
                <div className="flex gap-5">
                    
                <UpdateModal
                fields={fields}
                onSubmit={handleUpdate}
                setFields={setFields}
                title="Update class"
                />
                <DeleteModal
                confirmInput={confirmInput}
                setConfirmInput={setConfirmInput}
                valueToConfirm={class_.class_name}
                handleDelete={handleDelete}
                item_name="Class"
                />
                </div>
              </div>
            </CardContent>
          </Card>
    )
}