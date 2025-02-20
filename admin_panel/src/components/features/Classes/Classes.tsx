import classes from './Classes.module.css';

interface ClassesProps {
    schoolClasses: []
}

export default function Classes ({schoolClasses}: ClassesProps) {
    console.log(schoolClasses);
    return (
        <h1 className={classes.title}>Tu będzie podstrona klas</h1>
    )
}