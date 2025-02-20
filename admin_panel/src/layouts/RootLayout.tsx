import classes from './RootLayout.module.css';
import Navigation from '../components/Navigation/Navigation';
import { Outlet } from 'react-router-dom';


export default function RootLayout() {
    return (
        <div className={classes.container}>
            <Navigation/>
            <Outlet/>
        </div>
    )
}