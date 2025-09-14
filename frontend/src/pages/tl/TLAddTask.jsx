// frontend/src/pages/tl/TLAddTask.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { HomeIcon, BriefcaseIcon, PlusCircleIcon, UserIcon } from "@heroicons/react/24/outline";

export default function TLAddTask() {
  const [form, setForm] = useState({ title: "", description: "", projectId: "", employeeId: "" });
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const token = localStorage.getItem("token");

  const links = [
    { label: "Dashboard", to: "/tl", icon: <HomeIcon className="w-5 h-5" /> },
    { label: "Tasks", to: "/tl/tasks", icon: <BriefcaseIcon className="w-5 h-5" /> },
    { label: "Add Task", to: "/tl/add-task", icon: <PlusCircleIcon className="w-5 h-5" /> },
    { label: "Team Members", to: "/tl/team", icon: <UserIcon className="w-5 h-5" /> },
  ];

  useEffect(() => {
    fetchProjects();
    fetchEmployees();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects/tl", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data.filter((u) => u.role.toLowerCase() === "employee") || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        {
          title: form.title,
          description: form.description,
          projectId: form.projectId, // backend expects this
          employeeId: form.employeeId, // backend expects this
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setForm({ title: "", description: "", projectId: "", employeeId: "" });
      alert("Task assigned successfully!");
    } catch (err) {
      console.error("Failed to assign task:", err);
      alert("Failed to assign task: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Sidebar links={links} />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-extrabold mb-8 text-white">Assign New Task</h1>
        <div className="bg-white/10 p-6 rounded-2xl shadow-md backdrop-blur-md border border-white/20">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
            <input
              type="text"
              placeholder="Task Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border border-white/20 p-3 rounded-lg bg-white/10 focus:ring-emerald-400 focus:ring-2 md:col-span-2"
              required
            />
            <select
              value={form.projectId}
              onChange={(e) => setForm({ ...form, projectId: e.target.value })}
              className="border border-white/20 p-3 rounded-lg bg-white/10 focus:ring-emerald-400 focus:ring-2 md:col-span-2"
              required
            >
              <option value="">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border border-white/20 p-3 rounded-lg bg-white/10 focus:ring-emerald-400 focus:ring-2 md:col-span-2"
            />
            <select
              value={form.employeeId}
              onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
              className="border border-white/20 p-3 rounded-lg bg-white/10 focus:ring-emerald-400 focus:ring-2 md:col-span-2"
              required
            >
              <option value="">Assign to Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-emerald-500/80 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg shadow font-medium md:col-span-2 transition"
            >
              Assign Task
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
