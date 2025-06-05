import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {ArrowLeft, ArrowRight} from "lucide-react"
import {useEffect, useState} from "react";
interface ILessonInstanceDatePickerProps {
    dateStr?: string;
    type: "classes" | "teachers" | "rooms" | "students";
    id?: number;
    link: "schedules" | "attendances";
}
const LessonInstanceDatePicker = ({
    dateStr,
    type,
    id,
    link
}: ILessonInstanceDatePickerProps) => {
    const [date, setDate] = useState(new Date( dateStr || ""));
    const monday = date.getDay() - 1;
    const mondayDate = new Date(new Date(date).setDate(new Date(date).getDate() - monday));
    const weekdaysArr = [];
    for (let i = 0; i < 5; i++) {
        const day = new Date(mondayDate);
        day.setDate(mondayDate.getDate() + i);
        weekdaysArr.push(day);
    }
    const navigate = useNavigate();

    const handleDateChange = (type: "add" | "sub") => {

        setDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setDate(prevDate.getDate() + (type === "add" ? 7 : -7));
            return newDate;
        })
    }
    useEffect(() => {
        navigate(`/${link}/${type}/${id}/dateStr/${date.toISOString().split("T")[0]}`)
    }, [date])
    return (
        <div className="flex justify-center items-center space-x-2 py-2 mt-5 relative">
            <ArrowLeft className="cursor-pointer absolute left-4"
            onClick={() => handleDateChange("sub")}
            />
        {
            weekdaysArr.map((day, index) => (
                <Button className={`cursor-pointer rounded-[50%] w-8 h-8 flex items-center justify-center
                ${day.getDate() === date.getDate() ? "bg-gray-400 text-white" : "bg-gray-700"}
                ${day.getDate() == new Date().getDate() ? "bg-blue-500 text-white" : ""}
                `}
                key={index}
                onClick={() => {
                     navigate(`/${link}/${type}/${id}/dateStr/${day.toISOString().split("T")[0]}`)
                }}
                >{day.getDate()}</Button>
            ))
        }
        <ArrowRight className="cursor-pointer absolute right-4"
            onClick={() => handleDateChange("add")}
        />
        </div>
    )
}
export default LessonInstanceDatePicker;