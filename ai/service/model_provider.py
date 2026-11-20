import os, yaml, torch
from transformers import AutoTokenizer, AutoModelForCausalLM

class ModelProvider:
    def __init__(self, config_path="ai/config/model.yaml"):
        with open(config_path) as f:
            cfg = yaml.safe_load(f)
        self.cfg = cfg
        self.model_id = cfg["model"]["id"]
        self.model_dir = cfg["model"]["local_dir"]
        self.tokenizer = None
        self.model = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.dtype = torch.float16 if self.device == "cuda" else torch.float32

    def load(self):
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_dir, trust_remote_code=True)
        self.model = AutoModelForCausalLM.from_pretrained(
            self.model_dir, torch_dtype=self.dtype, trust_remote_code=True
        )
        self.model.to(self.device)
        self.model.eval()

    def generate(self, messages, max_new_tokens=512, temperature=0.7, top_p=0.9):
        if self.tokenizer is None or self.model is None:
            raise RuntimeError("Model not loaded")
        text = self.tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        inputs = self.tokenizer(text, return_tensors="pt").to(self.device)
        with torch.no_grad():
            out = self.model.generate(
                **inputs,
                max_new_tokens=max_new_tokens,
                temperature=temperature,
                top_p=top_p,
                do_sample=temperature > 0,
                pad_token_id=self.tokenizer.eos_token_id,
            )
        generated = out[0][inputs["input_ids"].shape[1]:]
        return self.tokenizer.decode(generated, skip_special_tokens=True)
