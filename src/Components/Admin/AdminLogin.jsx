import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AdminLogin() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const emailTrimmed = email.trim();

    if (!emailTrimmed || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${import.meta.env.VITE_API_BASE}api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: emailTrimmed, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || data.message || "Invalid credentials");
        return;
      }

      if (data.token) {
        localStorage.setItem("adminToken", data.token);
      }

      toast.success("Admin login successful");
      navigate("/admin", { replace: true });

    } catch (error) {
      console.error(error);
      toast.error("Server error, please try again later");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="auth-page bg-slate-50">
      <div className="auth-card page-card w-full max-w-md border-slate-200 p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6 text-teal-700">
          Admin Login
        </h1>

        <p className="text-center text-slate-500 mb-5 sm:mb-6 text-xs sm:text-sm">
          Sign in to access admin panel
        </p>

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-slate-700 mb-2 text-xs sm:text-sm font-medium"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-slate-700 mb-2 text-xs sm:text-sm font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition"
            />
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="text-xs sm:text-sm text-teal-600 hover:text-teal-700 font-semibold"
            >
              Back to Home
            </Link>
            <Link
              to="/login"
              className="text-xs sm:text-sm text-slate-500 hover:text-slate-700"
            >
              Customer login
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold text-sm sm:text-base transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
