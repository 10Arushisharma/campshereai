import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/pages/LandingPage";
import Login from "./components/pages/Login";
import StudentPortal from "./components/pages/StudentPortal";
import RecruiterPortal from "./components/pages/RecruiterPortal";
import AdminPortal from "./components/pages/AdminPortal";

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
  );
}

export default App;