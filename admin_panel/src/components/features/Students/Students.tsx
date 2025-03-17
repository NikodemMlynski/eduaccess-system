import classes from './Students.module.css';

interface StudentsProps {
    students: []
}

export default function Students ({students}: StudentsProps) {
    console.log(students);
    return (
        <h1 className={classes.title}>Tu będzie podstrona uczniów</h1>
    )
}