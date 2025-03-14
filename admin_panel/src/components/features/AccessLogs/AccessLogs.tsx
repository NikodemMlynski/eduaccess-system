import classes from './AccessLogs.module.css';

interface AccessLogsProps {
    accessLogs: []
}

export default function AccessLogs ({accessLogs}: AccessLogsProps) {
    console.log(accessLogs);
    return (
        <h1 className={classes.title}>Tu będzie podstrona logów dostępu do sal</h1>
    )
}