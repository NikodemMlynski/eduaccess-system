import { IClass } from "@/types/Class";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useDeleteClass } from "@/hooks/classes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { DeleteModal } from "@/components/utils/deleteModal";

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
          <Card key={schoolClass.id} className="relative">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold">
                    Klasa {schoolClass.class_name}
                  </h2>
                  <p>Liczba uczniów: To się obliczy</p>
                </div>
                <DeleteModal
                confirmInput={confirmInput}
                setConfirmInput={setConfirmInput}
                selectedItemId={schoolClass.id}
                setSelectedItemId={setSelectedClassId}
                valueToConfirm={schoolClass.class_name}
                handleDelete={handleDelete}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
