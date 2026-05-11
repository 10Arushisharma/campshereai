import { useState } from "react";
import { getFullReadiness } from "../../api/camspherApi";
// then use:  const data = await getFullReadiness({ resume_text, cgpa, branch })
// data.resume_analysis.overall_score   ← Model 1
// data.job_recommendations.top_jobs    ← Model 2
// data.selection_prediction.probability ← Model 3
// data.placement_readiness.readiness_score ← Model 4