import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminLogin() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 async function handleLogin(e) {
  e.preventDefault();
  const username = e.target.username.value.trim();
  const password = e.target.password.value.trim();

  if (!username || !password) {
    return setMessage("Please fill all fields");
  }

  try {
    setLoading(true);
    setMessage("");

    const res = await fetch(`${import.meta.env.VITE_API_BASE}api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // ✅ send cookies
      body: JSON.stringify({ email: username, password }), // 👈 now matches backend
    });

    const data = await res.json();
    console.log("🧩 Login response:", data);

    if (!res.ok) {
      setMessage(data.error || data.message || "Invalid credentials");
      return;
    }

    if (data.token) {
      localStorage.setItem("adminToken", data.token);
    }

    navigate("/admin", { replace: true });

  } catch (error) {
    console.error(error);
    setMessage("Server error, please try again later");
  } finally {
    setLoading(false);
  }
}
  return (
    <section className="bg-gradient-to-br from-slate-50 to-slate-100 fixed top-0 left-0 w-full h-screen flex justify-center items-center px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-md bg-white border-2 border-slate-200 rounded-2xl p-6 sm:p-8 shadow-2xl my-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-4 sm:mb-6 bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Admin Login</h1>
        <p className="text-center text-gray-600 mb-6 sm:mb-8 text-xs sm:text-sm">
          Enter your credentials to access the admin panel.
        </p>

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          <div>
            <label htmlFor="username" className="block text-gray-700 mb-2 text-xs sm:text-sm font-medium">Email</label>
            <input
              type="text"
              id="username"
              placeholder="Enter admin email"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2 text-xs sm:text-sm font-medium">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter password"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 transition"
            />
            {message && <p className="text-xs ps-1 mt-1 text-red-500">{message}</p>}
          </div>
           <Link to="/" className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 transition block text-right mt-1">Back to Home</Link>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl ${
              loading ? "bg-gray-400 cursor-not-allowed text-white" : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminLogin;
