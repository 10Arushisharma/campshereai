import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  BarChart2,
  HelpCircle,
  LogOut,
  User,
} from "lucide-react";

const navItems = [
  { to: "/student-dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/student-dashboard/jobs", icon: Briefcase, label: "Jobs" },
  { to: "/student-dashboard/readiness-score", icon: BarChart2, label: "ReadinessScore" },
  { to: "/student-dashboard/profile", icon: User, label: "Profile" },
];

function Sidebar() {
  const navigate = useNavigate();

  return (
    // <div className="min-h-screen bg-[#f8fafc] flex font-sans">
    <aside className="w-56 bg-card flex flex-col shrink-0">
      <div className="p-5 ">
        <h2 className="text-3xl font-extrabold text-indigo-800">Concierge AI</h2>
        <p className="text-xs uppercase tracking-[0.25em] text-slate-500 mt-1">PLACEMENT PORTAL</p>
      </div>

      <nav className="flex-1 p-3 space-y-1 mt-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground/70 hover:bg-muted hover:text-foreground'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-border space-y-1">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-colors w-full">
          <HelpCircle size={18} />
          Support
        </button>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/70 hover:bg-muted hover:text-foreground transition-colors w-full">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>

  );
}

export default Sidebar;