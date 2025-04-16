import { ITeacher } from "@/types/Teacher";
import Teachers from "../../components/features/Teachers/Teachers";

const mockTeachers: ITeacher[] = []

export default function TeachersPage() {
    return (
        <Teachers teachers={mockTeachers} /> // w przyszłości tu się wprowadzi realne dane
    )
}