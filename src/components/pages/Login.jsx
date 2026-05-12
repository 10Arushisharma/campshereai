import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const params = new URLSearchParams(location.search);
  const role = params.get("role") || "student";

  // 🎨 Role-based UI
  const roleConfig = {
    student: {
      title: "Student Login",
      color: "text-blue-600",
      button: "bg-blue-700",
      ring: "focus-within:ring-blue-400", 
      gradient: "from-blue-100 via-blue-200 to-blue-300",
      iconBg: "bg-blue-100",
      icon: "👤",
    },
    admin: {
      title: "Admin Login",
      color: "text-red-500",
      button: "bg-red-600",
      ring: "focus-within:ring-red-400", 
      gradient: "from-red-100 via-red-200 to-red-300",
      iconBg: "bg-red-100",
      icon: "🔒",
    },
    recruiter: {
      title: "Recruiter Login",
      color: "text-green-600",
      button: "bg-green-700",
      ring: "focus-within:ring-green-400", 
      gradient: "from-green-100 via-green-200 to-green-300",
      iconBg: "bg-green-100",
      icon: "💼",
    },
  };

  const current = roleConfig[role];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email (e.g. example@gmail.com)");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      await login(email, password, role);
      navigate(`/${role}-dashboard`);
    } catch (err) {
      setError("Failed to log in: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      await loginWithGoogle(role);
      navigate(`/${role}-dashboard`);
    } catch (err) {
      setError("Failed to log in with Google: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen w-screen flex items-center justify-center bg-gradient-to-br ${current.gradient}`}
    >
      {/* CARD */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center">

        {/* ICON */}
        <div className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl shadow ${current.iconBg}`}>
          <span className="text-2xl">{current.icon}</span>
        </div>

        {/* TITLE */}
        <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${current.color}`}>
          {current.title}
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          Welcome back! Please enter your credentials
        </p>

        {error && <div className="mb-4 text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}

        {/* EMAIL */}
        <div className={`flex items-center border rounded-lg px-3 mb-4 focus-within:ring-2 ${current.ring}`}>
          <Mail className="text-gray-400 w-5" />
          <input
            type="email"
            placeholder="Email address"
            className="w-full p-3 outline-none text-sm sm:text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className={`flex items-center border rounded-lg px-3 mb-4 focus-within:ring-2 ${current.ring}`}>
          <Lock className="text-gray-400 w-5" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 outline-none text-sm sm:text-base"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Eye
            className="text-gray-400 w-5 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
        />
        </div>
        
        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-sm font-semibold text-black ${current.button} shadow-lg hover:shadow-xl transition-all disabled:opacity-50`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* DIVIDER */}
        <div className="my-5 text-gray-400 text-sm">or</div>

        {/* GOOGLE BUTTON */}
        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full border py-3 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base hover:bg-gray-50 disabled:opacity-50"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5"
          />
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;