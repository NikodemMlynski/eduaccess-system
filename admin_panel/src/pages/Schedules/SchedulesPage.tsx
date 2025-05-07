import {Link} from "react-router-dom";

export default function SchedulesPage() {
    return (
        <div>
            <h1>Tym ja sie zajme raczej więc, póki co tego nie rób, najpierw widok czyli te linki poniżej</h1>
            <h1>Tutaj będzie się zarządzać planem lekcji</h1>
            <h2>Będzie komponent CRUD dla szablonu planu lekcji</h2>
            <h2>I drugi komponent CRUD dla rzeczywistych godzin lekcyjnych</h2>
            <div className="flex flex-col p-2">
                <Link className="text-lg text-blue-400 hover:text-blue-800" to={"classes/1"}>Strona planu dla klasy 4D</Link>
                <Link className="text-lg text-blue-400 hover:text-blue-800" to={"rooms/1"}>Strona planu dla sali</Link>
                <Link className="text-lg text-blue-400 hover:text-blue-800" to={"teachers/1"}>Strona planu dla nauczyciela</Link>
            </div>

        </div>
    )
}