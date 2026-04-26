import React from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "../student/Dashboard";
import JobRecommendation from "../student/JobRecommendation";
import ReadinessScore from "../student/ReadinessScore";
import Profile from "../student/Profile";
import Sidebar from "../common/Sidebar";

function StudentPortal() {
  return (
    <div className="flex min-h-screen w-full">

      <Sidebar />
      
      <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 space-y-5 min-h-screen bg-gradient-to-br from-[#eef2ff] via-white to-[#f8fafc] dark:from-[#0f172a] dark:to-[#020617] transition">

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="jobs" element={<JobRecommendation />} />
          <Route path="profile" element={<Profile />} />
          <Route path="readiness-score" element={<ReadinessScore />} />
        </Routes>

      </div>
    </div>
  );
}

export default StudentPortal;