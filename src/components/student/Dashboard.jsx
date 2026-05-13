import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  GraduationCap,
  Sparkles,
  ChevronRight,
  Terminal,
  Cloud,
  Database,
  Bell,
  Settings,
} from "lucide-react";

/* Badge */
const Badge = ({ children, className = "" }) => (
  <span
    className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}
  >
    {children}
  </span>
);

/* Button */
const Button = ({ children, className = "", ...props }) => (
  <button className={`rounded-lg ${className}`} {...props}>
    {children}
  </button>
);

/* Readiness Chart */
const ReadinessChart = ({ value }) => (
  <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center text-lg font-bold">
    {value}%
  </div>
);

const skills = [
  { label: "Frontend Development", value: 92 },
  { label: "Data Science & NLP", value: 78 },
  { label: "Problem Solving", value: 85 },
];

const applications = [
  {
    title: "Software Engineer - AI/ML",
    company: "Neural Systems Inc.",
    status: "PLACED",
    icon: Terminal,
  },
  {
    title: "Junior Frontend Developer",
    company: "Skyline Digital",
    status: "PENDING",
    icon: Cloud,
  },
  {
    title: "Data Analyst Trainee",
    company: "Global Insight Corp",
    status: "READY",
    icon: Database,
  },
];

const statusColors = {
  PLACED: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  READY: "bg-blue-100 text-blue-700",
};

function Dashboard() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const fileInputRef = useRef();

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      console.log("Selected file:", file);
    }
  };

  const { pathname } = useLocation();

  const pageTitles = {
    "/student-dashboard": "Placement Intelligence",
    "/student-dashboard/jobs": "Job Listings",
    "/student-dashboard/profile": "Profile",
    "/student-dashboard/readiness-score": "Readiness Score",
  };

  const matchedPath = Object.keys(pageTitles).find((path) =>
    pathname.startsWith(path)
  );

  const title = matchedPath
    ? pageTitles[matchedPath]
    : "Placement Intelligence";

  return (
    <div className="min-h-screen space-y-5 bg-gradient-to-br from-[#eef2ff] via-white to-[#f8fafc] p-6">
      {/* HEADER */}
      <div className="bg-white border rounded-xl px-6 py-4 flex items-center justify-between shadow-sm">
        <h2 className="text-base font-semibold text-gray-800">{title}</h2>

        <div className="flex items-center gap-3 relative">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowSettings(false);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition"
            >
              <Bell size={18} />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white border rounded-2xl shadow-lg p-4 z-50">
                <h4 className="font-semibold mb-3">Notifications</h4>

                <div className="space-y-3 text-sm">
                  <div className="border-b pb-2">
                    New company added for placements
                  </div>

                  <div className="border-b pb-2">
                    12 students shortlisted today
                  </div>

                  <div>Placement report updated</div>
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSettings(!showSettings);
                setShowNotifications(false);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition"
            >
              <Settings size={18} />
            </button>

            {showSettings && (
              <div className="absolute right-0 mt-2 w-56 bg-white border rounded-2xl shadow-lg p-2 z-50">
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm">
                  Profile Settings
                </button>

                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm">
                  Dashboard Preferences
                </button>

                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm text-red-500">
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
            {(localStorage.getItem("userName") || "U")
              .charAt(0)
              .toUpperCase()}
          </div>
        </div>
      </div>

      {/* WELCOME */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back,{" "}
            {localStorage.getItem("userName") || "User"}.
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Your placement journey is 82% ready for the current cycle.
          </p>
        </div>

        <div className="flex gap-3">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <Button
            onClick={handleButtonClick}
            className="bg-blue-600 text-white px-5 py-2.5 text-sm font-semibold hover:bg-blue-700"
          >
            Upload Resume
          </Button>

          <Button className="border px-5 py-2.5 text-sm font-semibold hover:bg-gray-100">
            View Resume Analysis
          </Button>
        </div>
      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Readiness */}
        <div className="bg-white rounded-xl p-5 shadow border flex flex-col items-center">
          <ReadinessChart value={82} />

          <h3 className="mt-3 font-semibold">Readiness Score</h3>
        </div>

        {/* Academic */}
        <div className="bg-white rounded-xl p-5 shadow border">
          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase">
            <GraduationCap size={18} />
            Academic Standing
          </div>

          <div className="mt-2">
            <span className="text-4xl font-bold">8.5</span>

            <span className="text-sm text-gray-500 ml-1">
              / 10.0 CGPA
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {[9.1, 8.8, 8.5, 8.7, 8.5].map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs w-10">Sem {i + 1}</span>

                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full"
                    style={{ width: `${(v / 10) * 100}%` }}
                  />
                </div>

                <span className="text-xs">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-xl p-5 shadow border">
          <div className="flex items-center gap-2 text-gray-500 text-xs uppercase">
            <Sparkles size={18} />
            Core Competencies
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {[
              "React",
              "Python",
              "NLP",
              "TypeScript",
              "Node.js",
              "SQL",
              "Machine Learning",
              "AWS",
            ].map((skill) => (
              <Badge key={skill} className="bg-gray-200">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* SKILLS */}
      <div className="bg-white rounded-xl p-5 shadow border">
        <h3 className="font-semibold mb-4">Skill Analysis</h3>

        {skills.map((skill) => (
          <div key={skill.label} className="mb-3">
            <div className="flex justify-between text-sm">
              <span>{skill.label}</span>
              <span>{skill.value}%</span>
            </div>

            <div className="bg-gray-200 h-2 rounded-full">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${skill.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
        {/* Applications */}
        <div className="md:col-span-3 bg-white p-5 rounded-xl shadow border">
          <h3 className="font-semibold mb-4">Applications</h3>

          {applications.map((app) => (
            <div
              key={app.title}
              className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg"
            >
              <app.icon />

              <div className="flex-1">
                <p className="font-semibold text-sm">{app.title}</p>

                <p className="text-xs text-gray-500">
                  {app.company}
                </p>
              </div>

              <span
                className={`text-xs px-2 py-1 rounded ${statusColors[app.status]}`}
              >
                {app.status}
              </span>
            </div>
          ))}
        </div>

        {/* Upcoming */}
        <div className="md:col-span-2 space-y-3">
          <div className="bg-white shadow border p-4 rounded-xl font-bold">
            <h2>Upcoming Drive</h2>
          </div>

          {["Microsoft", "AWS Workshop", "Mock Interview"].map(
            (item) => (
              <div
                key={item}
                className="bg-white p-4 rounded-xl shadow border flex justify-between hover:bg-blue-600 hover:text-white transition"
              >
                <p>{item}</p>

                <ChevronRight />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;