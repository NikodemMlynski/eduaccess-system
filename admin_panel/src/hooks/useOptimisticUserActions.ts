// hooks/useOptimisticUsers.ts
import { useState } from "react";
import { toast } from "react-toastify";
import { useUpdateUser, useDeleteUser } from "@/hooks/users";
import { useAuth } from "@/context/AuthProvider";

export function useOptimisticUsers<T extends { id: number; user: any }>(initialUsers: T[], endpoint: string) {
  const { token, user } = useAuth();

  const [users, setUsers] = useState<T[]>(initialUsers);
  const [selectedUser, setSelectedUser] = useState<T | null>(null);
  const [formData, setFormData] = useState({ first_name: "", last_name: "", email: "" });

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser(endpoint, token || "");
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser<T>(endpoint, token || "");

  const handleDelete = (onSuccess?: () => void) => {
    if (!selectedUser) return;

    deleteUser(selectedUser.id, {
      onSuccess: () => {
        setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
        setSelectedUser(null);
        toast.success("Użytkownik został usunięty.");
        onSuccess?.();
      },
      onError: () => toast.error("Wystąpił błąd podczas usuwania."),
    });
  };

  const handleEditSubmit = (onSuccess?: () => void) => {
    if (!selectedUser) return;

    updateUser(
      {
        id: selectedUser.id,
        data: formData,
      },
      {
        onSuccess: () => {
          setUsers(prev =>
            prev.map(u =>
              u.id === selectedUser.id ? { ...u, user: { ...u.user, ...formData } } : u
            )
          );
          toast.success("Dane zostały zaktualizowane.");
          onSuccess?.();
        },
        onError: () => toast.error("Wystąpił błąd podczas aktualizacji."),
      }
    );
  };

  const openEdit = (user: T) => {
    setSelectedUser(user);
    setFormData({
      first_name: user.user.first_name,
      last_name: user.user.last_name,
      email: user.user.email,
    });
  };

  const openDelete = (user: T) => {
    setSelectedUser(user);
  };

  return {
    users,
    selectedUser,
    formData,
    isUpdating,
    isDeleting,
    setFormData,
    setSelectedUser,
    openEdit,
    openDelete,
    handleEditSubmit,
    handleDelete,
  };
}
