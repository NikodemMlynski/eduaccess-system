import { Link } from "react-router-dom";

export default function Navigation() {
    return (
        <ul>
            <li><Link to={'teachers'} >Nauczyciele</Link></li>
            <li><Link to={'students'}>Uczniowie</Link></li>
            <li><Link to={'classes'}>Klasy</Link></li>
            <li><Link to={'schedules'}>Godziny lekcyjne</Link></li>
            <li><Link to={'rooms'}>Sale lekcyjne</Link></li>
            <li><Link to={'attendances'}>Raporty frekwencji</Link></li>
            <li><Link to={'access-logs'}>Logi dostępu do systemu</Link></li>
            <li><Link to={'administrators'}>Administratorzy</Link></li>
        </ul>
    )
}