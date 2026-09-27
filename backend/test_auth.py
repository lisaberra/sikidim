import os
import requests
from dotenv import load_dotenv

load_dotenv()
token = os.getenv("GEMINI_API_KEY")

url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"
}
data = {
    "contents": [{"parts":[{"text": "Merhaba"}]}]
}

response = requests.post(url, headers=headers, json=data)
print(response.status_code)
print(response.text)
