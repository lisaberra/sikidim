from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class WardrobeItem(BaseModel):
    id: str
    name: str
    category: str  # Üst Giyim, Alt Giyim, Dış Giyim, Ayakkabı, Aksesuar
    color: str     # Beyaz, Siyah, Bej, Pudra, Mavi, vb.
    season: str    # Yaz, Kış, Sonbahar, İlkbahar, Dört Mevsim
    style: str     # Klasik, Spor, Şık, Günlük, Romantik
    image_url: str
    tags: List[str] = []
    created_at: Optional[str] = None
    last_worn_date: Optional[str] = None

class RecommendationRequest(BaseModel):
    prompt: str
    city: Optional[str] = "İstanbul"
    season_filter: Optional[str] = None
    model_type: str = "ft_rag"  # "base_slm", "ft_slm", "ft_rag"
    user_inventory: Optional[List[WardrobeItem]] = None

class OutfitCombination(BaseModel):
    id: str
    title: str
    top_item: Optional[WardrobeItem] = None
    bottom_item: Optional[WardrobeItem] = None
    outer_item: Optional[WardrobeItem] = None
    shoes_item: Optional[WardrobeItem] = None
    accessory_item: Optional[WardrobeItem] = None
    reasoning: str
    style_tips: List[str] = []
    compatibility_score: int = Field(ge=0, le=100)
    weather_suitability: str
    color_palette: List[str] = []
    created_at: Optional[str] = None

class FavoriteOutfit(BaseModel):
    id: str
    title: str
    outfit: OutfitCombination
    note: Optional[str] = None
    saved_at: str

class BenchmarkEvaluation(BaseModel):
    metric_name: str
    base_slm_score: float
    ft_slm_score: float
    ft_rag_score: float
    unit: str
    description: str

class EvaluationReport(BaseModel):
    evaluations: List[BenchmarkEvaluation]
    summary: str
    inventory_count: int
