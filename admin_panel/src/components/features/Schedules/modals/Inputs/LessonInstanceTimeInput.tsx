import {Calendar} from "@/components/ui/calendar.tsx";
import {useEffect, useState} from "react";
import {Input} from "@/components/ui/input.tsx";

interface ILessonInstanceTimeInputProps {
    time: string;
    date: Date;
    identifier: "start_time" | "end_time";
    setTimeAndDate: (
        identifier: "start_time" | "end_time",
        time: string,
        date: Date | null,
        ) => void;
}

const LessonInstanceTimeInput = ({
    time,
    date,
    setTimeAndDate,
    identifier
}: ILessonInstanceTimeInputProps) => {
    const [localTime, setLocalTime] = useState(time || "");
    const [localDate, setLocalDate] = useState<Date | null>(date || null);

    useEffect(() => {
        setTimeAndDate(identifier, localTime, localDate);
    }, [time, date, identifier, localDate, localTime])

    return (
        <div className="flex flex-col items-center w-[50%]">
            <Calendar
                mode="single"
                selected={localDate}
                onSelect={setLocalDate}
                className="rounded-md border scale-[75%] bg-red-100 p-0 m-0"
            />
            <Input className="bg-gray-100 w-[150px]" type="time" value={localTime} onChange={(e) => setLocalTime(e.target.value)} />
        </div>
    )
}

export default LessonInstanceTimeInput