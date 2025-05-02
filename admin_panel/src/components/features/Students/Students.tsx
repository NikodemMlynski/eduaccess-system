"use client";

import { useState } from "react";
import { IStudent } from "@/types/Student";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOptimisticUsers } from "@/hooks/useOptimisticUserActions";
import { useAuth } from "@/context/AuthProvider";
import { Link } from "react-router-dom";

interface StudentsProps {
  total_count?: number;
  students: IStudent[];
}

export default function Students({ students: initialStudents, total_count }: StudentsProps) {
  const { user } = useAuth();
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);

  const {
    users: students,
    selectedUser: selectedStudent,
    formData,
    isUpdating,
    isDeleting,
    setFormData,
    setSelectedUser,
    openEdit,
    openDelete,
    handleEditSubmit,
    handleDelete,
  } = useOptimisticUsers<IStudent>(
    initialStudents,
    `school/${user?.school_id}/students`
  );

  const handleOpenEdit = (student: IStudent) => {
    openEdit(student);
    setEditDialogOpen(true);
  };

  const handleOpenDelete = (student: IStudent) => {
    openDelete(student);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    handleDelete(() => setDeleteDialogOpen(false));
  };

  const handleSubmitEdit = () => {
    handleEditSubmit(() => setEditDialogOpen(false));
  };

  return (
    <div className="p-6 py-2">
      <h1 className="text-2xl font-bold mb-4">Students List {total_count ? `(${total_count})` : ""}</h1>
      <ScrollArea className="h-[630px] rounded-md border p-4">
        <div className="grid gap-4">
          {students.map((student) => (
            <Card key={student.id} className="shadow-md hover:shadow-lg transition">
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">
                    {student.user.first_name} {student.user.last_name}
                  </h2>
                  <p className="text-sm text-gray-500">{student.user.email}</p>
                  <Badge className="mt-2">{student.user.role}</Badge>
                </div>
                <div className="flex gap-3">
                <Link to={student.id.toString()}>
                <Button variant="secondary" >Details</Button>
                </Link>

                  <Button variant="outline" onClick={() => handleOpenEdit(student)}>
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={isDeleting}
                    onClick={() => handleOpenDelete(student)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* DELETE DIALOG */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
        setDeleteDialogOpen(open);
        if (!open) setSelectedUser(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Czy na pewno chcesz usunąć tego ucznia?</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-gray-600">
            {selectedStudent?.user.first_name} {selectedStudent?.user.last_name}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Anuluj
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={isDeleting}>
              {isDeleting ? "Usuwanie..." : "Usuń"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setEditDialogOpen(open);
        if (!open) setSelectedUser(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edytuj ucznia</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first_name" className="text-right">Imię</Label>
              <Input
                id="first_name"
                className="col-span-3"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">Nazwisko</Label>
              <Input
                id="last_name"
                className="col-span-3"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
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
            <Button onClick={handleSubmitEdit} disabled={isUpdating}>
              {isUpdating ? "Zapisywanie..." : "Zapisz"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
