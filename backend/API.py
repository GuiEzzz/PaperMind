from fastapi import FastAPI, File, UploadFile
from google.cloud import vision
from google.oauth2 import service_account
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

# Autenticação
credentials = service_account.Credentials.from_service_account_file(cred_path)
client = vision.ImageAnnotatorClient(credentials=credentials)

@app.post("/ocr")
async def extract_text(file: UploadFile = File(...)):
    contents = await file.read()
    image = vision.Image(content=contents)
    response = client.text_detection(image=image)
    texts = response.text_annotations

    if not texts:
        return {"text": ""}

    return {"text": texts[0].description}
