import {ILessonInstance} from "@/types/schedule.ts";

interface LessonInstanceProps {
    schedules: ILessonInstance[];
}

export default function LessonInstance ({schedules}: LessonInstanceProps) {
    console.log(schedules);
    return (
        <h1 className="text-xl px-2 text-center">To co się wyświetla w konsoli trzeba ładnie wyświetlić w postaci planu lekcji. Czyli tabelka podobna do strony szkoły</h1>
    )
}