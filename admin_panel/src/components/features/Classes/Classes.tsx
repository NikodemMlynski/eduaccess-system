import { IClass } from "@/types/Class";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthProvider";
import { useDeleteClass } from "@/hooks/classes";

import { useState } from "react";
import { DeleteModal } from "@/components/utils/deleteModal";
import Class from "./Class";

interface ClassesProps {
  schoolClasses: IClass[];
}

export default function Classes({ schoolClasses }: ClassesProps) {
  const { user, token } = useAuth();
  const deleteClass = useDeleteClass(user?.school_id, token || "");

  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [confirmInput, setConfirmInput] = useState("");

  const handleDelete = () => {
    if (selectedClassId) {
      deleteClass.mutate(selectedClassId);
      setSelectedClassId(null);
      setConfirmInput("");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schoolClasses.map((schoolClass) => (
          <Class key={schoolClass.id} class_={schoolClass}/>
        ))}
      </div>
    </>
  );
}
