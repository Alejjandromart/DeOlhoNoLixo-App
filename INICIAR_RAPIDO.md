# ⚡ Iniciar Sistema DeOlho NoLixo - Guia Rápido

## 🚦 Problema Atual

O BackendRedis está fechando automaticamente quando iniciado em background. 

**Solução**: Abrir cada servidor em um terminal separado manualmente.

---

## ✅ Passo a Passo Correto

### 1️⃣ Abrir Terminal para Backend IA

**Abra um novo PowerShell** e execute:

```powershell
cd "C:\Users\silva\OneDrive\Área de Trabalho\deolhonolixo\DeOlhoNoLixo-App\backendIA"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

✅ **Aguarde ver**: `INFO: Uvicorn running on http://0.0.0.0:8000`

**NÃO FECHE ESTE TERMINAL**

---

### 2️⃣ Abrir Terminal para Backend Redis

**Abra OUTRO novo PowerShell** e execute:

```powershell
cd "C:\Users\silva\OneDrive\Área de Trabalho\deolhonolixo\DeOlhoNoLixo-App\backend\BackendRedis"
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

✅ **Aguarde ver**: `INFO: Uvicorn running on http://0.0.0.0:8001`

**NÃO FECHE ESTE TERMINAL**

---

### 3️⃣ Abrir Terminal para Expo

**Abra OUTRO novo PowerShell** e execute:

```powershell
cd "C:\Users\silva\OneDrive\Área de Trabalho\deolhonolixo\DeOlhoNoLixo-App"
npx expo start --clear
```

✅ **Aguarde ver o QR code**

**NÃO FECHE ESTE TERMINAL**

---

### 4️⃣ Abrir App no Celular

1. Instale **Expo Go** no seu celular
2. Escaneie o QR code mostrado no terminal
3. Aguarde o app carregar

---

## 🧪 Verificar se Está Funcionando

### Teste Backend IA (Terminal 4)

Abra um quarto terminal e execute:

```powershell
curl http://192.168.0.3:8000/
```

Deve retornar: `{"status":"online"...}`

### Teste Backend Redis

```powershell
Invoke-WebRequest -Uri "http://192.168.0.3:8001/" | Select-Object -ExpandProperty Content
```

Deve retornar: `{"status":"online","service":"DeOlho NoLixo Feed Service"}`

---

## 📊 Resumo Visual

```
Terminal 1: [backendIA - Port 8000]     ✅ Rodando
Terminal 2: [BackendRedis - Port 8001]  ✅ Rodando  
Terminal 3: [Expo Metro - Port 8081]    ✅ Rodando
Terminal 4: [Testes]                    (opcional)

Celular: [Expo Go]                      ✅ Conectado
```

---

## ❌ Se a Porta 8001 Estiver em Uso

Se você ver o erro: **"Foi feita uma tentativa de acesso a um soquete..."**

Execute:

```powershell
# Encontrar processo na porta 8001
netstat -ano | findstr :8001

# Matar processo (substitua XXXXX pelo número PID)
taskkill /PID XXXXX /F

# Depois tente novamente iniciar o BackendRedis
```

---

## 🛑 Para Parar Tudo

Em cada um dos 3 terminais, pressione: **Ctrl + C**

---

## 💡 Dica Rápida

Para facilitar no futuro, você pode:

1. Abrir VS Code
2. Abrir 3 terminais integrados (Ctrl + Shift + `)
3. Em cada terminal, executar um dos comandos acima

---

## 📝 Ordem Exata de Execução

```
1. Terminal 1 → Backend IA (8000)      [Aguarde 5 segundos]
2. Terminal 2 → Backend Redis (8001)   [Aguarde 5 segundos]
3. Terminal 3 → Expo (8081)            [Aguarde 20 segundos]
4. Celular → Abrir Expo Go             [Escanear QR code]
```

**Total: ~40 segundos**

---

## ✅ Checklist Completo

- [ ] Terminal 1 aberto (Backend IA rodando)
- [ ] Terminal 2 aberto (Backend Redis rodando)
- [ ] Terminal 3 aberto (Expo rodando)
- [ ] QR code visível no Terminal 3
- [ ] Expo Go instalado no celular
- [ ] App aberto no celular
- [ ] Teste: `curl http://192.168.0.3:8000/` funciona
- [ ] Teste: `curl http://192.168.0.3:8001/` funciona

---

**Se tudo acima estiver ✅, o sistema está 100% operacional!** 🎉
