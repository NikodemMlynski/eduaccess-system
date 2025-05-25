import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";

interface ILessonInstanceDatePickerProps {
    dateStr?: string;
    type: "classes" | "teachers" | "rooms";
    id?: number;
}
const LessonInstanceDatePicker = ({
    dateStr,
    type,
    id
}: ILessonInstanceDatePickerProps) => {
    const date = new Date( dateStr || "");
    const monday = date.getDay() - 1;
    const mondayDate = new Date(new Date(date).setDate(new Date(date).getDate() - monday));
    const weekdaysArr = [];
    for (let i = 0; i < 5; i++) {
        const day = new Date(mondayDate);
        day.setDate(mondayDate.getDate() + i);
        weekdaysArr.push(day);
    }
    const navigate = useNavigate();
    return (
        <div className="flex justify-center space-x-2 py-2 mt-5">
        {
            weekdaysArr.map((day, index) => (
                <Button className={`cursor-pointer rounded-[50%] w-8 h-8 flex items-center justify-center
                ${day.getDate() === date.getDate() ? "bg-gray-400 text-white" : "bg-gray-700"}
                ${day.getDate() == new Date().getDate() ? "bg-blue-500 text-white" : ""}
                `}
                key={index}
                onClick={() => {
                     navigate(`/schedules/${type}/${id}/dateStr/${day.toISOString().split("T")[0]}`)
                }}
                >{day.getDate()}</Button>
            ))
        }
        </div>
    )
}
export default LessonInstanceDatePicker;