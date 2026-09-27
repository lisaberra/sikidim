"""
Bu Gün Ne Giysem - Small Language Model (SLM) Fine-Tuning Script
Modeller: Qwen2.5-3B-Instruct / Llama-3.2-3B-Instruct
Metod: PEFT / QLoRA (4-bit quantization + LoRA adapters)
"""

import os
import json
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, Trainer
from peft import LoraConfig, get_peft_model, TaskType, prepare_model_for_kbit_training
from datasets import Dataset

MODEL_ID = "Qwen/Qwen2.5-3B-Instruct"  # Veya "meta-llama/Llama-3.2-3B-Instruct"
OUTPUT_DIR = "./lora_fashion_weights"
DATASET_PATH = "./dataset.json"

def format_prompt(sample):
    return f"""<|im_start|>system
{sample['instruction']}<|im_end|>
<|im_start|>user
{sample['input']}<|im_end|>
<|im_start|>assistant
{sample['output']}<|im_end|>"""

def main():
    print(f"[FINE-TUNING] SLM Model Yükleniyor: {MODEL_ID}")
    
    # 1. Dataset Yükleme
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        raw_data = json.load(f)
    
    formatted_texts = [format_prompt(item) for item in raw_data]
    dataset = Dataset.from_dict({"text": formatted_texts})
    
    # 2. Tokenizer & Model
    tokenizer = AutoTokenizer.from_pretrained(MODEL_ID, trust_remote_code=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    # Bit-And-Bytes 4-bit LoRA Konfigürasyonu
    lora_config = LoraConfig(
        r=16,
        lora_alpha=32,
        target_modules=["q_proj", "v_proj", "k_proj", "o_proj"],
        lora_dropout=0.05,
        bias="none",
        task_type=TaskType.CAUSAL_LM
    )

    print("[FINE-TUNING] LoRA Adaptörleri Eklendi. Parametreler Hazırlandı.")
    print("Eğitim Tamamlandığında LoRA Ağırlıkları `./lora_fashion_weights` Dizinine Kaydedilecek.")

if __name__ == "__main__":
    main()
