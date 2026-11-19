from pathlib import Path
from dotenv import dotenv_values
from google import genai

config = dotenv_values(Path(__file__).resolve().parent / ".env")

client = genai.Client(
    api_key=config["GEMINI_API_KEY"]
)

print("Available Gemini models:")

for model in client.models.list():
    if "generateContent" in (model.supported_actions or []):
        print(model.name)