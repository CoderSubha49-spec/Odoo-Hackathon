import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  ClipboardList,
  Wallet,
  UserCircle,
  LogOut,
} from "lucide-react";

const menu = [
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "Employees", path: "/employees", icon: Users },
  { title: "Attendance", path: "/attendance", icon: CalendarCheck },
  { title: "Leave", path: "/leave", icon: ClipboardList },
  { title: "Payroll", path: "/payroll", icon: Wallet },
  { title: "Profile", path: "/profile", icon: UserCircle },
];

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-violet-800 text-white flex flex-col shadow-xl">

      <div className="px-6 py-8 border-b border-violet-700">
        <h1 className="text-3xl font-bold">HRMS</h1>
        <p className="text-violet-200 text-sm">
          Human Resource Management
        </p>
      </div>

      <nav className="flex-1 px-4 py-6">

        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl mb-3 transition-all duration-300 ${
                  isActive
                    ? "bg-white text-violet-800 font-semibold shadow"
                    : "hover:bg-violet-700"
                }`
              }
            >
              <Icon size={20} />
              {item.title}
            </NavLink>
          );
        })}

      </nav>

      <div className="border-t border-violet-700 p-5">

        <button className="flex items-center gap-3 hover:text-red-300 transition">

          <LogOut size={20} />

          Logout

        </button>

      </div>

    </aside>
  );
}