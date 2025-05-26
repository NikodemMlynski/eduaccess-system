import { Card, CardContent } from "@/components/ui/card";
import { DeleteModal } from "@/components/utils/deleteModal";
import { Field, UpdateModal } from "@/components/utils/UpdateModal";
import { useAuth } from "@/context/AuthProvider";
import { useDeleteRoom, useUpdateRoom } from "@/hooks/rooms";
import { IRoom, IRoomIn } from "@/types/rooms";
import { useState } from "react";

interface RoomProps {
    room: IRoom
}

export default function Room({room}: RoomProps) {
    const { user, token } = useAuth();
    const [fields, setFields] = useState<Field[]>([
        {name: "room_name", label: "Room name", value: room.room_name},
        {name: "capacity", label: "Capacity", type: "number", value: room.capacity}
    ])
    const [confirmInput, setConfirmInput] = useState("");
    const deleteRoom = useDeleteRoom(`school/${user?.school_id}/rooms`, token || "");
    const updateRoom = useUpdateRoom(`school/${user?.school_id}/rooms`, token || "")

    const handleDelete = () => {
        if (room.id) {
        deleteRoom.mutate(room.id);
        setConfirmInput("");
        }
    };
    const handleUpdate = () => {
        const updatedRoomData: IRoomIn = Object.fromEntries(
            fields.map(f => [f.name, f.value])
        )
        updateRoom.mutate({id: room.id, data: updatedRoomData});

    }

    return (
        <Card key={room.id} className="relative">
            <CardContent className="pt-4">
            <div className="flex justify-between items-center">
                <div>
                <h2 className="text-2xl font-bold">
                    {room.room_name}
                </h2>
                <p className="text-muted-foreground text-md">Capacity: {room.capacity}</p>
                </div>

                <div className="flex gap-5">
                <UpdateModal
                fields={fields}
                onSubmit={handleUpdate}
                setFields={setFields}
                title="Update classroom"
                
                />
                <DeleteModal
                confirmInput={confirmInput}
                setConfirmInput={setConfirmInput}
                handleDelete={handleDelete}
                valueToConfirm={room.room_name}
                item_name="Room"
                />
                </div>
                
            </div>
            </CardContent>
        </Card>
    )
}