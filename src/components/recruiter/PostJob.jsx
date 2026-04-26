import React, { useState } from "react";
import {
  Plus,
  Search,
  MapPin,
  Users,
  Calendar,
  MoreHorizontal,
  Trash2 ,
} from "lucide-react";

const initialJobs = [
  { id: 1, title: "Senior Software Engineer", dept: "Engineering", type: "Full-time", location: "Bangalore, IN", applicants: 142, date: "Oct 24, 2023", status: "LIVE", description: "Build scalable backend systems and lead a team of 3." },
  { id: 2, title: "Product Marketing Manager", dept: "Marketing", type: "Contract", location: "Mumbai, IN", applicants: 89, date: "Oct 22, 2023", status: "LIVE", description: "Drive go-to-market strategy for new product launches." },
  { id: 3, title: "UX Designer (Junior)", dept: "Design", type: "Internship", location: "Remote", applicants: 312, date: "Oct 15, 2023", status: "CLOSED", description: "Create user-centered designs." },
  { id: 4, title: "Data Scientist", dept: "Analytics", type: "Full-time", location: "Hyderabad, IN", applicants: 56, date: "Oct 12, 2023", status: "LIVE", description: "Build ML models." },
  { id: 5, title: "Backend Engineer", dept: "Engineering", type: "Full-time", location: "Pune, IN", applicants: 98, date: "Oct 10, 2023", status: "LIVE", description: "Develop APIs." },
  { id: 6, title: "Sales Executive", dept: "Sales", type: "Full-time", location: "Delhi, IN", applicants: 23, date: "Oct 8, 2023", status: "DRAFT", description: "Manage clients." },
];

const statusStyle = {
  LIVE: "bg-blue-100 text-blue-600",
  CLOSED: "bg-gray-200 text-gray-600",
  DRAFT: "bg-yellow-100 text-yellow-700",
};

const filterOptions = ["All", "LIVE", "CLOSED", "DRAFT"];

function PostJob() {
  const [jobs, setJobs] = useState(initialJobs);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    dept: "",
    type: "",
    location: "",
    description: "",
  });

  const filtered = jobs.filter((j) => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.dept.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || j.status === filter;
    return matchSearch && matchFilter;
  });

  const handlePost = () => {
    if (!form.title || !form.dept || !form.type || !form.location) {
      alert("Fill all fields");
      return;
    }

    setJobs([
      ...jobs,
      {
        id: Date.now(),
        ...form,
        applicants: 0,
        date: new Date().toDateString(),
        status: "LIVE",
      },
    ]);

    setForm({
      title: "",
      dept: "",
      type: "",
      location: "",
      description: "",
    });

    setOpen(false);
  };

  const toggleStatus = (id) => {
  setJobs((prev) =>
    prev.map((job) => {
      if (job.id !== id) return job;

      let newStatus;
      if (job.status === "LIVE") newStatus = "CLOSED";
      else if (job.status === "CLOSED") newStatus = "DRAFT";
      else newStatus = "LIVE";

      return { ...job, status: newStatus };
    })
  );
};

const deleteJob = (id) => {
  setJobs((prev) => prev.filter((job) => job.id !== id));
};
  return (
    <div className="max-w-6xl space-y-5">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Job Postings</h1>
          <p className="text-sm text-gray-500">
            {jobs.filter((j) => j.status === "LIVE").length} active postings
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="!bg-blue-600 !text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={16} /> Post New Job
        </button>
      </div>

      {/* FILTER */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-2 text-gray-400" />
          <input
            className="pl-8 border rounded px-3 py-2 w-full"
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
             className={`px-3 py-1.5 rounded-lg text-sm border ${
  filter === f
    ? "!bg-blue-600 !text-white"
    : "!bg-gray-200 !text-black"
}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-xl border shadow-sm p-5 flex flex-col gap-3 hover:shadow-md"
          >
            <div className="flex justify-between">
              <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-lg">
                💼
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded ${statusStyle[job.status]}`}
                >
                  {job.status}
                </span>

                <button onClick={() => toggleStatus(job.id)}>
                  <MoreHorizontal size={10} />
                </button>

                <button onClick={() => deleteJob(job.id)}
                  className="p-1 rounded hover:bg-red-100 text-red-500"
                >
                   <Trash2 size={10} />
                </button>

              </div>
            </div>

            <div>
              <h3 className="font-semibold">{job.title}</h3>
              <p className="text-xs text-gray-500">
                {job.dept} • {job.type}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {job.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-auto pt-2 border-t">
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Users size={12} /> {job.applicants}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} /> {job.date}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-5 rounded-xl w-[350px] space-y-3">
            <h2 className="font-bold">Post New Job</h2>

            <input className="border p-2 w-full" placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <input className="border p-2 w-full" placeholder="Department"
              value={form.dept}
              onChange={(e) => setForm({ ...form, dept: e.target.value })}
            />

            <input className="border p-2 w-full" placeholder="Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />

            <input className="border p-2 w-full" placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />

            <textarea className="border p-2 w-full" placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button onClick={handlePost} className="!bg-blue-600 text-white px-3 py-1 rounded">
                Post
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default PostJob;
