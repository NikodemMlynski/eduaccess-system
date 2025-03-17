import classes from './Attendances.module.css';

interface AttendancesProps {
    attendances: []
}

export default function Attendances ({attendances}: AttendancesProps) {
    console.log(attendances);
    return (
        <h1 className={classes.title}>Tu będzie podstrona frekwencji</h1>
    )
}