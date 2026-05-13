import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import Login from "./components/pages/Login";
import StudentPortal from "./components/pages/StudentPortal";
import RecruiterPortal from "./components/pages/RecruiterPortal";
import AdminPortal from "./components/pages/AdminPortal";

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> fe183888c2042d6c21e43802e39f44db90f765b1



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/student-dashboard/*" element={<StudentPortal/>} />
        <Route path="/recruiter-dashboard/*" element={<RecruiterPortal/>} />
        <Route path="/admin-dashboard/*" element={<AdminPortal/>} />
      </Routes>
    </Router>
<<<<<<< HEAD
=======
=======
import { AuthProvider } from "./components/context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/student-dashboard/*" 
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentPortal />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recruiter-dashboard/*" 
            element={
              <ProtectedRoute allowedRoles={["recruiter"]}>
                <RecruiterPortal />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-dashboard/*" 
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPortal />
              </ProtectedRoute>
            } 
          />

        </Routes>
      </Router>
    </AuthProvider>
>>>>>>> 66e74765270250cf239d6dba7e73fe97b971a73a
>>>>>>> fe183888c2042d6c21e43802e39f44db90f765b1
  );
}

export default App;