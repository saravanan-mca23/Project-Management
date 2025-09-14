// frontend/src/pages/tl/TLTaskList.jsx
import { useEffect, useState } from "react";
import API from "../../api"; // Centralized API instance
import Sidebar from "../../components/Sidebar";
import { HomeIcon, BriefcaseIcon, PlusCircleIcon, UserIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function TLTaskList() {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");

  const links = [
    { label: "Dashboard", to: "/tl", icon: <HomeIcon className="w-5 h-5" /> },
    { label: "Tasks", to: "/tl/tasks", icon: <BriefcaseIcon className="w-5 h-5" /> },
    { label: "Add Task", to: "/tl/add-task", icon: <PlusCircleIcon className="w-5 h-5" /> },
    { label: "Team Members", to: "/tl/team", icon: <UserIcon className="w-5 h-5" /> },
  ];

  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data || []);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await API.delete(`/tasks/${id}`, {
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
      <Sidebar links={links} />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-extrabold mb-8 text-white">Assigned Tasks</h1>

        <div className="bg-white/10 p-6 rounded-2xl shadow-md backdrop-blur-md border border-white/20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <div
                  key={task._id}
                  className="border border-white/20 rounded-xl p-5 bg-white/10 shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-bold text-emerald-400 text-lg mb-2">{task.title}</h3>
                    <p className="text-gray-300 mb-2">{task.description}</p>
                    <p className="text-sm text-gray-400 mb-1">Project: {task.project?.name || "N/A"}</p>
                    <p className="text-sm text-gray-400 mb-1">Assigned To: {task.assignedTo?.name || "N/A"}</p>
                    <p className="text-sm font-medium text-gray-300">
                      Status: <span className="text-emerald-400">{task.status || "Pending"}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="mt-4 px-4 py-2 rounded-lg text-white font-medium shadow-lg transition bg-gradient-to-r from-red-500/70 to-red-600/70 hover:from-red-500/90 hover:to-red-600/90 backdrop-blur-md border border-red-400/30"
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
