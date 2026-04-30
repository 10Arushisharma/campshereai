"""
CAMSPHER-AI Smart Placement API
FastAPI Backend — Model 1 + Model 2 + Model 3

Model 1: Resume Analyzer      (NLP: TF-IDF + NER + Keyword Matching)
Model 2: Job Recommender      (Content-based: Cosine Similarity)
Model 3: Selection Predictor  (ML: Logistic Regression + Random Forest + Decision Tree)

Changes from previous main.py:
  - Added Model 3 endpoints
  - Fixed route order bug (/api/jobs/categories must be before /api/jobs/{job_id})
  - Replaced deprecated @app.on_event("startup") with lifespan handler
  - Added /api/predict endpoint (direct feature input)
  - Added /api/predict-from-resume endpoint (pipeline: resume → jobs → prediction)
  - Added /api/model3/retrain endpoint
  - Added /api/model3/rules endpoint (decision tree rules)
  - Added /api/model3/metrics endpoint
"""

import sys
import os
from contextlib import asynccontextmanager

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
import uvicorn
import time

from models.resume_analyzer import ResumeAnalyzer
from utils.job_matcher import JobRecommendationEngine
from utils.selection_predictor import SelectionPredictor, get_predictor


# ─── Global model instances ───────────────────────────────────────────────────
analyzer:   Optional[ResumeAnalyzer]          = None
job_engine: Optional[JobRecommendationEngine] = None
predictor:  Optional[SelectionPredictor]      = None


# ─── Lifespan (replaces deprecated @app.on_event) ────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    global analyzer, job_engine, predictor
    print("=" * 60)
    print("  CAMSPHER-AI Smart Placement Platform — Starting")
    print("=" * 60)

    analyzer = ResumeAnalyzer()
    print(f"  [Model 1] Resume Analyzer: {len(analyzer.skills_extractor.all_skills)} skills loaded")

    job_engine = JobRecommendationEngine()
    print(f"  [Model 2] Job Recommender: {len(job_engine.jobs)} jobs loaded")

    predictor = SelectionPredictor()
    print(f"  [Model 3] Selection Predictor: loaded")

    print("=" * 60)
    print("  All systems operational!")
    print("=" * 60)
    yield
    # Shutdown cleanup (nothing needed here currently)


# ─── App ──────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="CAMSPHER-AI Smart Placement API",
    description="""
    AI-powered Placement Platform for College Students.

    **Model 1 — Resume Analyzer:** Skills extraction, scoring, ATS check
    **Model 2 — Job Recommender:** Content-based job matching (Cosine Similarity)
    **Model 3 — Selection Predictor:** Placement probability (LR + RF + DT)
    """,
    version="3.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production: replace with your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Pydantic schemas ─────────────────────────────────────────────────────────

class AnalyzeTextRequest(BaseModel):
    resume_text: str
    user_id: Optional[str] = None


class RecommendJobsRequest(BaseModel):
    skills:       List[str]    = Field(..., description="List of student skills")
    cgpa:         float        = Field(default=7.0, ge=0.0, le=10.0)
    branch:       str          = Field(default="CSE")
    has_backlogs: bool         = Field(default=False)
    top_n:        int          = Field(default=10, ge=1, le=50)


class RecommendFromResumeRequest(BaseModel):
    resume_text:  str   = Field(...)
    cgpa:         float = Field(default=7.0, ge=0.0, le=10.0)
    branch:       str   = Field(default="CSE")
    has_backlogs: bool  = Field(default=False)
    top_n:        int   = Field(default=10, ge=1, le=50)


class PredictRequest(BaseModel):
    """Direct feature input for Model 3 (no resume text needed)."""
    cgpa:                  float = Field(..., ge=0.0, le=10.0, description="CGPA on 10-point scale")
    resume_score:          float = Field(default=50.0, ge=0.0, le=100.0, description="Resume score from Model 1")
    skills_count:          int   = Field(default=10, ge=0)
    technical_skills:      int   = Field(default=8, ge=0)
    soft_skills:           int   = Field(default=2, ge=0)
    high_demand_skills:    int   = Field(default=3, ge=0)
    projects_count:        int   = Field(default=2, ge=0)
    exp_months:            int   = Field(default=0, ge=0)
    certifications:        int   = Field(default=1, ge=0)
    job_match_score:       float = Field(default=50.0, ge=0.0, le=100.0, description="Best job match score from Model 2")
    ats_score:             float = Field(default=50.0, ge=0.0, le=100.0)
    skill_diversity_score: float = Field(default=50.0, ge=0.0, le=100.0)
    has_backlogs:          bool  = Field(default=False)
    branch:                str   = Field(default="CSE")
    model_choice:          str   = Field(default="ensemble",
                                         description="ensemble | random_forest | logistic_regression | decision_tree")


class FullPipelineRequest(BaseModel):
    """Full pipeline: Resume text → Model 1 → Model 2 → Model 3."""
    resume_text:  str   = Field(..., description="Full resume text or PDF extracted text")
    cgpa:         float = Field(..., ge=0.0, le=10.0, description="Student CGPA")
    branch:       str   = Field(default="CSE", description="CSE | IT | ECE | EEE | ME | Other")
    has_backlogs: bool  = Field(default=False)
    top_n:        int   = Field(default=10, ge=1, le=50)
    model_choice: str   = Field(default="ensemble")


# ─── Health ───────────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {
        "service": "CAMSPHER-AI Smart Placement API",
        "version": "3.0.0",
        "status": "running",
        "models": {
            "model1_resume_analyzer":   analyzer   is not None,
            "model2_job_recommender":   job_engine is not None,
            "model3_selection_predictor": predictor is not None,
        }
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "models": {
            "resume_analyzer_ready":      analyzer   is not None,
            "job_recommender_ready":      job_engine is not None,
            "selection_predictor_ready":  predictor  is not None,
        },
        "version": "3.0.0",
    }


# ════════════════════════════════════════════════════════════════════════════════
# MODEL 1 — RESUME ANALYZER
# ════════════════════════════════════════════════════════════════════════════════

@app.post("/api/analyze/file")
async def analyze_file(
    file: UploadFile = File(...),
    user_id: Optional[str] = Form(None),
):
    start = time.time()
    if not file.filename:
        raise HTTPException(400, "No file provided")

    ext = os.path.splitext(file.filename.lower())[1]
    if ext not in {'.pdf', '.docx', '.doc'}:
        raise HTTPException(400, f"Unsupported format: {ext}. Use PDF or DOCX.")

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(400, "File too large (max 10MB)")
    if len(contents) == 0:
        raise HTTPException(400, "Empty file")

    try:
        result = analyzer.analyze(contents, file.filename)
        result["processing_time_ms"] = round((time.time() - start) * 1000, 2)
        return result
    except Exception as e:
        raise HTTPException(500, f"Analysis failed: {e}")


@app.post("/api/analyze/text")
async def analyze_text(request: AnalyzeTextRequest):
    start = time.time()
    if not request.resume_text.strip():
        raise HTTPException(400, "Resume text is required")
    if len(request.resume_text) > 50000:
        raise HTTPException(400, "Text too long (max 50,000 characters)")
    try:
        result = analyzer.analyze(request.resume_text)
        result["processing_time_ms"] = round((time.time() - start) * 1000, 2)
        return result
    except Exception as e:
        raise HTTPException(500, f"Analysis failed: {e}")


@app.get("/api/skills")
async def get_skills_db():
    return {
        "total_skills": len(analyzer.skills_extractor.all_skills),
        "technical_count": len(analyzer.skills_extractor.skill_categories["technical"]),
        "soft_count": len(analyzer.skills_extractor.skill_categories["soft"]),
        "high_demand_skills": sorted(list(analyzer.skills_extractor.high_demand_skills))[:50],
    }


@app.get("/api/high-demand-skills")
async def get_high_demand_skills():
    return {
        "high_demand_skills": sorted(list(analyzer.skills_extractor.high_demand_skills)),
        "count": len(analyzer.skills_extractor.high_demand_skills),
    }


# ════════════════════════════════════════════════════════════════════════════════
# MODEL 2 — JOB RECOMMENDER
# NOTE: /api/jobs/categories MUST be before /api/jobs/{job_id} — FastAPI
#       matches routes top-to-bottom; without this order, "categories" gets
#       parsed as an integer job_id and returns a 422 error.
# ════════════════════════════════════════════════════════════════════════════════

@app.post("/api/recommend-jobs")
async def recommend_jobs(request: RecommendJobsRequest):
    start = time.time()
    try:
        result = job_engine.recommend(
            student_skills=request.skills,
            student_cgpa=request.cgpa,
            student_branch=request.branch,
            has_backlogs=request.has_backlogs,
            top_n=request.top_n,
        )
        result["processing_time_ms"] = round((time.time() - start) * 1000, 2)
        return result
    except Exception as e:
        raise HTTPException(500, f"Recommendation failed: {e}")


@app.post("/api/recommend-from-resume")
async def recommend_from_resume(request: RecommendFromResumeRequest):
    start = time.time()
    try:
        resume_result  = analyzer.analyze(request.resume_text)
        skills_data    = resume_result.get("analysis", {}).get("skills", {})
        student_skills = skills_data.get("found_skills", [])

        job_result = job_engine.recommend(
            student_skills=student_skills,
            student_cgpa=request.cgpa,
            student_branch=request.branch,
            has_backlogs=request.has_backlogs,
            top_n=request.top_n,
        )

        return {
            "success": True,
            "processing_time_ms": round((time.time() - start) * 1000, 2),
            "pipeline": "resume_analysis -> skill_extraction -> job_matching",
            "resume_summary": {
                "overall_score":    resume_result["summary"]["overall_score"],
                "grade":            resume_result["summary"]["grade"],
                "total_skills":     resume_result["summary"]["total_skills"],
                "technical_skills": resume_result["summary"]["technical_skills"],
                "high_demand_skills": resume_result["summary"]["high_demand_skills"],
            },
            "skills_extracted": student_skills,
            "recommendations":  job_result,
        }
    except Exception as e:
        raise HTTPException(500, f"Pipeline failed: {e}")


# ── ✅ FIXED: categories route BEFORE {job_id} route ─────────────────────────
@app.get("/api/jobs/categories")
async def get_job_categories():
    """Get all unique job categories, experience levels, and companies."""
    return {
        "role_categories":   sorted(set(j.role_category    for j in job_engine.jobs)),
        "experience_levels": sorted(set(j.experience_level for j in job_engine.jobs)),
        "companies":         sorted(set(j.company          for j in job_engine.jobs)),
        "job_types":         sorted(set(j.job_type         for j in job_engine.jobs)),
    }


@app.get("/api/jobs")
async def get_all_jobs(
    category:         Optional[str] = Query(None),
    experience_level: Optional[str] = Query(None),
    search:           Optional[str] = Query(None),
    limit:            int           = Query(20, ge=1, le=100),
):
    jobs = list(job_engine.jobs)
    if category:
        jobs = [j for j in jobs if j.role_category.lower() == category.lower()]
    if experience_level:
        jobs = [j for j in jobs if j.experience_level.lower() == experience_level.lower()]
    if search:
        s = search.lower()
        jobs = [j for j in jobs if (
            s in j.title.lower() or s in j.company.lower() or
            s in j.description.lower() or
            any(s in sk.lower() for sk in j.required_skills + j.preferred_skills)
        )]
    return {
        "total":    len(job_engine.jobs),
        "returned": len(jobs[:limit]),
        "jobs":     [j.__dict__ for j in jobs[:limit]],
    }


@app.get("/api/jobs/{job_id}")
async def get_job_detail(job_id: int):
    from config.jobs_db import get_job_by_id
    job = get_job_by_id(job_id)
    if not job:
        raise HTTPException(404, f"Job {job_id} not found")
    return {"job": job.__dict__}


@app.get("/api/jobs/{job_id}/similar")
async def get_similar_jobs(job_id: int, limit: int = Query(5, ge=1, le=10)):
    try:
        similar = job_engine.get_similar_jobs(job_id, top_n=limit)
        return {"reference_job_id": job_id, "similar_jobs": similar}
    except Exception as e:
        raise HTTPException(500, f"Failed: {e}")


# ════════════════════════════════════════════════════════════════════════════════
# MODEL 3 — SELECTION PREDICTOR
# ════════════════════════════════════════════════════════════════════════════════

@app.post("/api/predict")
async def predict_selection(request: PredictRequest):
    """
    Predict placement selection probability from direct feature inputs.
    Use this when you already have Model 1 + student profile data and
    want to call Model 3 without re-running the full pipeline.

    Model choices: ensemble (default) | random_forest | logistic_regression | decision_tree
    """
    if not predictor:
        raise HTTPException(503, "Selection predictor not ready")

    start = time.time()
    try:
        result = predictor.predict(
            cgpa=request.cgpa,
            resume_score=request.resume_score,
            skills_count=request.skills_count,
            technical_skills=request.technical_skills,
            soft_skills=request.soft_skills,
            high_demand_skills=request.high_demand_skills,
            projects_count=request.projects_count,
            exp_months=request.exp_months,
            certifications=request.certifications,
            job_match_score=request.job_match_score,
            ats_score=request.ats_score,
            skill_diversity_score=request.skill_diversity_score,
            has_backlogs=request.has_backlogs,
            branch=request.branch,
            model_choice=request.model_choice,
        )
        result["processing_time_ms"] = round((time.time() - start) * 1000, 2)
        return result
    except Exception as e:
        raise HTTPException(500, f"Prediction failed: {e}")


@app.post("/api/predict-from-resume")
async def predict_from_resume(request: FullPipelineRequest):
    """
    Full 3-model pipeline in one API call:
      Resume Text → Model 1 (analyze) → Model 2 (jobs) → Model 3 (predict)

    This is the PRIMARY endpoint for the frontend dashboard.
    Single call returns everything: resume score, job matches, AND selection probability.

    Request body:
        resume_text:  Full resume text
        cgpa:         Student CGPA (required)
        branch:       CSE | IT | ECE | EEE | ME | Other
        has_backlogs: true | false
        top_n:        Number of job recommendations (1-50)
        model_choice: ensemble | random_forest | logistic_regression | decision_tree
    """
    if not analyzer or not job_engine or not predictor:
        raise HTTPException(503, "One or more models not ready")

    start = time.time()
    try:
        # ── Stage 1: Resume Analysis (Model 1) ──────────────────────────────
        resume_result = analyzer.analyze(request.resume_text)

        # ── Stage 2: Job Recommendations (Model 2) ──────────────────────────
        student_skills = resume_result.get("analysis", {}).get("skills", {}).get("found_skills", [])
        job_result = job_engine.recommend(
            student_skills=student_skills,
            student_cgpa=request.cgpa,
            student_branch=request.branch,
            has_backlogs=request.has_backlogs,
            top_n=request.top_n,
        )

        # ── Stage 3: Selection Prediction (Model 3) ──────────────────────────
        prediction = predictor.predict_from_pipeline(
            resume_analysis=resume_result,
            job_recommendations=job_result,
            cgpa=request.cgpa,
            branch=request.branch,
            has_backlogs=request.has_backlogs,
            model_choice=request.model_choice,
        )

        total_time = round((time.time() - start) * 1000, 2)

        return {
            "success": True,
            "processing_time_ms": total_time,
            "pipeline": "Model 1 (Resume) → Model 2 (Jobs) → Model 3 (Selection)",

            # ── Model 1 output ─────────────────────────────────────────────
            "resume_analysis": {
                "overall_score":     resume_result["summary"]["overall_score"],
                "grade":             resume_result["summary"]["grade"],
                "total_skills":      resume_result["summary"]["total_skills"],
                "technical_skills":  resume_result["summary"]["technical_skills"],
                "high_demand_skills":resume_result["summary"]["high_demand_skills"],
                "projects_count":    resume_result["summary"]["projects_count"],
                "experience_count":  resume_result["summary"]["experience_count"],
                "category_scores":   resume_result["analysis"]["scoring"]["category_scores"],
                "recommendations":   resume_result["analysis"]["scoring"]["recommendations"][:3],
                "skills_found":      student_skills,
            },

            # ── Model 2 output ─────────────────────────────────────────────
            "job_recommendations": {
                "total_matched":        job_result["total_jobs_matched"],
                "top_jobs":             job_result["top_recommendations"][:5],
                "category_distribution":job_result["category_distribution"],
                "improvement_suggestions": job_result["improvement_suggestions"][:3],
            },

            # ── Model 3 output ─────────────────────────────────────────────
            "selection_prediction": {
                "probability":           prediction["selection_probability"],
                "grade":                 prediction["grade"],
                "label":                 prediction["prediction_label"],
                "predicted_selected":    prediction["predicted_selected"],
                "algorithm_predictions": prediction["algorithm_predictions"],
                "top_factors":           prediction["top_factors"],
                "recommendations":       prediction["recommendations"][:4],
            },
        }
    except Exception as e:
        raise HTTPException(500, f"Full pipeline failed: {e}")


@app.post("/api/predict/file")
async def predict_from_file(
    file: UploadFile = File(...),
    cgpa: float = Form(...),
    branch: str = Form(default="CSE"),
    has_backlogs: bool = Form(default=False),
    model_choice: str = Form(default="ensemble"),
):
    """
    Full pipeline from uploaded PDF/DOCX file.
    Same as /api/predict-from-resume but accepts a file upload.
    """
    if not file.filename:
        raise HTTPException(400, "No file provided")

    ext = os.path.splitext(file.filename.lower())[1]
    if ext not in {'.pdf', '.docx', '.doc'}:
        raise HTTPException(400, f"Unsupported format: {ext}")

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(400, "Empty file")

    start = time.time()
    try:
        resume_result = analyzer.analyze(contents, file.filename)
        student_skills = resume_result.get("analysis", {}).get("skills", {}).get("found_skills", [])

        job_result = job_engine.recommend(
            student_skills=student_skills,
            student_cgpa=cgpa,
            student_branch=branch,
            has_backlogs=has_backlogs,
            top_n=10,
        )
        prediction = predictor.predict_from_pipeline(
            resume_analysis=resume_result,
            job_recommendations=job_result,
            cgpa=cgpa, branch=branch,
            has_backlogs=has_backlogs,
            model_choice=model_choice,
        )
        return {
            "success": True,
            "processing_time_ms": round((time.time() - start) * 1000, 2),
            "selection_probability": prediction["selection_probability"],
            "grade": prediction["grade"],
            "label": prediction["prediction_label"],
            "algorithm_predictions": prediction["algorithm_predictions"],
            "recommendations": prediction["recommendations"][:4],
            "resume_score": resume_result["summary"]["overall_score"],
            "skills_found": len(student_skills),
            "top_jobs": job_result["top_recommendations"][:3],
        }
    except Exception as e:
        raise HTTPException(500, f"Failed: {e}")


# ── Model 3 utility endpoints ─────────────────────────────────────────────────

@app.get("/api/model3/metrics")
async def get_model3_metrics():
    """Get training accuracy metrics for all 3 ML algorithms."""
    if not predictor:
        raise HTTPException(503, "Predictor not ready")
    return {
        "metrics":            predictor.get_model_metrics(),
        "feature_importance": predictor.get_feature_importance(),
        "model_info":         predictor._meta,
    }


@app.get("/api/model3/rules")
async def get_decision_tree_rules():
    """Return human-readable decision tree rules (for explainability)."""
    if not predictor:
        raise HTTPException(503, "Predictor not ready")
    return {
        "decision_tree_rules": predictor.get_decision_tree_rules(),
        "note": "These rules show exactly how the decision tree makes predictions. Max depth shown: 4.",
    }


@app.post("/api/model3/retrain")
async def retrain_model3(n_samples: int = Query(default=3000, ge=500, le=10000)):
    """
    Retrain Model 3 with fresh synthetic data (or add real data in production).
    Warning: takes 10–30 seconds.
    """
    if not predictor:
        raise HTTPException(503, "Predictor not ready")
    try:
        meta = predictor.retrain(n_samples=n_samples)
        return {"success": True, "message": "Model retrained successfully", "metrics": meta["metrics"]}
    except Exception as e:
        raise HTTPException(500, f"Retraining failed: {e}")


# ─── Entry point ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True, log_level="info")