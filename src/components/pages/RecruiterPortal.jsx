import React from 'react';
import { Routes, Route } from "react-router-dom";
import RecruiterDashboard from '../recruiter/RecruiterDashboard'

function RecruiterPortal() {
  return (
  <div className="flex min-h-screen w-full">
      
      <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 space-y-5 min-h-screen bg-gradient-to-br from-[#eef2ff] via-white to-[#f8fafc] dark:from-[#0f172a] dark:to-[#020617] transition">

        <Routes>
          <Route path="/" element={<RecruiterDashboard />} />
           </Routes>

      </div>
    </div>
  )
}

export default RecruiterPortal;
