import os, sys, json, yaml
sys.path.insert(0, os.path.dirname(__file__))
from fastapi import FastAPI, HTTPException
from model_provider import ModelProvider
from schemas import *
from prompts import *
from retrieval import Retriever

app = FastAPI(title="AJ Service")
provider = ModelProvider()
retriever = Retriever()

@app.on_event("startup")
def startup():
    try:
        provider.load()
    except Exception as e:
        print("Model load failed:", e)

@app.get("/health")
def health():
    return {"status": "ok", "model_loaded": provider.model is not None}

@app.get("/v1/model/status")
def status():
    return {"model_id": provider.model_id, "loaded": provider.model is not None, "device": provider.device}

@app.post("/v1/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    if provider.model is None:
        raise HTTPException(503, "Model not loaded")
    msgs = [{"role": m.role, "content": m.content} for m in req.messages]
    content = provider.generate(msgs, req.max_new_tokens, req.temperature, req.top_p)
    return ChatResponse(content=content)

@app.post("/v1/qa", response_model=QAResponse)
def qa(req: QARequest):
    if provider.model is None:
        raise HTTPException(503, "Model not loaded")
    msgs = [{"role": "system", "content": SYSTEM_PROMPT}]
    if req.context:
        msgs.append({"role": "user", "content": f"Context:\n{req.context}\n\nQuestion: {req.question}"})
    else:
        msgs.append({"role": "user", "content": req.question})
    answer = provider.generate(msgs)
    return QAResponse(answer=answer)

@app.post("/v1/resume/parse", response_model=ResumeParseResponse)
def parse_resume(req: ResumeParseRequest):
    if provider.model is None:
        raise HTTPException(503, "Model not loaded")
    prompt = RESUME_PARSE_PROMPT.format(text=req.text[:6000])
    msgs = [{"role": "user", "content": prompt}]
    raw = provider.generate(msgs, max_new_tokens=512, temperature=0.1)
    try:
        # extract json
        start = raw.find("{")
        end = raw.rfind("}")
        data = json.loads(raw[start:end+1]) if start != -1 else {}
    except Exception:
        data = {"raw": raw}
    return ResumeParseResponse(data=data)

@app.post("/v1/interviews/generate-question", response_model=GenerateQuestionResponse)
def gen_q(req: GenerateQuestionRequest):
    if provider.model is None:
        raise HTTPException(503, "Model not loaded")
    conv = "\n".join([f"{m.role}: {m.content}" for m in req.conversation])
    prompt = QUESTION_PROMPT.format(
        difficulty=req.difficulty,
        job_title=req.job_title,
        requirements=", ".join(req.job_requirements),
        resume=req.resume_text[:2000],
        conversation=conv[:3000],
        previous=", ".join(req.previous_questions),
    )
    msgs = [{"role": "user", "content": prompt}]
    q = provider.generate(msgs, max_new_tokens=256, temperature=0.8)
    return GenerateQuestionResponse(question=q.strip())

@app.post("/v1/interviews/evaluate-answer", response_model=EvaluateAnswerResponse)
def eval_answer(req: EvaluateAnswerRequest):
    if provider.model is None:
        raise HTTPException(503, "Model not loaded")
    prompt = EVAL_ANSWER_PROMPT.format(rubric=req.rubric, question=req.question, answer=req.answer)
    msgs = [{"role": "user", "content": prompt}]
    raw = provider.generate(msgs, max_new_tokens=256, temperature=0.2)
    try:
        start = raw.find("{"); end = raw.rfind("}")
        data = json.loads(raw[start:end+1])
        return EvaluateAnswerResponse(score=float(data.get("score", 0)), feedback=data.get("feedback", raw))
    except Exception:
        return EvaluateAnswerResponse(score=0, feedback=raw)

@app.post("/v1/interviews/evaluate-transcript", response_model=EvaluateTranscriptResponse)
def eval_transcript(req: EvaluateTranscriptRequest):
    if provider.model is None:
        raise HTTPException(503, "Model not loaded")
    transcript = "\n".join([f"{m.role}: {m.content}" for m in req.transcript])
    prompt = EVAL_TRANSCRIPT_PROMPT.format(job_title=req.job_title, requirements=", ".join(req.job_requirements), transcript=transcript[:6000])
    msgs = [{"role": "user", "content": prompt}]
    raw = provider.generate(msgs, max_new_tokens=256, temperature=0.2)
    try:
        start = raw.find("{"); end = raw.rfind("}")
        data = json.loads(raw[start:end+1])
        return EvaluateTranscriptResponse(score=float(data.get("score", 0)), feedback=data.get("feedback", raw))
    except Exception:
        return EvaluateTranscriptResponse(score=0, feedback=raw)

@app.post("/v1/rag/ingest")
def ingest(payload: dict):
    text = payload.get("text", "")
    source = payload.get("source", "unknown")
    n = retriever.ingest(text, source)
    return {"chunks": n}

@app.post("/v1/rag/query")
def rag_query(payload: dict):
    q = payload.get("question", "")
    hits = retriever.query(q)
    return {"hits": hits}
