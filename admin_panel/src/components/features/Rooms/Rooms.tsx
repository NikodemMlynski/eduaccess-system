import classes from './Rooms.module.css';

interface RoomsProps {
    rooms: []
}

export default function Rooms ({rooms}: RoomsProps) {
    console.log(rooms);
    return (
        <h1 className={classes.title}>Tu będzie podstrona sal lekcyjnych</h1>
    )
}