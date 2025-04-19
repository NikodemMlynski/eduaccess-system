
interface AttendancesProps {
    attendances: []
}

export default function Attendances ({attendances}: AttendancesProps) {
    console.log(attendances);
    return (
        <h1>Tu będzie podstrona frekwencji</h1>
    )
}