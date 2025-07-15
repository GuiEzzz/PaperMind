from fastapi import FastAPI, File, UploadFile
from google.cloud import vision
from google.oauth2 import service_account
from dotenv import load_dotenv
import os
import json
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4
from openai import OpenAI
from pydantic import BaseModel

load_dotenv()

prompts = {}


api_key = os.getenv("OPENAI_API_KEY")
openai_client  = OpenAI(api_key=api_key)
app = FastAPI()

class QuestionRequest(BaseModel):
    documentId: str
    question: str

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

    doc_id = str(uuid4())
    prompts[doc_id] = {
        "text": texts[0].description,
        "messages": []
    }

    return {"documentId": doc_id}

@app.post("/ask")
async def ask_question(req: QuestionRequest):
    doc_data = prompts.get(req.documentId)
    if not doc_data:
        return {"answer": "Documento não encontrado."}

    img_text = doc_data["text"]
    messages = doc_data.get("messages", [])

    # Verifica se já tem uma system message
    has_system = any(m["role"] == "system" for m in messages)

    # Se ainda não tiver, adiciona a instrução
    if not has_system:
        messages.append({
            "role": "system",
            "content": f"Você deve responder com base no seguinte texto extraído de uma imagem:\n\n{img_text}"
        })

    # Adiciona a pergunta do usuário
    messages.append({"role": "user", "content": req.question})

    # Envia o histórico completo
    resposta = openai_client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=messages
    )
    
    # Adiciona a resposta do modelo
    assistant_reply = resposta.choices[0].message.content
    messages.append({"role": "assistant", "content": assistant_reply})

    # Salva o histórico atualizado
    doc_data["messages"] = messages

    return {"answer": assistant_reply}