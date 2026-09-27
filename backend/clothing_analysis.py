import os
import json
import base64
from io import BytesIO
# pyrefly: ignore [missing-import]
from PIL import Image
# pyrefly: ignore [missing-import]
from google import genai
# pyrefly: ignore [missing-import]
from google.genai import types
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

import pathlib
_ENV_PATH = pathlib.Path(__file__).parent / ".env"
load_dotenv(dotenv_path=_ENV_PATH)

# Initialize the GenAI client
# It automatically picks up GEMINI_API_KEY from environment
try:
    client = genai.Client()
except Exception as e:
    client = None
    print(f"GenAI Client initialization error: {e}")

def analyze_clothing_image(image_bytes: bytes) -> dict:
    """
    Sends the isolated clothing image to Gemini and retrieves metadata.
    Returns a dictionary containing category, color, season, and a generated name.
    """
    if not client:
        return {
            "error": "Gemini API key is not configured. Please add GEMINI_API_KEY to .env"
        }

    # Open image to ensure it's valid, then prepare for Gemini
    img = Image.open(BytesIO(image_bytes))
    
    # We can pass the PIL image directly to the SDK
    prompt = """
    Sen uzman bir sanal gardırop asistanı ve moda analistisin. 
    Gönderilen görseldeki ana kıyafeti veya aksesuarı analiz edip sınıflandırmak senin görevin. 
    Görseldeki ürünün arka planı silinmiş ve sadece ürün bırakılmıştır.
    
    LÜTFEN AŞAĞIDAKİ KURALLARA KESİNLİKLE UY:
    1. Görseldeki ürünü incele ve ne olduğunu kesin olarak belirle.
    2. Ürünü aşağıdaki ana kategorilerden SADECE BİRİNE yerleştir:
       [Üst Giyim, Alt Giyim, Dış Giyim, Elbise, Ayakkabı, Çanta, Aksesuar]
    3. Ürünün spesifik alt türünü belirle (Örn: Tişört, Kot Pantolon, Sneaker, Kaban).
    4. Ürünün baskın rengini tespit et.
    5. Bu kıyafetin en uygun olduğu mevsimi belirle (Yaz, Kış, İlkbahar, Sonbahar veya Dört Mevsim).
    6. Bu kıyafet için kısa ve akılda kalıcı bir isim oluştur (Örn: "Zümrüt Yeşili Şık Elbise").
    
    ÇIKTI FORMATI:
    Hiçbir açıklama, giriş veya yorum cümlesi yazma. Sadece aşağıdaki JSON formatında, doğrudan ayrıştırılabilir (parse edilebilir) bir çıktı ver.
    
    {
      "ana_kategori": "string",
      "alt_kategori": "string",
      "renk": "string",
      "mevsim": "string",
      "isim": "string"
    }
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-3.8-flash',
            contents=[img, prompt],
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )
        
        # Parse the returned JSON
        result = json.loads(response.text)
        return result
    except Exception as e:
        return {
            "error": str(e)
        }
