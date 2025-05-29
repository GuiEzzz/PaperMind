# Document Assistant – OCR + LLM Chat

Este projeto integra OCR, embeddings, FAISS e LLM para criar um assistente de atendimento baseado em documentos escaneados (PDF ou imagens).

## Funcionalidades

- Upload de documentos escaneados (PDF/JPEG/PNG)
- Extração de texto via OCR
- Indexação inteligente via embeddings + FAISS
- Chat inteligente: faça perguntas sobre o documento e receba respostas fundamentadas

## Tecnologias

- Backend: Python + FastAPI
- OCR: Tesseract (ou Google Vision API)
- Embeddings: OpenAI Embeddings API
- LLM: OpenAI GPT-4 API
- Vector DB: FAISS
- Frontend: Next.js + Tailwind CSS

## Como rodar

1. Clone o repositório
2. Inicie o backend:
    ```
    cd backend
    pip install -r requirements.txt
    uvicorn app.main:app --reload
    ```
3. Inicie o frontend:
    ```
    cd frontend
    npm install
    npm run dev
    ```
4. Acesse o frontend em `http://localhost:3000`

## Roadmap (MVP)

- [ ] Upload de documento
- [ ] OCR + chunking + embedding
- [ ] Indexação no FAISS
- [ ] Perguntas e respostas via chat
- [ ] Exibir fonte da resposta

## Extensões futuras

- Autenticação
- Suporte multi-documento
- Dashboard de uso
- Deploy cloud/Docker

---

Contribua ou faça perguntas via Issues!
