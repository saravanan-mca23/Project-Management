import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HomeIcon,
  PlusCircleIcon,
  BriefcaseIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar({ links = [] }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav("/login");
  };

  return (
    <aside className="w-72 bg-slate-900/60 border-r border-white/5 min-h-screen p-6 flex flex-col gap-6 backdrop-blur-lg">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
          <svg
            className="w-6 h-6 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path d="M12 3v18"></path>
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-white">ProjectPM</h3>
          <p className="text-xs text-slate-300">{user?.name || "Guest"}</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1">
        {links.length === 0 && (
          <p className="text-sm text-slate-400">No links available</p>
        )}
        {links.map((l, index) => (
          <Link
            key={l.to + index} // ensures unique key even if paths are same
            to={l.to}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
          >
            {l.icon || <HomeIcon className="w-5 h-5 text-white" />} 
            <span className="text-sm text-white">{l.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="flex items-center gap-2 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 p-2 justify-center rounded-md bg-white/5 hover:bg-white/10 text-white transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
