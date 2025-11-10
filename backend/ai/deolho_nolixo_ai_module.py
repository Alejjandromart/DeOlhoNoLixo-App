from fastapi import FastAPI, UploadFile, File
import requests
import boto3

app = FastAPI(title="DeOlho NoLixo - Módulo de IA")

@app.get("/")
def root():
    return {"mensagem": "API DeOlho NoLixo - módulo de IA ativo!"}

@app.post("/analisar/")
async def analisar_imagem(file: UploadFile = File(...)):
    conteudo = await file.read()
    tamanho_kb = len(conteudo) / 1024

    return {
        "nome_arquivo": file.filename,
        "tamanho_kb": round(tamanho_kb, 2),
        "classificacao": "exemplo - IA ainda não implementada"
    }
