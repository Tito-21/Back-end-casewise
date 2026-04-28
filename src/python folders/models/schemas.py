from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DocumentResponse(BaseModel):
    id: str
    filename: str
    case_id: str
    status: str
    message: str
    uploaded_at: Optional[datetime] = None

class ChatRequest(BaseModel):
    query: str
    case_id: Optional[str] = None
    top_k: Optional[int] = 5

class ChatResponse(BaseModel):
    answer: str
    sources: Optional[list] = []
    case_id: Optional[str] = None