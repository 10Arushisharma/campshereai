"""
CAMSPHER-AI Resume Analyzer API
FastAPI Backend - Production-ready API for resume analysis
"""

import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
import uvicorn
import io
import time

from models.resume_analyzer import ResumeAnalyzer

# ============================================================================
# FastAPI App Configuration
# ============================================================================

app = FastAPI(
    title="CAMSPHER-AI Resume Analyzer",
    description="""
    AI-powered Resume Analyzer for CAMSPHER-AI Smart College Placement Platform.
    
    **Features:**
    - Resume text extraction (PDF, DOCX)
    - Skills extraction using NLP (TF-IDF, NER, Keyword Matching)
    - Projects & Experience parsing
    - Resume scoring (0-100) with detailed breakdown
    - ATS compatibility check
    - Actionable recommendations
    """,
    version="1.0.0",
    contact={
        "name": "CAMSPHER-AI Team",
        "url": "https://camspher-ai.example.com",
    },
    license_info={
        "name": "MIT License",
    },
)

# CORS - Allow your website to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your website domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Pydantic Models (Request/Response)
# ============================================================================

class AnalyzeTextRequest(BaseModel):
    resume_text: str
    user_id: Optional[str] = None


class SkillStrength(BaseModel):
    skill: str
    score: float


class ResumeScoreResponse(BaseModel):
    overall_score: float
    grade: str
    total_skills: int
    technical_skills: int
    soft_skills: int
    high_demand_skills: int
    projects_count: int
    experience_count: int
    education_count: int
    certifications_count: int


class AnalysisResponse(BaseModel):
    success: bool
    filename: str
    processing_time_ms: float
    summary: Dict[str, Any]
    analysis: Dict[str, Any]


# ============================================================================
# Global Analyzer Instance (loaded once at startup)
# ============================================================================
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    global analyzer
    print("=" * 60)
    print("  CAMSPHER-AI Resume Analyzer - Starting Server")
    print("=" * 60)
    analyzer = ResumeAnalyzer()
    print(f"  Skills database: {len(analyzer.skills_extractor.all_skills)} skills")
    print("=" * 60)
    yield
    # Shutdown (optional cleanup)

app = FastAPI(
    title="CAMSPHER-AI Resume Analyzer",
    description="...",
    version="1.0.0",
    lifespan=lifespan,
)

# ============================================================================
# API Endpoints
# ============================================================================

@app.get("/")
async def root():
    """Health check and API info."""
    return {
        "service": "CAMSPHER-AI Resume Analyzer",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "analyze_file": "POST /api/analyze/file",
            "analyze_text": "POST /api/analyze/text",
            "health": "GET /health",
            "skills_db": "GET /api/skills",
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "analyzer_ready": analyzer is not None,
        "version": "1.0.0"
    }


@app.post("/api/analyze/file", response_model=AnalysisResponse)
async def analyze_file(
    file: UploadFile = File(..., description="Resume file (PDF or DOCX)"),
    user_id: Optional[str] = Form(None, description="Optional user ID for tracking")
):
    """
    Analyze a resume file (PDF or DOCX).
    
    Returns complete analysis with skills, scores, and recommendations.
    """
    start_time = time.time()

    # Validate file
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")

    allowed_extensions = {'.pdf', '.docx', '.doc'}
    file_ext = os.path.splitext(file.filename.lower())[1]
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format: {file_ext}. Allowed: {', '.join(allowed_extensions)}"
        )

    try:
        # Read file content
        contents = await file.read()
        if len(contents) > 10 * 1024 * 1024:  # 10MB limit
            raise HTTPException(status_code=400, detail="File too large (max 10MB)")

        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Empty file")

        # Analyze
        result = analyzer.analyze(contents, file.filename)

        # Add processing metadata
        processing_time = (time.time() - start_time) * 1000
        result["processing_time_ms"] = round(processing_time, 2)

        return result

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/api/analyze/text", response_model=AnalysisResponse)
async def analyze_text(request: AnalyzeTextRequest):
    """
    Analyze resume from pasted text.
    
    Returns complete analysis with skills, scores, and recommendations.
    """
    start_time = time.time()

    if not request.resume_text or not request.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume text is required")

    if len(request.resume_text) > 50000:  # 50K char limit
        raise HTTPException(status_code=400, detail="Text too long (max 50,000 characters)")

    try:
        # Analyze
        result = analyzer.analyze(request.resume_text)

        # Add processing metadata
        processing_time = (time.time() - start_time) * 1000
        result["processing_time_ms"] = round(processing_time, 2)

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.get("/api/skills")
async def get_skills_db():
    """
    Get the skills database used for matching.
    
    Returns all recognized skills for reference.
    """
    if not analyzer:
        raise HTTPException(status_code=503, detail="Analyzer not ready")

    return {
        "total_skills": len(analyzer.skills_extractor.all_skills),
        "technical_count": len(analyzer.skills_extractor.skill_categories["technical"]),
        "soft_count": len(analyzer.skills_extractor.skill_categories["soft"]),
        "domain_count": len(analyzer.skills_extractor.skill_categories["domain"]),
        "high_demand_skills": sorted(list(analyzer.skills_extractor.high_demand_skills))[:50],
        "skill_categories": {
            "technical": sorted(list(analyzer.skills_extractor.skill_categories["technical"]))[:100],
            "soft": sorted(list(analyzer.skills_extractor.skill_categories["soft"]))[:50],
            "domain": sorted(list(analyzer.skills_extractor.skill_categories["domain"]))[:50],
        }
    }


@app.get("/api/high-demand-skills")
async def get_high_demand_skills():
    """Get list of high-demand skills for 2024-2025."""
    if not analyzer:
        raise HTTPException(status_code=503, detail="Analyzer not ready")

    return {
        "high_demand_skills": sorted(list(analyzer.skills_extractor.high_demand_skills)),
        "count": len(analyzer.skills_extractor.high_demand_skills),
        "note": "These skills receive higher weight in resume scoring"
    }


# ============================================================================
# Run Server
# ============================================================================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
