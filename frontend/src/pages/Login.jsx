import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Email and Password are required.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password);
      toast.success("Logged in successfully!");

      if (res.role === "head") navigate("/head");
      else if (res.role === "tl") navigate("/tl");
      else if (res.role === "employee") navigate("/employee");
      else toast.error("Invalid role");
    } catch (e) {
      toast.error(e.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-white/10 py-4 px-6 backdrop-blur-md border-b border-white/20 flex justify-center">
        <h1 className="text-xl font-bold text-white">Project Management System</h1>
      </header>

      <main className="flex flex-grow items-center justify-center p-6">
        <div className="w-full max-w-5xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden md:flex">
          <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 p-8 text-white">
            <div className="flex flex-col h-full justify-center">
              <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
              <p className="mb-8 text-slate-300">
                Sign in to access your dashboard and manage your projects efficiently.
              </p>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="mb-2">Secure login</p>
                <p>Quick access</p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-sm text-slate-300 mb-6">
              Enter your credentials to continue
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                autoComplete="username"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 rounded-lg bg-white/20 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                autoComplete="current-password"
              />

              <button
                type="submit"
                disabled={isLoading}
                className={`mt-2 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 font-medium text-white shadow-md hover:from-emerald-400 hover:to-teal-300 transition-all duration-200 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <p className="text-sm text-slate-300 mt-6 text-center">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-emerald-300 hover:text-emerald-200 transition-colors"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
