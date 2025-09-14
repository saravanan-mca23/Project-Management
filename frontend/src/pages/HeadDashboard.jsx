// frontend/src/pages/HeadDashboard.jsx
import { useEffect, useState } from "react";
import API from "../api"; // Use centralized API instance
import Sidebar from "../components/Sidebar";
import {
  HomeIcon,
  BriefcaseIcon,
  PlusCircleIcon,
  UserIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function HeadDashboard() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", deadline: "", tlId: "" });
  const [tls, setTls] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  const links = [
    { label: "Dashboard", to: "/head", icon: <HomeIcon className="w-5 h-5" /> },
    { label: "Projects", to: "/head/projects", icon: <BriefcaseIcon className="w-5 h-5" /> },
    { label: "Add Project", to: "/head/add", icon: <PlusCircleIcon className="w-5 h-5" /> },
    { label: "Team Members", to: "/head/team", icon: <UserIcon className="w-5 h-5" /> },
  ];

  useEffect(() => {
    if (token) {
      fetchProjects();
      fetchTLs();
    }
  }, [token]);

  const fetchProjects = async () => {
    try {
      const res = await API.get("/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(res.data || []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };

  const fetchTLs = async () => {
    try {
      const res = await API.get("/api/auth/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTls(res.data.filter((u) => u.role.toLowerCase() === "tl") || []);
    } catch (err) {
      console.error("Failed to fetch TLs:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update project
        await API.put(`/api/projects/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEditingId(null);
      } else {
        // Create project
        await API.post("/api/projects", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ name: "", description: "", deadline: "", tlId: "" });
      fetchProjects();
    } catch (err) {
      console.error("Failed to submit project:", err);
    }
  };

  const handleEdit = (project) => {
    setForm({
      name: project.name,
      description: project.description,
      deadline: project.deadline ? new Date(project.deadline).toISOString().split("T")[0] : "",
      tlId: project.assignedToTL?._id || "",
    });
    setEditingId(project._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await API.delete(`/api/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchProjects();
      } catch (err) {
        console.error("Failed to delete project:", err);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Sidebar links={links} />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-extrabold mb-8 text-white">
          Team Head Dashboard
        </h1>

        {/* Create / Update Project Form */}
        <div className="bg-white/10 p-6 rounded-2xl shadow-md mb-10 backdrop-blur-md border border-white/20">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">
            {editingId ? "Update Project" : "Create New Project"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
            <input
              type="text"
              placeholder="Project Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-white/20 p-3 rounded-lg bg-white/10 focus:ring-emerald-400 focus:ring-2"
              required
            />
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="border border-white/20 p-3 rounded-lg bg-white/10 focus:ring-emerald-400 focus:ring-2"
              required
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border border-white/20 p-3 rounded-lg bg-white/10 focus:ring-emerald-400 focus:ring-2 md:col-span-2"
            />
            <select
              value={form.tlId}
              onChange={(e) => setForm({ ...form, tlId: e.target.value })}
              className="border border-white/20 p-3 rounded-lg bg-white/10 focus:ring-emerald-400 focus:ring-2 md:col-span-2"
              required
            >
              <option value="">Assign to TL</option>
              {tls.map((tl) => (
                <option key={tl._id} value={tl._id} className="text-slate-700">
                  {tl.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-emerald-500/80 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg shadow font-medium md:col-span-2 transition"
            >
              {editingId ? "Update Project" : "Create Project"}
            </button>
          </form>
        </div>

        {/* Project List */}
        <div className="bg-white/10 p-6 rounded-2xl shadow-md backdrop-blur-md border border-white/20">
          <h2 className="text-xl font-semibold text-emerald-400 mb-4">Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project._id}
                  className="border border-white/20 rounded-xl p-5 bg-white/10 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-emerald-400 text-lg mb-2">{project.name}</h3>
                    <p className="text-gray-300 mb-2">{project.description}</p>
                    <p className="text-sm text-gray-400 mb-1">
                      Deadline: {project.deadline ? new Date(project.deadline).toDateString() : "N/A"}
                    </p>
                    <p className="text-sm text-gray-400">
                      Assigned TL: {project.assignedToTL?.name || "N/A"}
                    </p>
                  </div>
                  <div className="flex mt-4 gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="flex items-center gap-1 bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition"
                    >
                      <PencilSquareIcon className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project._id)}
                      className="flex items-center gap-1 bg-red-600/80 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
                    >
                      <TrashIcon className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No projects created yet.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
