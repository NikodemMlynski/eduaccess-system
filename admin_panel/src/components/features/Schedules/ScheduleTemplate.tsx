import {ILessonTemplate} from "@/types/schedule.ts";

interface SchedulesProps {
    schedules: ILessonTemplate[];
}

export default function ScheduleTemplate ({schedules}: SchedulesProps) {
    console.log(schedules);
    return (
        <h1 className="text-xl px-2 text-center">To co się wyświetla w konsoli trzeba ładnie wyświetlić w postaci planu lekcji. Czyli tabelka podobna do strony szkoły</h1>
    )
}