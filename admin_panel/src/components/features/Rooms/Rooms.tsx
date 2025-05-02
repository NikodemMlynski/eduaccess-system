
import { IRoom } from "@/types/rooms";

import Room from "./Room";

interface RoomsProps {
  rooms: IRoom[];
}

export default function Rooms({ rooms }: RoomsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
         <Room
         key={room.id}
         room={room}
         />
        ))}
      </div>
    </>
  );
}
