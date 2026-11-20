from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    max_new_tokens: Optional[int] = 512
    temperature: Optional[float] = 0.7
    top_p: Optional[float] = 0.9

class ChatResponse(BaseModel):
    content: str

class QARequest(BaseModel):
    question: str
    context: Optional[str] = None

class QAResponse(BaseModel):
    answer: str

class ResumeParseRequest(BaseModel):
    text: str

class ResumeParseResponse(BaseModel):
    data: Dict[str, Any]

class TranscriptMessage(BaseModel):
    role: str
    content: str

class GenerateQuestionRequest(BaseModel):
    job_title: str
    job_requirements: List[str] = []
    resume_text: Optional[str] = ""
    difficulty: Optional[str] = "medium"
    previous_questions: List[str] = []
    conversation: List[TranscriptMessage] = []

class GenerateQuestionResponse(BaseModel):
    question: str

class EvaluateAnswerRequest(BaseModel):
    question: str
    answer: str
    rubric: Optional[str] = ""

class EvaluateAnswerResponse(BaseModel):
    score: float
    feedback: str

class EvaluateTranscriptRequest(BaseModel):
    job_title: str
    job_requirements: List[str] = []
    transcript: List[TranscriptMessage]

class EvaluateTranscriptResponse(BaseModel):
    score: float
    feedback: str
