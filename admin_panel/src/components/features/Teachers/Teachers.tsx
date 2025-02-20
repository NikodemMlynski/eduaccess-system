import classes from './Teachers.module.css';

interface TeachersProps {
    teachers: []
}

export default function Teachers ({teachers}: TeachersProps) {
    console.log(teachers);
    return (
        <h1 className={classes.title}>Tu będzie podstrona nauczycieli</h1>
    )
}