import classes from './Administrators.module.css';

interface AdministratorsProps {
    administrators: []
}

export default function Administrators ({administrators}: AdministratorsProps) {
    console.log(administrators);
    return (
        <h1 className={classes.title}>Tu będzie podstrona administratorów</h1>
    )
}