import { useAuth } from '@/context/AuthProvider';
import classes from './Dashboard.module.css';

export default function Dashboard () {
    const {user} = useAuth();
    return (
        <h1 className={classes.title}>Tu będzie dashboard {user?.first_name}</h1>
    )
}