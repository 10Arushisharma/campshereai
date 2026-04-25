# CAMSPHER-AI Resume Analyzer

AI-powered Resume Analysis System for the CAMSPHER-AI Smart College Placement Platform.

## Features

| Feature | Description | Technique |
|---------|-------------|-----------|
| **Skills Extraction** | Extract technical, soft & domain skills | Keyword Matching + NER + TF-IDF |
| **Resume Scoring** | Overall score 0-100 with grade | Weighted multi-factor algorithm |
| **Projects Parser** | Extract project names, tech stacks, descriptions | Regex + NLP patterns |
| **Experience Parser** | Extract work history with duration & roles | Pattern matching |
| **Education Parser** | Extract degrees, institutions, grades | Pattern matching |
| **ATS Check** | Applicant Tracking System compatibility | Section/header analysis |
| **Recommendations** | Actionable improvement suggestions | Rule-based engine |

## NLP Techniques Used

- **TF-IDF** (Term Frequency-Inverse Document Frequency) - For skill importance ranking
- **NER** (Named Entity Recognition) via spaCy - For entity extraction
- **Keyword Matching** - Comprehensive 800+ skills database with synonym resolution

## Project Structure

```
resume_analyzer/
|-- main.py                    # FastAPI server
|-- requirements.txt           # Dependencies
|-- config/
|   |-- skills_db.py           # 821 skills database
|-- models/
|   |-- resume_analyzer.py     # Main analyzer orchestrator
|-- utils/
|   |-- text_extractor.py      # PDF/DOCX text extraction
|   |-- skills_extractor.py    # NLP skills extraction
|   |-- content_extractor.py   # Projects/Experience/Education parser
|   |-- scoring_engine.py      # Resume scoring algorithm
|-- test_analyzer.py           # Test suite
```

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt

# Download spaCy model (optional, for NER support)
python -m spacy download en_core_web_sm
```

### 2. Run the API Server

```bash
python main.py
```

Server starts at `http://localhost:8000`

### 3. Test the API

```bash
curl -X GET http://localhost:8000/health

# Upload PDF/DOCX
curl -X POST "http://localhost:8000/api/analyze/file" \
  -F "file=@your_resume.pdf"

# Send text directly
curl -X POST "http://localhost:8000/api/analyze/text" \
  -H "Content-Type: application/json" \
  -d '{"resume_text": "Your resume text here..."}'
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API info & health |
| GET | `/health` | Health check |
| POST | `/api/analyze/file` | Analyze PDF/DOCX file |
| POST | `/api/analyze/text` | Analyze pasted text |
| GET | `/api/skills` | View skills database |
| GET | `/api/high-demand-skills` | View high-demand skills |

## Response Format

```json
{
  "success": true,
  "filename": "resume.pdf",
  "processing_time_ms": 245.67,
  "summary": {
    "overall_score": 72.5,
    "grade": "B",
    "total_skills": 45,
    "technical_skills": 38,
    "soft_skills": 4,
    "high_demand_skills": 15,
    "projects_count": 3,
    "experience_count": 2,
    "education_count": 1,
    "certifications_count": 3,
    "top_recommendation": { ... }
  },
  "analysis": {
    "text_stats": {
      "word_count": 532,
      "character_count": 3916,
      "line_count": 79
    },
    "skills": {
      "found_skills": ["python", "machine learning", "react", ...],
      "skill_categories": {
        "technical": [...],
        "soft": [...],
        "domain": [...]
      },
      "skill_strengths": {
        "python": 89.1,
        "react": 89.6,
        "aws": 89.6,
        ...
      },
      "high_demand_matches": ["python", "machine learning", "aws", ...],
      "skill_diversity_score": 78.5,
      "tfidf_top_skills": [
        {"skill": "github", "score": 0.1984},
        {"skill": "react", "score": 0.1031},
        ...
      ]
    },
    "content": {
      "projects": [...],
      "experience": [...],
      "education": [...],
      "certifications": [...]
    },
    "scoring": {
      "overall_score": 72.5,
      "grade": "B",
      "category_scores": {
        "skills": 65.3,
        "projects": 58.1,
        "experience": 62.4,
        "education": 70.0,
        "content_quality": 65.2,
        "ats_compatibility": 75.8
      },
      "breakdown": [...],
      "recommendations": [
        {
          "priority": "high",
          "category": "Skills",
          "issue": "Only 5 skills detected",
          "action": "Add more relevant technical skills..."
        },
        ...
      ]
    }
  }
}
```

## Frontend Integration (React Example)

```javascript
// ResumeUpload.jsx
import { useState } from 'react';

const API_URL = 'http://localhost:8000';

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/api/analyze/file`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Analysis failed:', err);
    }
    setLoading(false);
  };

  return (
    <div>
      <input 
        type="file" 
        accept=".pdf,.docx,.doc" 
        onChange={(e) => setFile(e.target.files[0])} 
      />
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Resume'}
      </button>

      {result && (
        <div className="results">
          <h2>Score: {result.summary.overall_score}/100</h2>
          <p>Grade: {result.summary.grade}</p>
          <p>Skills Found: {result.summary.total_skills}</p>
          <p>Technical: {result.summary.technical_skills}</p>
          <p>High-Demand Skills: {result.summary.high_demand_skills}</p>
          
          <h3>Recommendations:</h3>
          {result.analysis.scoring.recommendations.map((rec, i) => (
            <div key={i} className={`rec-${rec.priority}`}>
              <b>[{rec.category}]</b> {rec.issue}
              <p>{rec.action}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;
```

## Scoring System

| Component | Weight | Max Score |
|-----------|--------|-----------|
| Skills & Technologies | 25% | 100 |
| Projects & Portfolio | 20% | 100 |
| Work Experience | 20% | 100 |
| Education | 15% | 100 |
| Content Quality | 10% | 100 |
| ATS Compatibility | 10% | 100 |

### Grading Scale

| Score | Grade |
|-------|-------|
| 90-100 | A+ |
| 85-89 | A |
| 80-84 | A- |
| 75-79 | B+ |
| 70-74 | B |
| 65-69 | B- |
| 60-64 | C+ |
| 55-59 | C |
| 50-54 | C- |
| 40-49 | D |
| 0-39 | F |

## Python Direct Usage

```python
from models.resume_analyzer import analyze_resume

# Analyze from file
with open('resume.pdf', 'rb') as f:
    result = analyze_resume(f.read(), 'resume.pdf')

# Or analyze text directly
result = analyze_resume(resume_text)

print(f"Score: {result['summary']['overall_score']}/100")
print(f"Grade: {result['summary']['grade']}")
print(f"Skills: {result['summary']['total_skills']}")

# Access skill strengths
for skill, strength in result['analysis']['skills']['skill_strengths'].items():
    print(f"  {skill}: {strength}")
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 8000 | API server port |

## License

MIT License - CAMSPHER-AI Project
