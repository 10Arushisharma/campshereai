import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> fe183888c2042d6c21e43802e39f44db90f765b1
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";

const Login = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
<<<<<<< HEAD
=======
=======
import { Mail, Lock, Eye, User, Briefcase } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup, loginWithGoogle } = useAuth();
>>>>>>> 66e74765270250cf239d6dba7e73fe97b971a73a
>>>>>>> fe183888c2042d6c21e43802e39f44db90f765b1

  const params = new URLSearchParams(location.search);
  const role = params.get("role") || "student";

  // 🎨 Role-based UI
  const roleConfig = {
    student: {
<<<<<<< HEAD
      title: "Student Login",
=======
<<<<<<< HEAD
      title: "Student Login",
=======
      title: isSignup ? "Student Signup" : "Student Login",
>>>>>>> 66e74765270250cf239d6dba7e73fe97b971a73a
>>>>>>> fe183888c2042d6c21e43802e39f44db90f765b1
      color: "text-blue-600",
      button: "bg-blue-700",
      ring: "focus-within:ring-blue-400", 
      gradient: "from-blue-100 via-blue-200 to-blue-300",
      iconBg: "bg-blue-100",
      icon: "👤",
    },
    admin: {
<<<<<<< HEAD
      title: "Admin Login",
=======
<<<<<<< HEAD
      title: "Admin Login",
=======
      title: isSignup ? "Admin Signup" : "Admin Login",
>>>>>>> 66e74765270250cf239d6dba7e73fe97b971a73a
>>>>>>> fe183888c2042d6c21e43802e39f44db90f765b1
      color: "text-red-500",
      button: "bg-red-600",
      ring: "focus-within:ring-red-400", 
      gradient: "from-red-100 via-red-200 to-red-300",
      iconBg: "bg-red-100",
      icon: "🔒",
    },
    recruiter: {
<<<<<<< HEAD
      title: "Recruiter Login",
=======
<<<<<<< HEAD
      title: "Recruiter Login",
=======
      title: isSignup ? "Recruiter Signup" : "Recruiter Login",
>>>>>>> 66e74765270250cf239d6dba7e73fe97b971a73a
>>>>>>> fe183888c2042d6c21e43802e39f44db90f765b1
      color: "text-green-600",
      button: "bg-green-700",
      ring: "focus-within:ring-green-400", 
      gradient: "from-green-100 via-green-200 to-green-300",
      iconBg: "bg-green-100",
      icon: "💼",
    },
  };

  const current = roleConfig[role];

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> fe183888c2042d6c21e43802e39f44db90f765b1
   const handleSubmit = (e) => {
    e.preventDefault();

 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

 if (showSignup && !fullName) {
      alert("Please enter full name");
      return;
    }

  if (!email || !password) {
    alert("All fields are required");
    return;
  }

  if (!emailRegex.test(email)) {
    alert("Please enter a valid email (e.g. example@gmail.com)");
    return;
  }

  if (password.length < 4) {
    alert("Password must be at least 4 characters");
    return;
  }

// Console output
 console.table({
      FullName: fullName,
      Email: email,
      Password: password,
      Role: role,
      Mode: showSignup ? "Signup" : "Login",
    });

    // SAVE ROLE
    localStorage.setItem("role", role);
    localStorage.setItem(
  "userName",
  fullName || email.split("@")[0]
);

    // SUCCESS ALERT
    alert(
      showSignup
        ? "Account created successfully!"
        : "Login successful!"
    );

  if (role === "student") {
  localStorage.setItem("role", "student");
  navigate("/student-dashboard");
}

else if (role === "recruiter") {
  localStorage.setItem("role", "recruiter"); 
  navigate("/recruiter-dashboard");
}

else if (role === "admin") {
  localStorage.setItem("role", "admin");
  navigate("/admin-dashboard");
}
<<<<<<< HEAD
=======
=======
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !password || (isSignup && !name)) {
      setError("All required fields must be filled");
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

    if (isSignup && role === "recruiter" && !companyName) {
      setError("Company Name is required for recruiters");
      return;
    }

    try {
      setLoading(true);
      if (isSignup) {
        await signup(name, email, password, role, companyName);
      } else {
        await login(email, password, role);
      }
      navigate(`/${role}-dashboard`);
    } catch (err) {
      setError(`Failed to ${isSignup ? "sign up" : "log in"}: ${err.message}`);
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
>>>>>>> 66e74765270250cf239d6dba7e73fe97b971a73a
>>>>>>> fe183888c2042d6c21e43802e39f44db90f765b1
  };

  return (
    <div
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> fe183888c2042d6c21e43802e39f44db90f765b1
      className={`min-h-screen w-screen flex items-center justify-center bg-gradient-to-br ${current.gradient}`}
    >
      {/* CARD */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center">
<<<<<<< HEAD
=======
=======
      className={`min-h-screen w-screen flex items-center justify-center bg-gradient-to-br ${current.gradient} py-10`}
    >
      {/* CARD */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center my-auto">
>>>>>>> 66e74765270250cf239d6dba7e73fe97b971a73a
>>>>>>> fe183888c2042d6c21e43802e39f44db90f765b1

        {/* ICON */}
        <div className={`w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-2xl shadow ${current.iconBg}`}>
          <span className="text-2xl">{current.icon}</span>
        </div>

        {/* TITLE */}
        <h2 className={`text-2xl sm:text-3xl font-bold mb-2 ${current.color}`}>
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> fe183888c2042d6c21e43802e39f44db90f765b1
          {showSignup
            ? `${role.charAt(0).toUpperCase() + role.slice(1)} Sign Up`
            : current.title}
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          {showSignup
            ? "Create your new account"
            : "Welcome back! Please enter your credentials"}
        </p>
         {showSignup && (
          <div
            className={`flex items-center border rounded-lg px-3 mb-4 focus-within:ring-2 ${current.ring}`}
          >
            <User className="text-gray-400 w-5" />

            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 outline-none text-sm sm:text-base"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        )}

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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
           {showPassword ? (
            <EyeOff
              className="text-gray-400 w-5 cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <Eye
              className="text-gray-400 w-5 cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>
         {/* SUBMIT BUTTON */}
        <button
             onClick={handleSubmit}
            style={{ backgroundColor:
              role === "student"
                 ? "#4a72e0"
                 : role === "admin"
                 ? "#e64c4c"
                 : "#39dc75",
            }}
          className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-all shadow-lg hover:opacity-90"
        >
         {showSignup ? "Create Account" : "Login"}
        </button>

        {/* TOGGLE LOGIN/SIGNUP */}
        <p className="text-sm text-gray-500 mt-5">
          {showSignup
            ? "Already have an account? "
            : "Don't have an account? "}

          <span
            onClick={() => setShowSignup(!showSignup)}
            className={`font-semibold cursor-pointer hover:underline ${current.color}`}
          >
            {showSignup ? "Login" : "Sign Up"}
          </span>
        </p>
        
<<<<<<< HEAD
=======
=======
          {current.title}
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          {isSignup ? "Create an account to get started" : "Welcome back! Please enter your credentials"}
        </p>

        {error && <div className="mb-4 text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* FULL NAME (Only for Signup) */}
          {isSignup && (
            <div className={`flex items-center border rounded-lg px-3 mb-4 focus-within:ring-2 ${current.ring}`}>
              <User className="text-gray-400 w-5" />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 outline-none text-sm sm:text-base"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          {/* COMPANY NAME (Only for Recruiter Signup) */}
          {isSignup && role === "recruiter" && (
            <div className={`flex items-center border rounded-lg px-3 mb-4 focus-within:ring-2 ${current.ring}`}>
              <Briefcase className="text-gray-400 w-5" />
              <input
                type="text"
                placeholder="Company Name"
                className="w-full p-3 outline-none text-sm sm:text-base"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
          )}

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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Eye
              className="text-gray-400 w-5 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          
          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-sm font-semibold text-black ${current.button} shadow-lg hover:shadow-xl transition-all disabled:opacity-50`}
          >
            {loading ? (isSignup ? "Signing up..." : "Logging in...") : (isSignup ? "Sign Up" : "Login")}
          </button>
        </form>

        {/* TOGGLE SIGNUP/LOGIN */}
        <div className="mt-4 text-sm text-gray-600">
          {isSignup ? "Already have an account? " : "Don't have an account? "}
          <button 
            type="button"
            className={`font-semibold hover:underline ${current.color}`}
            onClick={() => {
              setIsSignup(!isSignup);
              setError("");
            }}
          >
            {isSignup ? "Login here" : "Sign up here"}
          </button>
        </div>

>>>>>>> 66e74765270250cf239d6dba7e73fe97b971a73a
>>>>>>> fe183888c2042d6c21e43802e39f44db90f765b1
        {/* DIVIDER */}
        <div className="my-5 text-gray-400 text-sm">or</div>

        {/* GOOGLE BUTTON */}
<<<<<<< HEAD
        <button className="w-full border py-3 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base hover:bg-gray-50 transition-all">
=======
<<<<<<< HEAD
        <button className="w-full border py-3 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base hover:bg-gray-50 transition-all">
=======
        <button 
          onClick={handleGoogleLogin}
          type="button"
          disabled={loading}
          className="w-full border py-3 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base hover:bg-gray-50 disabled:opacity-50"
        >
>>>>>>> 66e74765270250cf239d6dba7e73fe97b971a73a
>>>>>>> fe183888c2042d6c21e43802e39f44db90f765b1
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5"
          />
<<<<<<< HEAD

          {showSignup ? "Sign Up with Google" : "Login with Google"}
=======
<<<<<<< HEAD

          {showSignup ? "Sign Up with Google" : "Login with Google"}
=======
          {isSignup ? "Sign up with Google" : "Login with Google"}
>>>>>>> 66e74765270250cf239d6dba7e73fe97b971a73a
>>>>>>> fe183888c2042d6c21e43802e39f44db90f765b1
        </button>
      </div>
    </div>
  );
};

export default Login;