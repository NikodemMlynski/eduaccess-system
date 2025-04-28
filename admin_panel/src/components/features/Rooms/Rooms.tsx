// src/components/features/Rooms/Rooms.tsx

import { IRoom } from "@/types/rooms";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthProvider";
import { useDeleteRoom } from "@/hooks/rooms";

import { useState } from "react";
import { DeleteModal } from "@/components/utils/deleteModal";

interface RoomsProps {
  rooms: IRoom[];
}

export default function Rooms({ rooms }: RoomsProps) {
  const { user, token } = useAuth();
  const deleteRoom = useDeleteRoom(`school/${user?.school_id}/rooms`, token || "");

  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
  const [confirmInput, setConfirmInput] = useState("");

  const handleDelete = () => {
    if (selectedRoomId) {
      deleteRoom.mutate(selectedRoomId);
      setSelectedRoomId(null);
      setConfirmInput("");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="relative">
            <CardContent className="pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">
                    {room.room_name}
                  </h2>
                  <p className="text-muted-foreground text-md">Capacity: {room.capacity}</p>
                </div>
                <DeleteModal
                confirmInput={confirmInput}
                setConfirmInput={setConfirmInput}
                handleDelete={handleDelete}
                selectedItemId={room.id}
                setSelectedItemId={setSelectedRoomId}
                valueToConfirm={room.room_name}
                />
                
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
