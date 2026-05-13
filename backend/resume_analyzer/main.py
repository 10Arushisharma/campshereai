"""
CAMSPHER-AI Smart Placement API — v4.0.0
FastAPI Backend with all 4 models integrated.

Model 1: Resume Analyzer      — NLP: TF-IDF + NER + Keyword Matching
Model 2: Job Recommender      — Content-based: Cosine Similarity
Model 3: Selection Predictor  — ML: Logistic Regression + Random Forest + Decision Tree
Model 4: Placement Readiness  — Composite score: Resume + Skills + Academics + Job Fit + Odds
"""

import sys
import os
import platform
import time

from contextlib import asynccontextmanager
from typing import Optional, List

import uvicorn
from fastapi import (
    FastAPI,
    File,
    UploadFile,
    HTTPException,
    Form,
    Query,
)
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# -----------------------------------------------------------------------------
# PATH SETUP
# -----------------------------------------------------------------------------

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# -----------------------------------------------------------------------------
# IMPORT MODELS
# -----------------------------------------------------------------------------

from models.resume_analyzer import ResumeAnalyzer
from utils.job_matcher import JobRecommendationEngine
from utils.selection_predictor import SelectionPredictor
from utils.placement_readiness import PlacementReadinessEngine

# -----------------------------------------------------------------------------
# WINDOWS CHECK
# -----------------------------------------------------------------------------

is_windows = platform.system().lower() == "windows"

# -----------------------------------------------------------------------------
# GLOBAL MODEL INSTANCES
# -----------------------------------------------------------------------------

analyzer: Optional[ResumeAnalyzer] = None
job_engine: Optional[JobRecommendationEngine] = None
predictor: Optional[SelectionPredictor] = None
readiness: Optional[PlacementReadinessEngine] = None

# -----------------------------------------------------------------------------
# LIFESPAN
# -----------------------------------------------------------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    global analyzer, job_engine, predictor, readiness

    print("=" * 60)
    print("CAMSPHER-AI Smart Placement Platform — Starting")
    print("=" * 60)

    try:
        analyzer = ResumeAnalyzer()
        print("[Model 1] Resume Analyzer Loaded")

        job_engine = JobRecommendationEngine()
        print("[Model 2] Job Recommender Loaded")

        predictor = SelectionPredictor()
        print("[Model 3] Selection Predictor Loaded")

        readiness = PlacementReadinessEngine()
        print("[Model 4] Placement Readiness Loaded")

        print("=" * 60)
        print("All 4 models operational!")
        print("=" * 60)

    except Exception as e:
        print(f"Startup Error: {str(e)}")
        raise e

    yield

    print("Shutting down CAMSPHER-AI...")

# -----------------------------------------------------------------------------
# FASTAPI APP
# -----------------------------------------------------------------------------

app = FastAPI(
    title="CAMSPHER-AI Smart Placement API",
    description="AI-powered Smart Placement Platform",
    version="4.0.0",
    lifespan=lifespan,
)

# -----------------------------------------------------------------------------
# CORS
# -----------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------------------------------------------------------
# REQUEST SCHEMAS
# -----------------------------------------------------------------------------

class AnalyzeTextRequest(BaseModel):
    resume_text: str
    user_id: Optional[str] = None


class RecommendJobsRequest(BaseModel):
    skills: List[str]
    cgpa: float = Field(default=7.0, ge=0.0, le=10.0)
    branch: str = "CSE"
    has_backlogs: bool = False
    top_n: int = Field(default=10, ge=1, le=50)


class FullPipelineRequest(BaseModel):
    resume_text: str
    cgpa: float = Field(..., ge=0.0, le=10.0)
    branch: str = "CSE"
    has_backlogs: bool = False
    top_n: int = 10
    model_choice: str = "ensemble"


class PredictRequest(BaseModel):
    cgpa: float = Field(..., ge=0.0, le=10.0)
    resume_score: float = Field(default=50.0, ge=0.0, le=100.0)
    skills_count: int = 10
    technical_skills: int = 8
    soft_skills: int = 2
    high_demand_skills: int = 3
    projects_count: int = 2
    exp_months: int = 0
    certifications: int = 1
    job_match_score: float = 50.0
    ats_score: float = 50.0
    skill_diversity_score: float = 50.0
    has_backlogs: bool = False
    branch: str = "CSE"
    model_choice: str = "ensemble"

# -----------------------------------------------------------------------------
# ROOT
# -----------------------------------------------------------------------------

@app.get("/")
async def root():
    return {
        "service": "CAMSPHER-AI Smart Placement API",
        "version": "4.0.0",
        "status": "running",
    }

# -----------------------------------------------------------------------------
# HEALTH
# -----------------------------------------------------------------------------

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "models": {
            "resume_analyzer": analyzer is not None,
            "job_recommender": job_engine is not None,
            "selection_predictor": predictor is not None,
            "placement_readiness": readiness is not None,
        },
    }

# -----------------------------------------------------------------------------
# MODEL 1 — RESUME ANALYZER
# -----------------------------------------------------------------------------

@app.post("/api/analyze/text")
async def analyze_text(request: AnalyzeTextRequest):
    if not analyzer:
        raise HTTPException(status_code=503, detail="Analyzer not ready")

    if not request.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text required")

    start = time.time()

    try:
        result = analyzer.analyze(request.resume_text)

        result["processing_time_ms"] = round(
            (time.time() - start) * 1000,
            2,
        )

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )

# -----------------------------------------------------------------------------
# FILE ANALYSIS
# -----------------------------------------------------------------------------

@app.post("/api/analyze/file")
async def analyze_file(
    file: UploadFile = File(...),
):
    if not analyzer:
        raise HTTPException(status_code=503, detail="Analyzer not ready")

    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")

    ext = os.path.splitext(file.filename)[1].lower()

    if ext not in [".pdf", ".docx", ".doc"]:
        raise HTTPException(
            status_code=400,
            detail="Only PDF/DOC/DOCX supported",
        )

    contents = await file.read()

    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Empty file")

    start = time.time()

    try:
        result = analyzer.analyze(contents, file.filename)

        result["processing_time_ms"] = round(
            (time.time() - start) * 1000,
            2,
        )

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"File analysis failed: {str(e)}"
        )

# -----------------------------------------------------------------------------
# MODEL 2 — JOB RECOMMENDER
# -----------------------------------------------------------------------------

@app.post("/api/recommend-jobs")
async def recommend_jobs(request: RecommendJobsRequest):
    if not job_engine:
        raise HTTPException(status_code=503, detail="Job engine not ready")

    try:
        result = job_engine.recommend(
            student_skills=request.skills,
            student_cgpa=request.cgpa,
            student_branch=request.branch,
            has_backlogs=request.has_backlogs,
            top_n=request.top_n,
        )

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Recommendation failed: {str(e)}"
        )

# -----------------------------------------------------------------------------
# JOB CATEGORIES
# -----------------------------------------------------------------------------

@app.get("/api/jobs/categories")
async def get_categories():
    if not job_engine:
        raise HTTPException(status_code=503, detail="Job engine not ready")

    return {
        "companies": sorted(
            list(set(j.company for j in job_engine.jobs))
        ),
        "categories": sorted(
            list(set(j.role_category for j in job_engine.jobs))
        ),
    }

# -----------------------------------------------------------------------------
# ALL JOBS
# -----------------------------------------------------------------------------

@app.get("/api/jobs")
async def get_jobs(
    limit: int = Query(20, ge=1, le=100)
):
    if not job_engine:
        raise HTTPException(status_code=503, detail="Job engine not ready")

    jobs = [{**j.__dict__} for j in job_engine.jobs[:limit]]

    return {
        "total": len(job_engine.jobs),
        "returned": len(jobs),
        "jobs": jobs,
    }

# -----------------------------------------------------------------------------
# JOB DETAIL
# -----------------------------------------------------------------------------

@app.get("/api/jobs/{job_id}")
async def get_job(job_id: int):
    if not job_engine:
        raise HTTPException(status_code=503, detail="Job engine not ready")

    from config.jobs_db import get_job_by_id

    job = get_job_by_id(job_id)

    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    return {
        "job": job.__dict__
    }

# -----------------------------------------------------------------------------
# MODEL 3 — PREDICT SELECTION
# -----------------------------------------------------------------------------

@app.post("/api/predict")
async def predict_selection(request: PredictRequest):
    if not predictor:
        raise HTTPException(status_code=503, detail="Predictor not ready")

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

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

# -----------------------------------------------------------------------------
# FULL PIPELINE
# -----------------------------------------------------------------------------

@app.post("/api/full-pipeline")
async def full_pipeline(request: FullPipelineRequest):
    if not all([analyzer, job_engine, predictor, readiness]):
        raise HTTPException(
            status_code=503,
            detail="One or more models not ready"
        )

    start = time.time()

    try:
        # MODEL 1
        resume_result = analyzer.analyze(request.resume_text)

        skills = (
            resume_result
            .get("analysis", {})
            .get("skills", {})
            .get("found_skills", [])
        )

        # MODEL 2
        jobs_result = job_engine.recommend(
            student_skills=skills,
            student_cgpa=request.cgpa,
            student_branch=request.branch,
            has_backlogs=request.has_backlogs,
            top_n=request.top_n,
        )

        # MODEL 3
        prediction = predictor.predict_from_pipeline(
            resume_analysis=resume_result,
            job_recommendations=jobs_result,
            cgpa=request.cgpa,
            branch=request.branch,
            has_backlogs=request.has_backlogs,
            model_choice=request.model_choice,
        )

        # MODEL 4
        readiness_result = readiness.compute_from_pipeline(
            resume_analysis=resume_result,
            job_recommendations=jobs_result,
            selection_prediction=prediction,
            cgpa=request.cgpa,
            branch=request.branch,
            has_backlogs=request.has_backlogs,
        )

        return {
            "success": True,

            "processing_time_ms": round(
                (time.time() - start) * 1000,
                2,
            ),

            "resume_analysis": resume_result,

            "job_recommendations": jobs_result,

            "selection_prediction": prediction,

            "placement_readiness": readiness_result,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Pipeline failed: {str(e)}"
        )

# -----------------------------------------------------------------------------
# MODEL 3 METRICS
# -----------------------------------------------------------------------------

@app.get("/api/model3/metrics")
async def model3_metrics():
    if not predictor:
        raise HTTPException(status_code=503, detail="Predictor not ready")

    return {
        "metrics": predictor.get_model_metrics(),
        "feature_importance": predictor.get_feature_importance(),
    }

# -----------------------------------------------------------------------------
# SERVER
# -----------------------------------------------------------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=not is_windows,
        log_level="info",
    )