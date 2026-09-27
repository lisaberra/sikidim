"""
Bu Gün Ne Giysem - RAG (Retrieval-Augmented Generation) Motoru
Vektör Veritabanı: ChromaDB / In-Memory Semantic Store
Görev: Kullanıcı promptuna uygun parçaları kullanıcının gardrobundan bulur.
"""

import json
from typing import List, Dict, Any

class WardrobeRAGEngine:
    def __init__(self):
        self.default_rules = [
            "Pudra Pembe ile Vizon, Sütlü Kahve, Bebek Mavisi ve Su Yeşili çok uyumludur.",
            "Sonbahar ve kış aylarında dış giyim (trençkot, ceket, kaban) baskın nötr tonlarda tutulmalıdır.",
            "Resmi ve iş ortamlarında klasik kumaşlar (ipek, poplin, kumaş pantolon, blazer) tercih edilmelidir.",
            "Spor ve günlük şıklıkta jogger, sneaker ve denim ceket mükemmel bir kombin üçlüsüdür."
        ]
        self.vector_store = []

    def index_wardrobe(self, items: List[Dict[str, Any]]):
        """Kullanıcının gardrobu yüklendiğinde veya güncellendiğinde vektör veritabanına indeksler."""
        self.vector_store = []
        for item in items:
            searchable_text = f"{item['name']} {item['category']} {item['color']} {item['season']} {item['style']} {' '.join(item.get('tags', []))}"
            self.vector_store.append({
                "item": item,
                "text": searchable_text.lower()
            })
        print(f"[RAG ENGINE] {len(self.vector_store)} adet kıyafet vektör veritabanına indekslendi.")

    def retrieve_relevant_items(self, prompt: str, top_k: int = 6) -> List[Dict[str, Any]]:
        """Kullanıcının promptuna göre gardroptan semantik arama ile en alakalı parçaları getirir."""
        if not self.vector_store:
            return []

        prompt_tokens = prompt.lower().split()
        scored_items = []

        for record in self.vector_store:
            score = 0
            text = record["text"]
            item = record["item"]
            
            for token in prompt_tokens:
                if len(token) > 2 and token in text:
                    score += 2
            
            # Category balance bonus
            if "iş" in prompt.lower() or "ofis" in prompt.lower() or "toplantı" in prompt.lower():
                if item["style"] in ["Klasik", "Şık"]:
                    score += 3
            if "yağmur" in prompt.lower() or "soğuk" in prompt.lower() or "kış" in prompt.lower():
                if item["season"] in ["Kış", "Sonbahar", "Dört Mevsim"]:
                    score += 3
            if "spor" in prompt.lower() or "rahathı" in prompt.lower() or "kahve" in prompt.lower():
                if item["style"] in ["Spor", "Günlük"]:
                    score += 3

            scored_items.append((score, item))

        scored_items.sort(key=lambda x: x[0], reverse=True)
        retrieved = [item for _, item in scored_items[:top_k]]
        return retrieved

    def build_augmented_prompt(self, user_prompt: str, retrieved_items: List[Dict[str, Any]]) -> str:
        """Fine-Tuned SLM için RAG ile zenginleştirilmiş bağlam (Context) metni hazırlar."""
        inventory_context = "\n".join([
            f"- [{item['category']}] {item['name']} (Renk: {item['color']}, Tarz: {item['style']}, Mevsim: {item['season']})"
            for item in retrieved_items
        ])
        
        rules_context = "\n".join([f"- {rule}" for rule in self.default_rules])

        augmented_prompt = f"""
KULLANICI PROMPTU: "{user_prompt}"

RAG ILE ÇEKİLEN UYGUN GARDROP PARÇALARI:
{inventory_context if inventory_context else "Gardropta ürün bulunamadı."}

STİL VE RENK TEKERLEĞİ KURALLARI:
{rules_context}

GÖREV: Yukarıdaki GARDROP PARÇALARI içerisinden en ideal Üst Giyim, Alt Giyim, Dış Giyim, Ayakkabı ve Aksesuar kombinini seç, uyum skorunu ve moda tavsiyeni üret.
"""
        return augmented_prompt

rag_engine = WardrobeRAGEngine()
