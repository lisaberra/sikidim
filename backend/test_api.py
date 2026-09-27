import os
import asyncio
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
print("API Key starts with:", api_key[:3] if api_key else "None")

try:
    client = genai.Client()
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents="Merhaba, nasılsın?"
    )
    print("Success:", response.text)
except Exception as e:
    print("Error:", repr(e))
