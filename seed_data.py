from backend.resume_analyzer.database import Base, engine, SessionLocal

from backend.resume_analyzer.models.db_models import (
    User,
    StudentProfile,
    RecruiterProfile,
    Job,
    Application,
    ResumeAnalysis,
    PlacementPrediction
)

import json

# CREATE ALL TABLES
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# -----------------------------
# CREATE STUDENTS
# -----------------------------

students = [
    {
        "name": "Arushi Sharma",
        "email": "10arushisharma@example.com",
        "cgpa": 8.39,
        "branch": "CSE",
        "skills": ["Python", "AI/ML", "SQL"]
    },
    {
        "name": "Anjali Sahni",
        "email": "24anjalisahni@example.com",
        "cgpa": 8.2,
        "branch": "CSE",
        "skills": ["TensorFlow", "Python", "Data Science"]
    },
    {
        "name": "Arpit Miglani",
        "email": "8arpitmiglani@example.com",
        "cgpa": 7,
        "branch": "CSE",
        "skills": ["ML", "C++", "Data Science"]
    },
    {
        "name": "Gunjaa Kumari",
        "email": "gunjaakumari@example.com",
        "cgpa": 7.9,
        "branch": "CSE",
        "skills": ["Node.js", "C", "Express"]
    },
    {
        "name": "Kashvi Malhotra",
        "email": "kashvi@example.com",
        "cgpa": 7.2,
        "branch": "CSE",
        "skills": ["C++", "Python"]
    },
     {
        "name": "Anita",
        "email": "anita@example.com",
        "cgpa": 8,
        "branch": "CSE",
        "skills": ["Python", "C"]
    },
     {
        "name": "Mansvi",
        "email": "mansvi@example.com",
        "cgpa": 7.65,
        "branch": "CSE",
        "skills": ["Python", "C++","JavaScript"]
    },
     {
        "name": "Bhavya Verma",
        "email": "bhavyaverma@example.com",
        "cgpa": 7.3,
        "branch": "CSE",
        "skills": ["Python","JavaScript"]
    },
    {
        "name": "Kajal",
        "email": "kajal@example.com",
        "cgpa": 7.71,
        "branch": "CSE",
        "skills": ["Python","JavaScript","C++"]
    },
     {
        "name": "Himanshu",
        "email": "himanshu@example.com",
        "cgpa": 7.5,
        "branch": "CSE",
        "skills": ["Python","JavaScript","C++","ML"]
    },
]

student_profiles = []

for s in students:
    user = User(
        email=s["email"],
        password_hash="hashedpassword",
        role="student",
        name=s["name"]
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    profile = StudentProfile(
        user_id=user.id,
        cgpa=s["cgpa"],
        branch=s["branch"],
        skills=json.dumps(s["skills"]),
        projects=json.dumps(["AI Project", "Portfolio Website"]),
        internships=json.dumps(["Google Internship"]),
        resume_url="https://example.com/resume.pdf"
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    student_profiles.append(profile)

# -----------------------------
# CREATE RECRUITER
# -----------------------------

recruiter_user = User(
    email="hr@infosys.com",
    password_hash="hashedpassword",
    role="recruiter",
    name="Infosys HR"
)

db.add(recruiter_user)
db.commit()
db.refresh(recruiter_user)

recruiter = RecruiterProfile(
    user_id=recruiter_user.id,
    company_name="Infosys",
    company_description="Global IT Services Company",
    website="https://infosys.com"
)

db.add(recruiter)
db.commit()
db.refresh(recruiter)

# -----------------------------
# CREATE JOBS
# -----------------------------

jobs = [
    {
        "title": "Frontend Developer",
        "skills": ["React", "JavaScript"],
        "cgpa": 7.5
    },
    {
        "title": "Backend Developer",
        "skills": ["Node.js", "Express"],
        "cgpa": 7.5
    },
    {
        "title": "AI Engineer",
        "skills": ["Python", "Machine Learning"],
        "cgpa": 8.0
    }
]

job_objects = []

for j in jobs:
    job = Job(
        recruiter_id=recruiter.id,
        title=j["title"],
        description="Exciting opportunity",
        required_skills=json.dumps(j["skills"]),
        eligibility_cgpa=j["cgpa"],
        eligibility_branch="CSE",
        salary_range="8-12 LPA",
        status="approved"
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    job_objects.append(job)

# -----------------------------
# CREATE APPLICATIONS
# -----------------------------

for student in student_profiles:
    app = Application(
        student_id=student.id,
        job_id=job_objects[0].id,
        status="applied"
    )

    db.add(app)

# -----------------------------
# RESUME ANALYSIS
# -----------------------------

for student in student_profiles:
    analysis = ResumeAnalysis(
        student_id=student.id,
        resume_score=85.0,
        extracted_skills=json.dumps(["Python", "React"])
    )

    db.add(analysis)

# -----------------------------
# PLACEMENT PREDICTION
# -----------------------------

for student in student_profiles:
    prediction = PlacementPrediction(
        student_id=student.id,
        prediction_probability=0.82,
        readiness_score=88.0
    )

    db.add(prediction)

db.commit()

print("Database created successfully with demo data!")