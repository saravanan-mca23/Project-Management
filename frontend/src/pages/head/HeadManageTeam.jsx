// frontend/src/pages/head/HeadManageTeam.jsx
import { useEffect, useState } from "react";
import API from "../../api"; // Centralized API instance
import Sidebar from "../../components/Sidebar";
import { HomeIcon, BriefcaseIcon, PlusCircleIcon, UserIcon } from "@heroicons/react/24/outline";

export default function HeadManageTeam() {
  const [tls, setTls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const token = localStorage.getItem("token");

  const links = [
    { label: "Dashboard", to: "/head", icon: <HomeIcon className="w-5 h-5" /> },
    { label: "Add Project", to: "/head/add", icon: <PlusCircleIcon className="w-5 h-5" /> },
    { label: "Projects", to: "/head/projects", icon: <BriefcaseIcon className="w-5 h-5" /> },
    { label: "Team Members", to: "/head/team", icon: <UserIcon className="w-5 h-5" /> },
  ];

  useEffect(() => {
    if (token) {
      fetchTLs();
      fetchEmployees();
    }
  }, [token]);

  const fetchTLs = async () => {
    try {
      const res = await API.get("/api/auth/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTls(res.data.filter(u => u.role.toLowerCase() === "tl") || []);
    } catch (err) {
      console.error("Failed to fetch TLs:", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/api/auth/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data.filter(u => u.role.toLowerCase() === "employee") || []);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await API.delete(`/api/auth/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchTLs();
        fetchEmployees();
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Sidebar links={links} />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-extrabold mb-8 text-white">Manage Team</h1>

        {/* TL List */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Team Leads</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tls.length > 0 ? tls.map(tl => (
              <div key={tl._id} className="border border-white/20 rounded-xl p-5 bg-white/10 shadow-sm hover:shadow-md transition flex justify-between items-center">
                <span>{tl.name}</span>
                <button
                  onClick={() => handleDelete(tl._id)}
                  className="px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-sm"
                >
                  Delete
                </button>
              </div>
            )) : <p className="text-gray-400">No TLs found.</p>}
          </div>
        </div>

        {/* Employee List */}
        <div>
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Employees</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.length > 0 ? employees.map(emp => (
              <div key={emp._id} className="border border-white/20 rounded-xl p-5 bg-white/10 shadow-sm hover:shadow-md transition flex justify-between items-center">
                <span>{emp.name}</span>
                <button
                  onClick={() => handleDelete(emp._id)}
                  className="px-3 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-sm"
                >
                  Delete
                </button>
              </div>
            )) : <p className="text-gray-400">No employees found.</p>}
          </div>
        </div>
      </main>
    </div>
  );
}
