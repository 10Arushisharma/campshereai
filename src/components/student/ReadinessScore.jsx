import React, { useState } from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import {
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Zap,
  BookOpen,
} from "lucide-react";

/* UI */
const Badge = ({ children }) => (
  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-semibold">
    {children}
  </span>
);

const Button = ({ children }) => (
  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
    {children}
  </button>
);

const ReadinessChart = ({ value }) => (
  <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-blue-600 flex items-center justify-center text-xl font-bold text-blue-600">
    {value}%
  </div>
);

/* DATA */
const radarData = [
  { skill: "Frontend", score: 92 },
  { skill: "Backend", score: 70 },
  { skill: "Data Science", score: 78 },
  { skill: "DSA", score: 85 },
  { skill: "System Design", score: 65 },
  { skill: "Communication", score: 80 },
];

const categoryScores = [
  { label: "Technical Skills", score: 88, icon: Zap },
  { label: "Academic Performance", score: 85, icon: BookOpen },
  { label: "Project Experience", score: 80, icon: Target },
  { label: "Communication", score: 75, icon: TrendingUp },
];

const improvements = [
  { text: "Complete System Design course", done: false },
  { text: "Solve 50 LeetCode problems", done: false },
  { text: "Add 2 full-stack projects", done: true },
  { text: "Get AWS certification", done: false },
  { text: "Contribute to open-source", done: true },
];

const tierData = [
  { tier: "Tier 1", match: 82 },
  { tier: "Tier 2", match: 94 },
  { tier: "FAANG", match: 61 },
  { tier: "Startups", match: 97 },
  { tier: "MNCs", match: 88 },
];

function ReadinessScore() {
  const [tasks, setTasks] = useState(improvements);

  const toggle = (i) => {
    setTasks((prev) =>
      prev.map((t, idx) =>
        idx === i ? { ...t, done: !t.done } : t
      )
    );
  };

  const completed = tasks.filter((t) => t.done).length;
  const score = Math.round(82 + (completed / tasks.length) * 10);

  return (
    <div className="w-full p-4 md:p-6 lg:p-8 space-y-5">

      {/* NAVBAR */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 className="font-semibold text-lg">Readiness Score</h1>
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
          A
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-10 py-6">

        <div className="w-full space-y-6">

          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Readiness Score
            </h1>
            <p className="text-gray-500 text-sm">
              AI-powered placement analysis
            </p>
          </div>

          {/* HERO SECTION */}
          <div className="bg-white rounded-xl border shadow p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
            <div className="flex flex-col items-center justify-center min-w-[120px]">
              <ReadinessChart value={score} />
              <div className="mt-2">
                <Badge>AI Verified</Badge>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="font-bold text-lg">
                  Your Profile is{" "}
                  <span className="text-blue-600">
                    Highly Competitive
                  </span>
                </h2>
                <p className="text-sm text-gray-500">
                  Improve your score by completing tasks below.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoryScores.map((cat) => (
                  <div
                    key={cat.label}
                    className="flex items-center gap-3 p-3 border rounded-lg"
                  >
                    <cat.icon className="text-blue-600" size={18} />
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{cat.label}</span>
                        <span className="font-bold text-blue-600">
                          {cat.score}%
                        </span>
                      </div>
                      <div className="bg-gray-200 h-1.5 rounded-full">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${cat.score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border shadow p-5">
              <h3 className="text-sm font-semibold mb-4">Skill Radar</h3>
              <div className="w-full h-[260px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <Radar
                      dataKey="score"
                      fill="#2563eb"
                      fillOpacity={0.3}
                      stroke="#2563eb"
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* BAR */}
            <div className="bg-white rounded-xl border shadow p-5">
              <h3 className="text-sm font-semibold mb-4">
                Company Match %
              </h3>
              <div className="w-full h-[260px] sm:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tierData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="tier" type="category" />
                    <Tooltip />
                    <Bar dataKey="match" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* TASKS */}
          <div className="bg-white rounded-xl border shadow p-5">
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Improvement Tasks</h3>
              <Badge>{completed}/{tasks.length}</Badge>
            </div>

            <div className="space-y-2">
              {tasks.map((task, i) => (
                <button
                  key={i}
                  onClick={() => toggle(i)}
                  className={`w-full flex items-center gap-3 p-3 border rounded-lg transition ${task.done
                      ? "bg-blue-50"
                      : "hover:bg-gray-100"
                    }`}
                >
                  {task.done ? (
                    <CheckCircle className="text-blue-600" />
                  ) : (
                    <AlertCircle className="text-gray-400" />
                  )}
                  <span
                    className={`text-sm ${task.done
                        ? "line-through text-gray-400"
                        : ""
                      }`}
                  >
                    {task.text}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <Button>Generate Full AI Report</Button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default ReadinessScore;