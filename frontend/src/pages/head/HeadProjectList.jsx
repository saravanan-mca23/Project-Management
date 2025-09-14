// frontend/src/pages/head/HeadProjectList.jsx
import { useEffect, useState } from "react";
import API from "../../api"; // Centralized API instance
import Sidebar from "../../components/Sidebar";
import {
  HomeIcon,
  BriefcaseIcon,
  PlusCircleIcon,
  UserIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function HeadProjectList() {
  const [projects, setProjects] = useState([]);
  const token = localStorage.getItem("token");

  const links = [
    { label: "Dashboard", to: "/head", icon: <HomeIcon className="w-5 h-5" /> },
    { label: "Projects", to: "/head/projects", icon: <BriefcaseIcon className="w-5 h-5" /> },
    { label: "Add Project", to: "/head/add", icon: <PlusCircleIcon className="w-5 h-5" /> },
    { label: "Team Members", to: "/head/team", icon: <UserIcon className="w-5 h-5" /> },
  ];

  useEffect(() => {
    if (token) fetchProjects();
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
        <h1 className="text-3xl font-extrabold mb-8 text-white">Projects</h1>

        <div className="bg-white/10 p-6 rounded-2xl shadow-md backdrop-blur-md border border-white/20">
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
                      onClick={() => alert("Edit feature can be added here")}
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
