import React from 'react';
import { Routes, Route } from "react-router-dom";
import RecruiterDashboard from '../recruiter/RecruiterDashboard';
import PostJob from '../recruiter/PostJob';
import Sidebar from '../common/Sidebar';
import CandidateRanking from '../recruiter/CandidateRanking';

function RecruiterPortal() {
  return (
  <div className="flex min-h-screen w-full">
    <Sidebar/>
      
      <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 space-y-5 min-h-screen bg-gradient-to-br from-[#eef2ff] via-white to-[#f8fafc] dark:from-[#0f172a] dark:to-[#020617] transition">

        <Routes>
          <Route path="/" element={<RecruiterDashboard />} />
          <Route path="jobs" element={<PostJob />} />
          <Route path="candidate" element={<CandidateRanking />} />
          <Route path="analytics" element={<CandidateRanking />} />
           </Routes>

      </div>
    </div>
  )
}

export default RecruiterPortal;
