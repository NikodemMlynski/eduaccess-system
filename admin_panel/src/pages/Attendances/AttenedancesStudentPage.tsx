import {useParams} from "react-router-dom";

export default function AttendancesStudentPage() {
    const {studentId, date} = useParams();
    return (
        <h1>Dla studenta: {studentId}, data: {date}</h1>// w przyszłości tu się wprowadzi realne dane
    )
}