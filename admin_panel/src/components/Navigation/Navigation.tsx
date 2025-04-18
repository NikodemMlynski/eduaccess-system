import { Link } from "react-router-dom";

const navigationItems = [
  { to: "teachers", label: "Nauczyciele" },
  { to: "students", label: "Uczniowie" },
  { to: "classes", label: "Klasy" },
  { to: "schedules", label: "Godziny lekcyjne" },
  { to: "rooms", label: "Sale lekcyjne" },
  { to: "attendances", label: "Raporty frekwencji" },
  { to: "access-logs", label: "Logi dostępu do systemu" },
  { to: "administrators", label: "Administratorzy" },
];

export default function Navigation() {
  return (
    <aside className="fixed top-0 left-0 h-full bg-gray-100 border-r border-gray-200 z-20 w-64">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Panel Admina</h2>
      </div>
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="block py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
