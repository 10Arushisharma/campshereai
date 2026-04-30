# CAMSPHER-AI Smart Placement API

AI-powered Placement Platform for College Students.

**Model 1: Resume Analyzer** - NLP-based resume analysis with skills extraction and scoring.

**Model 2: Job Recommender** - Content-based job matching with 100+ curated job listings.

---

## Model 1: Resume Analyzer

| Feature | Description | Technique |
|---------|-------------|-----------|
| **Skills Extraction** | Extract technical, soft & domain skills | Keyword Matching + NER + TF-IDF |
| **Resume Scoring** | Overall score 0-100 with grade | Weighted multi-factor algorithm |
| **Projects Parser** | Extract project names, tech stacks, descriptions | Regex + NLP patterns |
| **Experience Parser** | Extract work history with duration & roles | Pattern matching |
| **Education Parser** | Extract degrees, institutions, grades | Pattern matching |
| **ATS Check** | Applicant Tracking System compatibility | Section/header analysis |
| **Recommendations** | Actionable improvement suggestions | Rule-based engine |

**NLP Techniques:** TF-IDF, Named Entity Recognition (spaCy), Keyword Matching with 821-skill database.

---

## Model 2: Job Recommender

| Feature | Description | Technique |
|---------|-------------|-----------|
| **Content-Based Matching** | Match student skills to job requirements | Cosine Similarity + TF-IDF |
| **Skill Gap Analysis** | Show missing skills per job | Set intersection + synonym resolution |
| **Eligibility Check** | CGPA, branch, backlog filtering | Rule-based validation |
| **Confidence Scoring** | High/Medium/Low match confidence | Weighted scoring algorithm |
| **Improvement Suggestions** | Personalized learning paths | Gap frequency analysis |
| **Similar Jobs** | Find jobs like a given role | TF-IDF vector similarity |
| **Jobs Database** | 100+ curated placement listings | Manual curation + auto-tagging |

**Matching Algorithm:**
1. TF-IDF vectorization of student skills + job requirements
2. Cosine similarity for base match score
3. Required skills weighted 3x more than preferred skills
4. CGPA/branch/backlog eligibility filtering
5. Final ranking with confidence levels

---

## Project Structure

```
resume_analyzer/
|-- main.py                          # FastAPI server (both models)
|-- requirements.txt                 # Dependencies
|-- setup.sh                         # One-command setup script
|-- config/
|   |-- skills_db.py                 # 821 skills database
|   |-- jobs_db.py                   # 100 jobs database
|-- models/
|   |-- resume_analyzer.py           # Model 1 orchestrator
|-- utils/
|   |-- text_extractor.py            # PDF/DOCX extraction
|   |-- skills_extractor.py          # NLP skills (TF-IDF + NER)
|   |-- content_extractor.py         # Projects/Experience parser
|   |-- scoring_engine.py            # Resume scoring (0-100)
|   |-- job_matcher.py               # Model 2 recommendation engine
|-- integration_examples/
|   |-- frontend_html.html            # Standalone HTML UI
|   |-- ResumeAnalyzer.jsx           # React: Resume Analysis
|   |-- JobRecommender.jsx           # React: Job Recommendations
|-- test_analyzer.py                 # Test Model 1
|-- test_job_recommender.py          # Test Model 2
|-- test_full_pipeline.py            # Test combined pipeline
```

---

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
pip install spacy
python -m spacy download en_core_web_sm
```

Or use the setup script:
```bash
chmod +x setup.sh
./setup.sh
```

### 2. Start the API Server

```bash
python main.py
```

Server starts at `http://localhost:8000`

### 3. Test the API

```bash
curl http://localhost:8000/health

# Upload resume (Model 1)
curl -X POST "http://localhost:8000/api/analyze/file" -F "file=@resume.pdf"

# Get job recommendations (Model 2)
curl -X POST "http://localhost:8000/api/recommend-jobs" \
  -H "Content-Type: application/json" \
  -d '{"skills": ["python", "react", "node.js", "sql"], "cgpa": 7.5, "branch": "CSE"}'

# Combined pipeline: Resume -> Jobs
curl -X POST "http://localhost:8000/api/recommend-from-resume" \
  -H "Content-Type: application/json" \
  -d '{"resume_text": "Your resume text...", "cgpa": 8.0, "branch": "CSE"}'
```

---

## API Endpoints

### Model 1: Resume Analyzer

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze/file` | Analyze PDF/DOCX file |
| POST | `/api/analyze/text` | Analyze pasted text |
| GET | `/api/skills` | View skills database |
| GET | `/api/high-demand-skills` | View high-demand skills |

### Model 2: Job Recommender

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/recommend-jobs` | Get jobs by skills profile |
| POST | `/api/recommend-from-resume` | Resume analysis + job matching |
| GET | `/api/jobs` | Browse all jobs (with filters) |
| GET | `/api/jobs/{job_id}` | Job detail |
| GET | `/api/jobs/{job_id}/similar` | Similar jobs |
| GET | `/api/jobs/categories` | Job categories list |

### General

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info |
| GET | `/health` | Health check |

---

## Response Examples

### Resume Analysis Response

```json
{
  "success": true,
  "processing_time_ms": 245.67,
  "summary": {
    "overall_score": 72.5,
    "grade": "B",
    "total_skills": 45,
    "technical_skills": 38,
    "high_demand_skills": 15,
    "projects_count": 3,
    "experience_count": 2
  },
  "analysis": {
    "skills": {
      "found_skills": ["python", "react", "aws", ...],
      "skill_strengths": { "python": 89.1, "react": 92.3, ... },
      "high_demand_matches": ["python", "aws", "machine learning"]
    },
    "scoring": {
      "category_scores": {
        "skills": 65.3, "projects": 58.1, "experience": 62.4,
        "education": 70.0, "content_quality": 65.2, "ats_compatibility": 75.8
      },
      "recommendations": [...]
    }
  }
}
```

### Job Recommendation Response

```json
{
  "total_jobs_matched": 85,
  "total_jobs_in_db": 100,
  "top_recommendations": [
    {
      "job": {
        "id": 2,
        "title": "Frontend Developer",
        "company": "Flipkart",
        "salary_range": "12-20 LPA",
        "location": "Bangalore"
      },
      "match_score": 85.0,
      "combined_score": 100.0,
      "confidence": "High",
      "match_category": "Excellent Match",
      "required_skills_matched": ["javascript", "react", "html", "css"],
      "required_skills_missing": ["typescript"],
      "skill_gaps": ["typescript", "redux"],
      "eligible": true,
      "eligibility_reason": "Eligible"
    }
  ],
  "category_distribution": {
    "Software Development": 5,
    "Data Science": 2,
    "DevOps": 1
  },
  "improvement_suggestions": [
    {
      "priority": "high",
      "title": "Learn High-Demand Missing Skills",
      "description": "Top skills to learn: typescript, kubernetes",
      "action": "Take online courses or build projects"
    }
  ]
}
```

### Combined Pipeline Response

```json
{
  "success": true,
  "pipeline": "resume_analysis -> skill_extraction -> job_matching",
  "resume_summary": {
    "overall_score": 72.5,
    "grade": "B",
    "total_skills": 45,
    "high_demand_skills": 15
  },
  "skills_extracted": ["python", "react", "aws", ...],
  "recommendations": { ... }
}
```

---

## Frontend Integration (React)

### Resume Analyzer Component

```jsx
import ResumeAnalyzer from './ResumeAnalyzer';

function App() {
  return <ResumeAnalyzer apiUrl="http://localhost:8000" />;
}
```

See: `integration_examples/ResumeAnalyzer.jsx`

### Job Recommender Component

```jsx
import JobRecommender from './JobRecommender';

function App() {
  return <JobRecommender apiUrl="http://localhost:8000" />;
}
```

See: `integration_examples/JobRecommender.jsx`

---

## Python Direct Usage

### Model 1: Resume Analyzer

```python
from models.resume_analyzer import analyze_resume

# Analyze from file
with open('resume.pdf', 'rb') as f:
    result = analyze_resume(f.read(), 'resume.pdf')

print(f"Score: {result['summary']['overall_score']}/100")
print(f"Grade: {result['summary']['grade']}")
```

### Model 2: Job Recommender

```python
from utils.job_matcher import recommend_jobs

# Recommend by skills
result = recommend_jobs(
    student_skills=["python", "react", "node.js", "sql"],
    student_cgpa=7.5,
    student_branch="CSE",
    top_n=10
)

for rec in result['top_recommendations']:
    print(f"{rec['job']['title']} at {rec['job']['company']}: {rec['match_score']}%")

# Recommend from resume analysis
from models.resume_analyzer import analyze_resume
from utils.job_matcher import JobRecommendationEngine

engine = JobRecommendationEngine()
resume_result = analyze_resume(resume_text)
job_result = engine.recommend_from_resume(resume_result, cgpa=8.0)
```

---

## Jobs Database Categories

| Category | Count | Example Roles |
|----------|-------|---------------|
| Software Development | 15 | Software Engineer, Full Stack, Mobile |
| Data Science | 8 | Data Scientist, ML Engineer, AI Engineer |
| Web Development | 6 | React, Node.js, Python, Java Developer |
| DevOps & Cloud | 10 | DevOps, SRE, Cloud Engineer, Platform |
| Data Engineering | 6 | Data Engineer, Big Data, ETL |
| Cybersecurity | 3 | Security Engineer, Penetration Testing |
| QA & Testing | 3 | QA, SDET, Performance Testing |
| Design | 2 | UI/UX, Product Designer |
| Blockchain | 2 | Blockchain, Web3 Developer |
| Embedded | 3 | Embedded, IoT, Firmware |
| Internship | 4 | Software, Data Science, Frontend, DevOps |
| Service Companies | 10 | Infosys, TCS, Wipro, HCL |
| Consulting | 4 | Business Analyst, Product Manager |
| Specialized | 20 | Finance, Healthcare, Legal, Telecom |

**Total: 100 jobs across 80 companies**

---

## Scoring System

### Resume Score Weights

| Component | Weight |
|-----------|--------|
| Skills & Technologies | 25% |
| Projects & Portfolio | 20% |
| Work Experience | 20% |
| Education | 15% |
| Content Quality | 10% |
| ATS Compatibility | 10% |

### Job Match Score Weights

| Factor | Weight |
|--------|--------|
| Required Skills Match | 75% |
| Preferred Skills Match | 25% |
| CGPA Bonus/Penalty | +/- 0-15 |
| Branch Eligibility | +/- 0-20 |
| Backlog Penalty | -10 |
| Experience Level Bonus | +5 (entry-level) |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 8000 | API server port |

---

## CAMSPHER-AI Roadmap

| # | Model | Status | Description |
|---|-------|--------|-------------|
| 1 | Resume Analyzer | Ready | Skills extraction + Resume scoring |
| 2 | Job Recommender | Ready | Content-based job matching |
| 3 | Selection Predictor | Planned | ML model (Logistic Regression, Random Forest) |
| 4 | Placement Readiness | Planned | Composite score (skills + resume + academics + mock tests) |

---

## License

MIT License - CAMSPHER-AI Project
