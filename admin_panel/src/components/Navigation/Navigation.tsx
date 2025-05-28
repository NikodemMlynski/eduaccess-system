import { Link } from "react-router-dom";

const navigationItems = [
  { to: "teachers", label: "Teachers" },
  { to: "students", label: "Students" },
  { to: "classes", label: "Classes" },
  { to: "schedules", label: "Schedule" },
  { to: "rooms", label: "Classrooms" },
  { to: "attendances", label: "Attendance report" },
  { to: "access-logs", label: "Access logs" },
  { to: "administrators", label: "School Info" },
];

export default function Navigation() {
  return (
    <aside className="fixed top-0 left-0 h-full bg-gray-100 border-r border-gray-200 z-20 w-64">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Admin Panel</h2>
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
