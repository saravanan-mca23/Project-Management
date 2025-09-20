import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function EmployeeDashboard() {
  const { API, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [updatingTask, setUpdatingTask] = useState(null); // track task being updated

  const links = [{ to: "/employee", label: "My Tasks" }];

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data.filter((t) => t.assignedTo?._id === user._id));
    } catch (err) {
      console.error("❌ Failed to fetch tasks:", err.response?.data || err.message);
      toast.error("Failed to fetch tasks");
    }
  };

  const updateStatus = async (id, status) => {
    const confirmMsg =
      status === "in-progress"
        ? "Are you sure you want to start this task?"
        : "Are you sure you want to mark this task as completed?";
    if (!window.confirm(confirmMsg)) return;

    try {
      setUpdatingTask(id); // show temporary text
      await API.put(`/tasks/${id}`, { status });
      toast.success(`Task ${status === "in-progress" ? "started" : "completed"} successfully`);
      fetchTasks();
    } catch (err) {
      console.error("❌ Failed to update status:", err.response?.data || err.message);
      toast.error("Failed to update task status");
    } finally {
      setUpdatingTask(null);
    }
  };

  const getButtonText = (task, status) => {
    if (updatingTask === task._id) {
      return status === "in-progress" ? "Starting..." : "Completing...";
    }
    if (status === "in-progress") return task.status === "in-progress" ? "In Progress" : "Start";
    if (status === "completed") return task.status === "completed" ? "Completed" : "Complete";
    return "";
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Sidebar links={links} />
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6 text-white">My Tasks</h2>

        {tasks.length === 0 ? (
          <p className="text-gray-400">No tasks assigned yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((t) => (
              <div
                key={t._id}
                className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-md hover:shadow-lg transition"
              >
                <div className="font-semibold text-emerald-400 text-lg">{t.title}</div>
                <div className="text-gray-300 mb-4">{t.description}</div>
                <div className="flex gap-3">
                  <button
                    onClick={() => updateStatus(t._id, "in-progress")}
                    disabled={t.status === "completed"}
                    className={`bg-emerald-500/80 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg shadow font-medium md:col-span-2 transition ${
                      t.status === "completed" ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {getButtonText(t, "in-progress")}
                  </button>
                  <button
                    onClick={() => updateStatus(t._id, "completed")}
                    disabled={t.status === "completed"}
                    className={`bg-emerald-500/80 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg shadow font-medium md:col-span-2 transition ${
                      t.status === "completed" ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {getButtonText(t, "completed")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
