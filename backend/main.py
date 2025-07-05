from fastapi import FastAPI, File, UploadFile
from google.cloud import vision
from google.oauth2 import service_account
from dotenv import load_dotenv
import os
import json
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

cred_path = os.getenv("GOOGLE_CREDENTIALS")

# Autenticação
creds_dict = json.loads(cred_path)
credentials = service_account.Credentials.from_service_account_info(creds_dict)
client = vision.ImageAnnotatorClient(credentials=credentials)

@app.post("/ocr")
async def extract_text(file: UploadFile = File(...)):
    content = await file.read()
    image = vision.Image(content=content)
    response = client.text_detection(image=image)
    texts = response.text_annotations

    if not texts:
        return {"text": ""}

    return {"text": texts[0].description}
