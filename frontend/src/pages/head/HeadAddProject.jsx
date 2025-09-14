// frontend/src/pages/head/HeadAddProject.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import API from "../../api"; // Use centralized API instance
import { HomeIcon, BriefcaseIcon, PlusCircleIcon, UserIcon } from "@heroicons/react/24/outline";

export default function HeadAddProject() {
  const [form, setForm] = useState({ name: "", description: "", deadline: "", tlId: "" });
  const [tls, setTls] = useState([]);
  const token = localStorage.getItem("token");

  const links = [
    { label: "Dashboard", to: "/head", icon: <HomeIcon className="w-5 h-5" /> },
    { label: "Projects", to: "/head/projects", icon: <BriefcaseIcon className="w-5 h-5" /> },
    { label: "Add Project", to: "/head/add", icon: <PlusCircleIcon className="w-5 h-5" /> },
    { label: "Team Members", to: "/head/team", icon: <UserIcon className="w-5 h-5" /> },
  ];

  useEffect(() => {
    if (token) fetchTLs();
  }, [token]);

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
      await API.post("/api/projects", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm({ name: "", description: "", deadline: "", tlId: "" });
      alert("Project created successfully!");
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Sidebar links={links} />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-extrabold mb-8 text-white">Add New Project</h1>

        <div className="bg-white/10 p-6 rounded-2xl shadow-md backdrop-blur-md border border-white/20">
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
              Create Project
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
