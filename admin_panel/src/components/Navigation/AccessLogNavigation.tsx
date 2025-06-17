import { NavLink } from "react-router-dom";

const navigationItems = [
  { to: "list", label: "List" },
  { to: "requests", label: "Access requests" },
  { to: "approvals", label: "Approve requests" },
];

export default function AccessLogNavigation() {
  return (
    <nav className="w-full flex justify-center h-[80px] items-center">
        <div className="flex gap-5">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `py-2 px-4 rounded-md transition-colors ${
                isActive ? "bg-gray-500" : "bg-black"
              } text-white hover:bg-gray-700`
            }
          >
              {item.label}
            </NavLink>
          ))}
        </div>
    </nav>
  );
}
