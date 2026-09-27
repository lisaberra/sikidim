import asyncio
import base64
import json
import os
import pathlib
from typing import List, Optional

# pyrefly: ignore [missing-import]
from fastapi import FastAPI, File, HTTPException, UploadFile, Form, Response
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from clothing_segmentation import isolate_clothing
from clothing_analysis import analyze_clothing_image

from google import genai
from google.genai import types
from dotenv import load_dotenv

# .env her zaman backend klasöründen yüklenir
_ENV_PATH = pathlib.Path(__file__).parent / ".env"
load_dotenv(dotenv_path=_ENV_PATH)

_API_KEY = os.environ.get("GEMINI_API_KEY")

try:
    client = genai.Client(api_key=_API_KEY) if _API_KEY else genai.Client()
except Exception as e:
    client = None
    print(f"[HATA] GenAI Client başlatılamadı: {e}")

# Fallback model zinciri — ilk çalışan kullanılır
MODEL_CHAIN = [
    "gemini-3.8-flash",
    "gemini-3.5-flash",
]


async def generate_with_fallback(
    contents,
    config: types.GenerateContentConfig = None,
    max_retries: int = 2,
) -> str:
    """
    MODEL_CHAIN listesindeki modelleri sırayla dener.
    503/UNAVAILABLE alırsa exponential backoff ile retry yapar.
    """
    if not client:
        raise RuntimeError("Gemini API key eksik veya geçersiz.")

    last_error = None
    for model in MODEL_CHAIN:
        for attempt in range(max_retries):
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=contents,
                    config=config,
                )
                return response.text
            except Exception as e:
                last_error = e
                err = str(e)
                if "503" in err or "UNAVAILABLE" in err or "overloaded" in err.lower():
                    wait = 2 ** attempt
                    print(f"[WARN] {model} meşgul (deneme {attempt+1}), {wait}s bekleniyor...")
                    await asyncio.sleep(wait)
                    continue
                else:
                    print(f"[WARN] {model} hata: {err[:120]}")
                    break  # Bu modeli bırak, zincirdeki sonrakine geç

    raise last_error or RuntimeError("Tüm modeller başarısız.")


app = FastAPI(title="Şımarık AI Styling API", version="3.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateResponse(BaseModel):
    status: str
    message: str
    model_url: Optional[str] = None

@app.post("/api/v1/generate-3d", response_model=GenerateResponse)
async def generate_3d_model(
    image_url: Optional[str] = Form(default=None),
    file: Optional[UploadFile] = File(default=None)
):
    """
    Bu endpoint, 2D bir görseli alıp 3D (.glb) model üreten bir Yapay Zeka
    servisini (örn. Meshy.ai, Tripo3D) simüle eder.
    """
    
    if not image_url and not file:
        return {"status": "error", "message": "Lütfen bir görsel dosyası veya URL'si sağlayın."}

    # SİMÜLASYON: Gerçek bir AI modelinin işlemesini simüle etmek için 3 saniye bekliyoruz.
    # Gerçek senaryoda bu işlem 1-3 dakika sürebilir ve webhook ile haber verilir.
    await asyncio.sleep(3)
    
    # MOCK (Sahte) Veri:
    # Gerçek bir AI API'sine (örn: requests.post("https://api.meshy.ai/...")) istek 
    # atıldığında bize bir .glb URL'i döner. Biz şimdilik test için public bir 3D 
    # obje URL'i döndürüyoruz. (Örnek: Açık kaynak basit bir T-Shirt veya Kutu modeli)
    
    # Not: Gerçek hayatta burada AI'dan gelen URL yer alacak.
    # Şimdilik Three.js örneklerinden basit bir model koyalım.
    mock_model_url = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box/glTF/Box.gltf"
    
    return {
        "status": "success",
        "message": "3D model başarıyla üretildi.",
        "model_url": mock_model_url
    }

@app.post("/api/v1/isolate-clothing")
async def isolate_clothing_endpoint(file: UploadFile = File(...)):
    """
    Kullanıcının yüklediği fotoğraftaki arka planı ve insan figürünü siler, 
    sadece kıyafeti izole edip PNG olarak döndürür.
    """
    image_bytes = await file.read()
    
    # Kıyafeti izole etme işlemini çalıştır
    isolated_image_bytes = isolate_clothing(image_bytes)
    
    # PNG formatında resmi geri döndür
    return Response(content=isolated_image_bytes, media_type="image/png")

@app.post("/api/v1/process-clothing")
async def process_clothing_endpoint(file: UploadFile = File(...)):
    """
    1. Görseli alır ve kıyafeti izole eder (insan ve arka planı siler, beyaz fon ekler).
    2. İzole edilmiş görseli yapay zekaya (Gemini) gönderip etiketleri çıkarır.
    3. Hem etiketleri hem de base64 formatındaki beyaz fonlu resmi JSON döner.
    """
    image_bytes = await file.read()
    
    # 1. Kıyafeti izole et (beyaz arka planla)
    isolated_image_bytes = isolate_clothing(image_bytes)
    
    # 2. İzole kıyafeti Gemini ile analiz et
    analysis_result = analyze_clothing_image(isolated_image_bytes)
    
    # 3. Base64'e çevirip JSON olarak dön
    base64_img = base64.b64encode(isolated_image_bytes).decode('utf-8')
    
    return {
        "status": "success",
        "image_base64": f"data:image/png;base64,{base64_img}",
        "metadata": analysis_result
    }

@app.post("/api/recommend")
async def recommend_outfit(request_data: dict):
    """
    Bibble AI Stylist Engine v3.0
    Model fallback zinciri, negative constraint uyumu, vibe analizi.
    """
    prompt        = request_data.get("prompt", "").strip()
    wardrobe      = request_data.get("wardrobe", [])
    weather       = request_data.get("weather", None)
    favorites     = request_data.get("favorites", [])
    recent_combos = request_data.get("recent_combos", [])

    if not prompt:
        return {"error": "Prompt boş olamaz."}
    if not client:
        return {"error": "Gemini API key eksik veya geçersiz."}

    # Tarz profili (favori kombinlerden)
    fav_titles = [
        f.get("title", "") for f in favorites[:10]
        if isinstance(f, dict) and f.get("title")
    ]
    style_profile = (
        f"\nKULLANICININ TARZ PROFİLİ:\nFavori kombin isimleri: {', '.join(fav_titles)}\n"
        "Bu isimlerden tarz eğilimini çıkar. Kullanıcı spesifik stil istiyorsa önce o geçerli.\n"
        if fav_titles else ""
    )

    # Tekrar önleme
    recent_item_lists = [
        str(rc.get("items", [])) for rc in recent_combos[:5]
        if isinstance(rc, dict) and rc.get("items")
    ]
    repetition_guard = (
        f"\nTEKRAR ÖNLEME — Son kombinlerdeki parçalar:\n{chr(10).join(recent_item_lists)}\n"
        "AYNI parça kombinasyonunu KESİNLİKLE TEKRAR ETME.\n"
        if recent_item_lists else ""
    )

    system_prompt = f"""
Sen Bibble adında yapay zeka bir stil danışmanısın. Türkçe yanıt ver.

GÖREV: Kullanıcının gardırobundan isteğe en uygun kombini seç.

═══ KESİN KURALLAR ═══

1. NEGATİF KOMUTLAR (EN YÜKSEK ÖNCELİK):
   "istemiyorum", "olmasın", "yok" → O öğeyi KESİNLİKLE null yap.
   • "dış giyim istemiyorum" → outer_item: null
   • "aksesuar olmasın" → accessory_item: null

2. STİL SADAKATI:
   • gotik → siyah, deri, koyu, zincir
   • punk → distressed, metal, sert
   • romantik → yumuşak tonlar, fırfır
   • street style → oversize, sneaker, grafik
   Uygun parça yoksa: en yakınını seç + style_tips'e alışveriş önerisi ekle.

3. HAVA DURUMU: {weather or 'Bilinmiyor'}
   Mevsim uyumsuzluğu varsa reasoning'de espirili uyarı yap, ama yine de istenen kombini ver.

4. VİBE ANALİZİ:
   Şarkı/sanatçı adı → tür, dönem, hissiyat analizi → kombine yansıt
   Şehir adı → o şehrin sokak modu + iklimi → kombine yansıt
   Analizi reasoning'de detaylı paylaş.

5. RUH HALİ (bibble_mood): mutlu | saskin | havali | kizgin | heyecanli | romantik | melankolik | asi | cool | nostaljik | idle

{style_profile}{repetition_guard}

═══ KULLANICININ DOLABI ═══
{json.dumps(wardrobe, ensure_ascii=False)}

═══ KULLANICININ İSTEĞİ ═══
"{prompt}"

JSON (başka hiçbir şey yazma):
{{
  "bibble_mood": "string",
  "title": "Kombin adı",
  "reasoning": "Bibble'ın eğlenceli, laf sokan, vibe analizi içeren yorumu",
  "top_item": "ID veya null",
  "bottom_item": "ID veya null",
  "outer_item": "ID veya null",
  "shoes_item": "ID veya null",
  "accessory_item": "ID veya null",
  "style_tips": ["Tüyo 1", "Tüyo 2"]
}}
"""

    try:
        text = await generate_with_fallback(
            contents=[system_prompt],
            config=types.GenerateContentConfig(response_mime_type="application/json"),
        )
        data = json.loads(text)

        # O(n) ID → wardrobe objesi dönüşümü
        wardrobe_map = {str(item.get("id")): item for item in wardrobe}
        for key in ["top_item", "bottom_item", "outer_item", "shoes_item", "accessory_item"]:
            item_id = data.get(key)
            data[key] = wardrobe_map.get(str(item_id)) if item_id else None

        data["compatibility_score"] = 95
        return data

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": f"Bibble şu an meşgul: {str(e)[:200]}"}

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []
    user_context: dict = {}
    wardrobe: List[dict] = []


@app.post("/api/chat")
async def chat_with_bibble(request: ChatRequest):
    if not client:
        return {"error": "Gemini API key eksik veya geçersiz."}

    try:
        body_type = request.user_context.get("bodyType", "Bilinmiyor")
        user_history_text = " ".join(
            m["text"] for m in request.history[-10:] if m.get("role") == "user"
        )

        system_instruction = f"""Sen Bibble'sın — iğneleyici, laf sokan ama kullanıcının iyiliğini düşünen uzman bir sanal stilistsin. Türkçe konuş.
Uçan, minik, mor-pembe bir peri figürsün. "Yip yip!", "Bi-bb-le!" gibi sesler çıkarabilirsin.

Kullanıcının vücut tipi: {body_type}. Buna uygun giyim tavsiyeleri ver.
Dolabında {len(request.wardrobe)} parça var.
Geçmiş konuşmadan tarz ipucu: {user_history_text or 'Yok'}

KURALLAR:
1. Yanıtlar KISA, KOMİK ve DİNAMİK olsun — uzun paragraflar yazma.
2. Aynı şakayı/tepkiyi tekrarlama.
3. Önce laf sok, sonra kullanıcının istediğini yap."""

        contents = [
            {"role": "user", "parts": [{"text": system_instruction}]},
            {"role": "model", "parts": [{"text": "Anlaşıldı! Ben Bibble'ım, stil danışmanlığına hazırım! Yip yip! 💜"}]},
        ]
        for msg in request.history[-10:]:
            role = "user" if msg.get("role") == "user" else "model"
            contents.append({"role": role, "parts": [{"text": msg.get("text", "")}]})
        contents.append({"role": "user", "parts": [{"text": request.message}]})

        text = await generate_with_fallback(contents=contents)
        return {"response": text}

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"error": f"Bibble şu an cevap veremiyor: {str(e)[:200]}"}

@app.get("/")
def read_root():
    return {
        "status": "ok",
        "service": "Şımarık AI Styling API v3.0",
        "model_chain": MODEL_CHAIN,
        "api_key_set": bool(_API_KEY),
    }
