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

interface ClassesProps {
  schoolClasses: IClass[];
}

export default function Classes({ schoolClasses }: ClassesProps) {
  const { user, token } = useAuth();
  const deleteClass = useDeleteClass(user?.school_id, token || "");

  const [selectedClass, setSelectedClass] = useState<IClass | null>(null);
  const [confirmInput, setConfirmInput] = useState("");

  const handleDelete = () => {
    if (selectedClass) {
      deleteClass.mutate(selectedClass.id);
      setSelectedClass(null);
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setSelectedClass(schoolClass);
                        setConfirmInput("");
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Usuń klasę</DialogTitle>
                      <DialogDescription>
                        Ta operacja jest nieodwracalna. Aby potwierdzić, wpisz nazwę klasy: <strong>{schoolClass.class_name}</strong>
                      </DialogDescription>
                    </DialogHeader>

                    <Input
                      placeholder={`Wpisz: ${schoolClass.class_name}`}
                      value={confirmInput}
                      onChange={(e) => setConfirmInput(e.target.value)}
                    />

                    <DialogFooter>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSelectedClass(null);
                          setConfirmInput("");
                        }}
                      >
                        Anuluj
                      </Button>
                      <Button
                        variant="destructive"
                        disabled={confirmInput !== schoolClass.class_name}
                        onClick={handleDelete}
                      >
                        Usuń
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
