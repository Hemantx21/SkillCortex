import json, os, numpy as np
from transformers import AutoTokenizer, AutoModel
import torch

class Retriever:
    def __init__(self, store_path="ai/data/vector_store.json", model_name="sentence-transformers/all-MiniLM-L6-v2"):
        self.store_path = store_path
        self.model_name = model_name
        self.tokenizer = None
        self.model = None
        self.docs = []
        self._load_store()

    def _ensure_model(self):
        if self.tokenizer is None:
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            self.model = AutoModel.from_pretrained(self.model_name)
            self.model.eval()

    def _embed(self, texts):
        self._ensure_model()
        with torch.no_grad():
            toks = self.tokenizer(texts, padding=True, truncation=True, return_tensors="pt")
            out = self.model(**toks)
            emb = out.last_hidden_state.mean(dim=1)
            emb = torch.nn.functional.normalize(emb, p=2, dim=1)
            return emb.numpy()

    def _load_store(self):
        if os.path.exists(self.store_path):
            with open(self.store_path) as f:
                self.docs = json.load(f)

    def _save_store(self):
        os.makedirs(os.path.dirname(self.store_path), exist_ok=True)
        with open(self.store_path, "w") as f:
            json.dump(self.docs, f)

    def ingest(self, text, source="unknown"):
        chunks = [c.strip() for c in text.split("\n\n") if c.strip()]
        if not chunks:
            chunks = [text]
        embs = self._embed(chunks)
        for c, e in zip(chunks, embs):
            self.docs.append({"text": c, "source": source, "embedding": e.tolist()})
        self._save_store()
        return len(chunks)

    def query(self, q, k=4):
        if not self.docs:
            return []
        qemb = self._embed([q])[0]
        mat = np.array([d["embedding"] for d in self.docs])
        scores = mat @ qemb
        idx = np.argsort(scores)[::-1][:k]
        return [{"text": self.docs[i]["text"], "source": self.docs[i]["source"], "score": float(scores[i])} for i in idx]
