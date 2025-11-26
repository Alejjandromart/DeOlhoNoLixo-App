from pydantic import BaseModel
from typing import List

class AnalysisResult(BaseModel):
    objectsDetected: List[str]
    geographicContext: str
    environmentalImpact: str
    severity: str
    suggestedCategory: str
    suggestedDescription: str
