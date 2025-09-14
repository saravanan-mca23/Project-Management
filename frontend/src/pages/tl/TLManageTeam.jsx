// frontend/src/pages/tl/TLManageTeam.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { HomeIcon, BriefcaseIcon, PlusCircleIcon, UserIcon } from "@heroicons/react/24/outline";

export default function TLManageTeam() {
  const [employees, setEmployees] = useState([]);
  const token = localStorage.getItem("token");

 const links = [
  { label: "Dashboard", to: "/tl", icon: <HomeIcon className="w-5 h-5" /> },
  { label: "Tasks", to: "/tl/tasks", icon: <BriefcaseIcon className="w-5 h-5" /> },
  { label: "Add Task", to: "/tl/add-task", icon: <PlusCircleIcon className="w-5 h-5" /> },
  { label: "Team Members", to: "/tl/team", icon: <UserIcon className="w-5 h-5" /> },
];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data.filter(u => u.role.toLowerCase() === "employee") || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Sidebar links={links} />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-extrabold mb-8 text-white">Team Members</h1>
        <div className="bg-white/10 p-6 rounded-2xl shadow-md backdrop-blur-md border border-white/20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.length > 0 ? employees.map(emp => (
              <div key={emp._id} className="border border-white/20 rounded-xl p-5 bg-white/10 shadow-sm hover:shadow-md transition">
                <h3 className="font-bold text-emerald-400 text-lg mb-2">{emp.name}</h3>
                <p className="text-gray-300 mb-1">Email: {emp.email}</p>
              </div>
            )) : <p className="text-gray-400">No team members found.</p>}
          </div>
        </div>
      </main>
    </div>
  );
}
