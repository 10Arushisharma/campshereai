import React from "react";

const RecruiterDashboard = () => {
  return (
    <div className="flex w-full bg-gradient-to-br from-[#eef2ff] via-white to-[#f8fafc] dark:from-[#0f172a] dark:to-[#020617] transition ">

      {/* SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-[#f2f4f6] py-6 pr-4">
        <div className="px-6 mb-8">
          <h2 className="text-lg font-extrabold text-[#24389c]">
            CampSphere
          </h2>
          <p className="text-xs text-gray-500">Management Portal</p>
        </div>

        <nav className="flex-1 space-y-1">
          <div className="flex items-center px-6 py-3 bg-white text-[#24389c] rounded-r-xl shadow-sm">
            Dashboard
          </div>
          <div className="px-6 py-3 text-gray-600 hover:bg-gray-200/50">Jobs</div>
          <div className="px-6 py-3 text-gray-600 hover:bg-gray-200/50">Candidates</div>
          <div className="px-6 py-3 text-gray-600 hover:bg-gray-200/50">Analytics</div>
          <div className="px-6 py-3 text-gray-600 hover:bg-gray-200/50">Companies</div>
        </nav>

        <div className="px-6 mb-6">
          <button className="w-full bg-gradient-to-r from-[#24389c] to-[#3f51b5] text-white py-3 rounded-xl font-semibold shadow-md">
            Post New Job
          </button>
        </div>

        <div className="px-6 space-y-2">
          <div className="text-gray-600">Support</div>
          <div className="text-gray-600">Logout</div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}
        <header className="flex justify-between items-center px-8 h-16 bg-[#f7f9fb]">
          <input
            placeholder="Search applications..."
            className="bg-[#e0e3e5] px-4 py-2 rounded-md text-sm w-72"
          />

          <div className="flex items-center gap-8">
            <span className="text-[#24389c] font-bold border-b-2 border-[#24389c] pb-1">
              Dashboard
            </span>
            <span className="text-gray-500">Activity</span>
            <span className="text-gray-500">Reports</span>
          </div>
        </header>

        {/* CONTENT */}
        <main className="p-8 space-y-8 max-w-7xl mx-auto w-full">

          {/* HEADER */}
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h2 className="text-3xl font-bold">Recruiter Overview</h2>
              <p className="text-gray-500 text-sm">
                Welcome back, Sarah. Here is what's happening with your placements today.
              </p>
            </div>

            <button className="bg-gradient-to-r from-[#24389c] to-[#3f51b5] text-white px-6 py-3 rounded-xl shadow-lg">
              + Post New Job
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <StatCard title="Total Applications" value="1,284" extra="+12%" />
            <StatCard title="Pending Shortlists" value="42" extra="5 New" />
            <StatCard title="Active Job Postings" value="18" />
            <StatCard title="Selection Rate" value="24.5%" extra="+3%" />

          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT TABLE */}
            <div className="lg:col-span-2">

              <div className="flex justify-between mb-4">
                <h3 className="text-xl font-bold">Recent Job Postings</h3>
                <span className="text-[#24389c] text-sm">View All</span>
              </div>

              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 text-gray-500 text-xs uppercase">
                    <tr>
                      <th className="p-4 text-left">Job Title</th>
                      <th>Date</th>
                      <th>Applicants</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    <Row title="Senior Software Engineer" apps="142" />
                    <Row title="Product Marketing Manager" apps="89" />
                    <Row title="UX Designer" apps="312" status="Closed" />
                    <Row title="Data Scientist" apps="56" />
                  </tbody>
                </table>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-6">

              <Card title="Interviews">
                <div className="space-y-3">
                  <Item text="Alex Rivera - 10:30 AM" />
                  <Item text="Jamie Chen - 02:00 PM" />
                </div>
              </Card>

              <Card title="Top Candidates">
                <Item text="Morgan Vance - 98%" />
                <Item text="Elara Smith - 95%" />
                <Item text="Daniel Bae - 92%" />
              </Card>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

/* COMPONENTS */

const StatCard = ({ title, value, extra }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="flex justify-between">
      <span className="text-sm text-gray-500">{title}</span>
      {extra && <span className="text-xs text-blue-500">{extra}</span>}
    </div>
    <h3 className="text-2xl font-bold mt-2">{value}</h3>
  </div>
);

const Row = ({ title, apps, status = "Live" }) => (
  <tr className="border-t">
    <td className="p-4">{title}</td>
    <td>Oct</td>
    <td>{apps}</td>
    <td>
      <span
        className={`px-2 py-1 text-xs rounded ${
          status === "Closed"
            ? "bg-gray-200"
            : "bg-indigo-100 text-indigo-700"
        }`}
      >
        {status}
      </span>
    </td>
  </tr>
);

const Card = ({ title, children }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm">
    <h3 className="font-semibold mb-3">{title}</h3>
    {children}
  </div>
);

const Item = ({ text }) => (
  <div className="p-3 bg-gray-100 rounded-lg">{text}</div>
);

export default RecruiterDashboard;