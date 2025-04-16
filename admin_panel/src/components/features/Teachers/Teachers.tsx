"use client";

import { useState } from "react";
import { ITeacher } from "@/types/Teacher";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TeachersProps {
  teachers: ITeacher[];
}

export default function Teachers({ teachers: initialTeachers }: TeachersProps) {
  const [teachers, setTeachers] = useState<ITeacher[]>(initialTeachers);
  const [selectedTeacher, setSelectedTeacher] = useState<ITeacher | null>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });

  const handleOpenDelete = (teacher: ITeacher) => {
    setSelectedTeacher(teacher);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTeacher) {
      alert(`Usunięto nauczyciela: ${selectedTeacher.user.first_name} ${selectedTeacher.user.last_name}`);
      setTeachers((prev) => prev.filter((t) => t.id !== selectedTeacher.id));
      setSelectedTeacher(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleOpenEdit = (teacher: ITeacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      first_name: teacher.user.first_name,
      last_name: teacher.user.last_name,
      email: teacher.user.email,
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = () => {
    if (selectedTeacher) {
      const updatedTeachers = teachers.map((t) =>
        t.id === selectedTeacher.id
          ? {
              ...t,
              user: {
                ...t.user,
                ...formData,
              },
            }
          : t
      );
      setTeachers(updatedTeachers);
      setEditDialogOpen(false);
      alert("Dane nauczyciela zostały zaktualizowane!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teachers List</h1>
      <ScrollArea className="h-[750px] rounded-md border p-4">
        <div className="grid gap-4">
          {teachers.map((teacher) => (
            <Card key={teacher.id} className="shadow-md hover:shadow-lg transition">
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    {teacher.user.first_name} {teacher.user.last_name}
                  </h2>
                  <p className="text-sm text-gray-500">{teacher.user.email}</p>
                  <Badge className="mt-2">{teacher.user.role}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleOpenEdit(teacher)}>
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleOpenDelete(teacher)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Delete confirmation dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Czy na pewno chcesz usunąć tego nauczyciela?</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-gray-600">
            {selectedTeacher?.user.first_name} {selectedTeacher?.user.last_name}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Anuluj
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Usuń
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edytuj nauczyciela</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first_name" className="text-right">
                Imię
              </Label>
              <Input
                id="first_name"
                className="col-span-3"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">
                Nazwisko
              </Label>
              <Input
                id="last_name"
                className="col-span-3"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                className="col-span-3"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Anuluj
            </Button>
            <Button onClick={handleEditSubmit}>Zapisz</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
