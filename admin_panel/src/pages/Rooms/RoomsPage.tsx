import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useRooms, useCreateRoom } from "@/hooks/rooms";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { SearchAndLimitBar } from "@/components/utils/SearchAndLimitBar";
import { PaginationControls } from "@/components/utils/PaginationControls";
import Rooms from "../../components/features/Rooms/Rooms";
import { IRoom } from "@/types/rooms";
import { PaginatedRoomsResponse } from "@/hooks/rooms";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export default function RoomsPage() {
    const { user, token } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearchQuery = useDebouncedValue(searchQuery, 1000);
    const [limit, setLimit] = useState(9);
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [capacity, setCapacity] = useState<number | "">("");

    const { data, isLoading, isError } = useRooms<IRoom>(
        `school/${user?.school_id}/rooms`,
        token || "",
        { query: debouncedSearchQuery, limit, page, paginated: true }
    );

    const createRoom = useCreateRoom(user?.school_id, token || "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomName || !capacity) return;
        
        createRoom.mutate(
            { room_name: roomName, capacity: Number(capacity) },
            {
                onSuccess: () => {
                    setOpen(false);
                    setRoomName("");
                    setCapacity("");
                    toast.success("Room added successfully!");
                },
                onError: (error) => {
                    toast.error(error.message);
                },
            }
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[80vh]">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                    <p className="text-gray-600">Loading classrooms...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return <div className="text-center text-red-500 mt-10">Something went wrong.</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between">
            <SearchAndLimitBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                limit={limit}
                setLimit={setLimit}
                setPage={setPage}
            />
            <div className="flex justify-between items-center mb-4">
                {/* Add Room Button */}
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add Room
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a New Room</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="room_name">Room Name</Label>
                                <Input
                                    id="room_name"
                                    value={roomName}
                                    onChange={(e) => setRoomName(e.target.value)}
                                    placeholder="e.g. 101"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="capacity">Capacity</Label>
                                <Input
                                    type="number"
                                    id="capacity"
                                    value={capacity}
                                    onChange={(e) => setCapacity(+e.target.value)}
                                    placeholder="e.g. 30"
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={createRoom.isPending || !roomName || !capacity}>
                                    {createRoom.isPending ? "Adding..." : "Add Room"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
            </div>

            <div key={`${debouncedSearchQuery}-${page}`}>
                <Rooms rooms={data?.rooms || []} />
            </div>

            <PaginationControls<IRoom, PaginatedRoomsResponse<IRoom>>
                page={page}
                setPage={setPage}
                data={data}
            />
        </div>
    );
}
