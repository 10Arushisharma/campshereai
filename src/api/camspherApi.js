/**
 * CAMSPHER-AI — Central API Service
 * Connects all frontend components to the 4 backend models.
 *
 * Place this file at: src/api/camspherApi.js
 * Backend must be running at http://localhost:8000
 */

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ─── Core fetch wrapper ───────────────────────────────────────────────────────
async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || "Request failed");
    }
    return await res.json();
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err.message);
    throw err;
  }
}

// ════════════════════════════════════════════════════════════════════════════
// GENERAL
// ════════════════════════════════════════════════════════════════════════════

/** Check if backend is alive. Call on app start. */
export const checkHealth = () => request("/health");

// ════════════════════════════════════════════════════════════════════════════
// MODEL 1 — RESUME ANALYZER
// ════════════════════════════════════════════════════════════════════════════

/**
 * Analyze resume from pasted text.
 * @param {string} resumeText
 * @returns resume score, skills, projects, recommendations
 */
export const analyzeResumeText = (resumeText) =>
  request("/api/analyze/text", {
    method: "POST",
    body: JSON.stringify({ resume_text: resumeText }),
  });

/**
 * Analyze resume from uploaded PDF/DOCX file.
 * @param {File} file — from <input type="file">
 */
export const analyzeResumeFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return fetch(`${API_BASE}/api/analyze/file`, {
    method: "POST",
    body: formData,
  }).then((r) => r.json());
};

// ════════════════════════════════════════════════════════════════════════════
// MODEL 2 — JOB RECOMMENDER
// ════════════════════════════════════════════════════════════════════════════

/**
 * Get job recommendations from skills list.
 * @param {string[]} skills
 * @param {number}   cgpa
 * @param {string}   branch  — "CSE"|"IT"|"ECE"|"EEE"|"ME"|"Other"
 * @param {boolean}  has_backlogs
 * @param {number}   top_n
 */
export const getJobRecommendations = ({ skills, cgpa, branch, has_backlogs = false, top_n = 10 }) =>
  request("/api/recommend-jobs", {
    method: "POST",
    body: JSON.stringify({ skills, cgpa, branch, has_backlogs, top_n }),
  });

/** Browse all jobs with optional filters */
export const getAllJobs = ({ category, experience_level, search, limit = 20 } = {}) => {
  const params = new URLSearchParams();
  if (category)          params.append("category", category);
  if (experience_level)  params.append("experience_level", experience_level);
  if (search)            params.append("search", search);
  params.append("limit", limit);
  return request(`/api/jobs?${params}`);
};

/** Get all job categories, companies, experience levels */
export const getJobCategories = () => request("/api/jobs/categories");

/** Get single job detail */
export const getJobById = (jobId) => request(`/api/jobs/${jobId}`);

/** Get similar jobs */
export const getSimilarJobs = (jobId, limit = 5) =>
  request(`/api/jobs/${jobId}/similar?limit=${limit}`);

// ════════════════════════════════════════════════════════════════════════════
// MODEL 3 — SELECTION PREDICTOR
// ════════════════════════════════════════════════════════════════════════════

/**
 * Predict selection probability from direct inputs.
 * Use when you already have values from Model 1.
 */
export const predictSelection = (data) =>
  request("/api/predict", {
    method: "POST",
    body: JSON.stringify(data),
  });

/** Get Model 3 accuracy metrics */
export const getModel3Metrics = () => request("/api/model3/metrics");

// ════════════════════════════════════════════════════════════════════════════
// MODEL 4 — PLACEMENT READINESS  (PRIMARY ENDPOINT)
// ════════════════════════════════════════════════════════════════════════════

/**
 * MAIN ENDPOINT — runs all 4 models in one call.
 * Use this for the student dashboard.
 *
 * @param {string}  resume_text
 * @param {number}  cgpa
 * @param {string}  branch
 * @param {boolean} has_backlogs
 * @param {number}  mock_test_score  — optional (0-100)
 * @param {number}  top_n            — job recommendations count
 *
 * Returns:
 *   result.resume_analysis      → Model 1 output
 *   result.job_recommendations  → Model 2 output
 *   result.selection_prediction → Model 3 output
 *   result.placement_readiness  → Model 4 output
 */
export const getFullReadiness = ({ resume_text, cgpa, branch, has_backlogs = false, mock_test_score = null, top_n = 10 }) =>
  request("/api/readiness", {
    method: "POST",
    body: JSON.stringify({ resume_text, cgpa, branch, has_backlogs, mock_test_score, top_n }),
  });

/**
 * Compute readiness from raw values only (no resume text needed).
 * Use when the student has already been analyzed.
 */
export const getReadinessDirect = (data) =>
  request("/api/readiness/direct", {
    method: "POST",
    body: JSON.stringify(data),
  });