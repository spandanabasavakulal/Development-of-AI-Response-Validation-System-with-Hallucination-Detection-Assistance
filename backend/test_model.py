
from pathlib import Path
from dotenv import dotenv_values
from google import genai

BASE_DIR = Path(__file__).resolve().parent
config = dotenv_values(BASE_DIR / ".env")

client = genai.Client(
    api_key=config["GEMINI_API_KEY"]
)

model = config["GEMINI_MODEL"]

print("Testing model:", model)

response = client.models.generate_content(
    model=model,
    contents="Explain photosynthesis in two sentences."
)

print("\nGemini response:")
print(response.text)
