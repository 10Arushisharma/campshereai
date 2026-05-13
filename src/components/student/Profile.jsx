import React from 'react';
import { useState } from "react";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Globe,
  Edit2,
  Check,
  X,
} from "lucide-react";

function Profile() {
  const initialProfile = {
    name: "Alex Johnson",
    role: "B.Tech Computer Science, 2025",
    email: "alex.johnson@university.edu",
    phone: "+91 98765 43210",
    location: "Bangalore, India",
    bio: "Passionate software engineer with AI/ML & full-stack focus.",
    college: "IIT Bangalore",
    degree: "B.Tech Computer Science",
    year: "2021 – 2025",
    cgpa: "8.5 / 10.0",
    github: "github.com/alexj",
    linkedin: "linkedin.com/in/alexj",
    website: "alexjohnson.dev",
  };

  const [profile, setProfile] = useState(initialProfile);
  const [draft, setDraft] = useState(initialProfile);
  const [editing, setEditing] = useState(false);

  const [skills, setSkills] = useState([
    "React",
    "Python",
    "Node.js",
    "SQL",
    "AWS",
  ]);

  const [newSkill, setNewSkill] = useState("");

  const handleSave = () => {
    setProfile(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (s) => {
    setSkills(skills.filter((item) => item !== s));
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">My Profile</h1>
            <p className="text-gray-500 text-sm">
              Manage your profile
            </p>
          </div>

          {editing ? (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 px-3 py-1 border rounded"
              >
                <X size={14} /> Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded"
              >
                <Check size={14} /> Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-grey-100 rounded"
            >
              <Edit2 size={14} /> Edit
            </button>
          )}
        </div>

        {/* PROFILE CARD */}
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">

            {/* Avatar */}
            <div className="relative w-20 h-20">
              <div className="w-full h-full rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl">
                A
              </div>
              {editing && (
                <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full">
                  <Camera size={12} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2">
              {editing ? (
                <>
                  <input
                    className="w-full border p-2 rounded"
                    value={draft.name}
                    onChange={(e) =>
                      setDraft({ ...draft, name: e.target.value })
                    }
                  />
                  <input
                    className="w-full border p-2 rounded"
                    value={draft.role}
                    onChange={(e) =>
                      setDraft({ ...draft, role: e.target.value })
                    }
                  />
                  <textarea
                    className="w-full border p-2 rounded"
                    value={draft.bio}
                    onChange={(e) =>
                      setDraft({ ...draft, bio: e.target.value })
                    }
                  />
                </>
              ) : (
                <>
                  <h2 className="text-lg font-semibold">{profile.name}</h2>
                  <p className="text-gray-500">{profile.role}</p>
                  <p className="text-sm">{profile.bio}</p>
                </>
              )}
            </div>
          </div>

          {/* CONTACT */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {["email", "phone", "location"].map((field) => (
              <div key={field} className="flex items-center gap-2">
                {editing ? (
                  <input
                    className="w-full border p-2 rounded"
                    value={draft[field]}
                    onChange={(e) =>
                      setDraft({ ...draft, [field]: e.target.value })
                    }
                  />
                ) : (
                  <span>{profile[field]}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* EDUCATION */}
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <GraduationCap size={18} /> Education
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["college", "degree", "year", "cgpa"].map((field) =>
              editing ? (
                <input
                  key={field}
                  className="border p-2 rounded"
                  value={draft[field]}
                  onChange={(e) =>
                    setDraft({ ...draft, [field]: e.target.value })
                  }
                />
              ) : (
                <div key={field}>
                  <p className="text-sm text-gray-500">{field}</p>
                  <p className="font-medium">{profile[field]}</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* SKILLS */}
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <h3 className="font-semibold mb-4">Skills</h3>

          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <div
                key={s}
                className="bg-gray-200 px-3 py-1 rounded flex items-center gap-1"
              >
                {s}
                {editing && (
                  <X
                    size={12}
                    className="cursor-pointer"
                    onClick={() => removeSkill(s)}
                  />
                )}
              </div>
            ))}
          </div>

          {editing && (
            <div className="flex gap-2 mt-3 flex-wrap">
              <input
                className="border p-2 rounded"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
              <button
                onClick={addSkill}
                className="bg-blue-600 text-white px-3 rounded"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* PROJECTS */}
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <h3 className="font-semibold mb-4">Projects</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border p-3 rounded">
              <p className="font-semibold">AI Resume Analyzer</p>
              <p className="text-sm text-gray-500">
                NLP-based resume scoring system
              </p>
            </div>

            <div className="border p-3 rounded">
              <p className="font-semibold">Campus Connect</p>
              <p className="text-sm text-gray-500">
                Student social platform
              </p>
            </div>

            <div className="border p-3 rounded">
              <p className="font-semibold">Stock Predictor</p>
              <p className="text-sm text-gray-500">
                ML-based stock prediction
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
