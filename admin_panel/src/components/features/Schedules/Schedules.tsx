import classes from './Schedules.module.css';

interface SchedulesProps {
    schedules: []
}

export default function Schedules ({schedules}: SchedulesProps) {
    console.log(schedules);
    return (
        <h1 className={classes.title}>Tu będzie podstrona godzin lekcyjnych</h1>
    )
}