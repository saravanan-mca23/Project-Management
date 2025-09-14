import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });
  const [err, setErr] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setIsLoading(true);
    try {
      const res = await register(form.name, form.email, form.password, form.role);

      if (res.role === "head") navigate("/head");
      else if (res.role === "tl") navigate("/tl");
      else if (res.role === "employee") navigate("/employee");
      else setErr("Invalid role");
    } catch (e) {
      setErr(e.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-white/10 py-4 px-6 backdrop-blur-md border-b border-white/20 flex justify-center">
        <h1 className="text-xl font-bold text-white">Project Management System</h1>
      </header>

      {/* Main Content */}
      <main className="flex flex-grow items-center justify-center p-6">
        <div className="w-full max-w-5xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden md:flex">
          {/* Left Side - Info */}
          <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 p-8 text-white">
            <div className="flex flex-col h-full justify-center">
              <h2 className="text-3xl font-bold mb-4">Join Us</h2>
              <p className="mb-8 text-slate-300">
                Create your account and start managing projects efficiently.
              </p>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="mb-2">Collaborate seamlessly</p>
                <p>Track progress in real-time</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-sm text-slate-300 mb-6">
              Fill in your details to start using ProjectPM
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="p-3 rounded-lg bg-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="p-3 rounded-lg bg-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="p-3 rounded-lg bg-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
                
              />

              <label className="text-sm text-slate-300">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="p-3 rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="employee">Employee</option>
                <option value="tl">Team Lead</option>
                <option value="head">Team Head</option>
              </select>

              {err && <div className="text-rose-400 text-sm">{err}</div>}

              <button
                type="submit"
                disabled={isLoading}
                className={`mt-2 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 font-medium text-white shadow-md hover:from-emerald-400 hover:to-teal-300 transition-all duration-200 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="text-sm text-slate-300 mt-6 text-center">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-300 hover:text-emerald-200 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/10 py-4 px-6 backdrop-blur-md border-t border-white/20 flex-shrink-0 text-center text-slate-300 text-sm">
        © {new Date().getFullYear()} ProjectPM. All rights reserved.
      </footer>
    </div>
  );
}
