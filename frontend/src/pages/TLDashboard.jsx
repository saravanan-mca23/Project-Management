// frontend/src/pages/TLDashboard.jsx
import { useEffect, useState } from "react";
import API from "../api"; // Use centralized API instance
import Sidebar from "../components/Sidebar";
import {
  HomeIcon,
  BriefcaseIcon,
  PlusCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function TLDashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",   // must match backend
    employeeId: "",  // must match backend
  });
  const [employees, setEmployees] = useState([]);
  const token = localStorage.getItem("token");

  const links = [
    { label: "Dashboard", to: "/tl", icon: <HomeIcon className="w-5 h-5" /> },
    { label: "Tasks", to: "/tl/tasks", icon: <BriefcaseIcon className="w-5 h-5" /> },
    { label: "Add Task", to: "/tl/add-task", icon: <PlusCircleIcon className="w-5 h-5" /> },
    { label: "Team Members", to: "/tl/team", icon: <UserIcon className="w-5 h-5" /> },
  ];

  useEffect(() => {
    if (token) {
      fetchProjects();
      fetchEmployees();
      fetchTasks();
    }
  }, [token]);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/api/projects/tl", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data || []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/api/auth/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data.filter((u) => u.role.toLowerCase() === "employee") || []);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await API.get("/api/tasks/tl", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data || []);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/tasks", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ title: "", description: "", projectId: "", employeeId: "" });
      fetchTasks();
    } catch (err) {
      console.error("Failed to assign task:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await API.delete(`/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchTasks();
      } catch (err) {
        console.error("Failed to delete task:", err);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Sidebar */}
      <Sidebar links={links} />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-extrabold mb-8 text-white">
          Team Lead Dashboard
        </h1>

        {/* Assign Task Form */}
        <div className="bg-white/10 p-6 rounded-2xl shadow-md mb-10 backdrop-blur-md border border-white/20">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">
            Assign New Task
          </h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white"
          >
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
              <option value="" className="text-slate-700">Select Project</option>
              {projects.map((p) => (
                <option key={p._id} value={p._id} className="text-slate-700">
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
              <option value="" className="text-slate-700">Assign to Employee</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id} className="text-slate-700">
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

        {/* Task List */}
        <div className="bg-white/10 p-6 rounded-2xl shadow-md backdrop-blur-md border border-white/20">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Tasks</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task._id}
                  className="border border-white/20 rounded-xl p-5 bg-white/10 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-emerald-400 text-lg mb-2">
                      {task.title}
                    </h3>
                    <p className="text-gray-300 mb-2">{task.description}</p>
                    <p className="text-sm text-gray-400 mb-1">
                      Project: {task.project?.name || "N/A"}
                    </p>
                    <p className="text-sm text-gray-400 mb-1">
                      Assigned To: {task.assignedTo?.name || "N/A"}
                    </p>
                    <p className="text-sm font-medium text-gray-300">
                      Status:{" "}
                      <span className="text-emerald-400">{task.status || "Pending"}</span>
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="mt-4 px-4 py-2 rounded-lg text-white font-medium shadow-lg transition 
                      bg-gradient-to-r from-red-500/70 to-red-600/70 hover:from-red-500/90 hover:to-red-600/90 
                      backdrop-blur-md border border-red-400/30"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No tasks assigned yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
