# Task 5: EAS Build + Distribuição APK + Preparação Testes GQS

> **Dependências:** Tasks 1, 2, 3, 4 concluídas e testadas localmente
> **Arquitetura:** EAS Build (Expo Application Services, free tier) + expo.dev internal distribution
> **Tech Stack:** EAS CLI, Android APK, Google Forms

---

## 🛠️ Especificação

### 1. Objetivo
Gerar um APK Android instalável, distribuir via link único para os alunos de GQS e
preparar os cenários de teste estruturados com formulário de feedback.

### 2. Estratégia de Distribuição

| Aluno tem | Solução |
|---|---|
| Android | Baixar APK via link → instalar (habilitar "Fontes desconhecidas") |
| iPhone | Instalar **Expo Go** → escanear QR code do `expo start` (requer notebook ligado) |

> Para o teste GQS independente de notebook, o foco é **Android via APK**.
> Se houver alunos com iPhone, eles podem usar um Android emprestado ou Expo Go com o dev server ativo.

### 3. Limites Gratuitos EAS Build

| Recurso | Free tier |
|---|---|
| Builds/mês | 30 (mais que suficiente) |
| Plataformas | Android ✅ iOS ⚠️ (requer Apple Developer $99/ano) |
| Tempo de fila | 2-15min (varia com carga) |
| Validade do link | 30 dias |

### 4. Fluxo do Aluno (Android)

```
1. Receber link WhatsApp/email: https://expo.dev/accounts/.../builds/...
2. Abrir link no celular → "Download APK"
3. Android: "Instalar de fontes desconhecidas" → Permitir
4. Instalar → Abrir "DeOlho"
5. Criar conta → Testar → Preencher formulário
```

### 5. Edge Cases
- **"Fontes desconhecidas" bloqueado**: acontece em alguns Samsung com One UI. Solução: ir em Configurações → Apps → Chrome → Instalar apps desconhecidos → Permitir
- **APK muito grande**: com todas as dependências nativas (~50-80MB) é normal para React Native
- **`eas build` falha por versão do EAS CLI**: usar `npx eas-cli@latest` em vez de global install
- **Firestore índices faltando**: o primeiro `orderBy('timestamp', 'desc')` pode pedir criação de índice. O Firebase Console mostra o link do índice nos logs — criar antes dos testes
- **Rate limit Gemini** (15 RPM): com 20-30 alunos testando simultâneos, pode atingir. Solução: pedir que os alunos testem em momentos escalonados (grupos de 5 a cada 5min)

### 6. Critérios de Aceite
- [ ] `eas build --profile preview --platform android` completa sem erros
- [ ] Link de download funciona e APK instala em celular Android
- [ ] Criar conta no app instalado → feed carrega
- [ ] Postar denúncia → aparece no feed de outro celular
- [ ] Análise de IA funciona (Step2Description chama Render)
- [ ] Formulário Google Forms criado e testado
- [ ] Índices Firestore criados (sem erros de "index required" nos logs)
- [ ] Cron-job.org ativo e fazendo ping no Render

---

## 📂 Arquivos a Modificar

### `eas.json` — ATUALIZAR PROFILE `preview`

```json
{
  "cli": {
    "version": ">= 16.23.1",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "env": {
        "BACKEND_URL": "https://deolho-ia.onrender.com",
        "BACKEND_API_KEY": "SUBSTITUIR_PELO_VALOR_REAL"
      }
    },
    "production": {
      "autoIncrement": true,
      "android": {
        "buildType": "apk"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

> ⚠️ **Não commitar `BACKEND_API_KEY` real no `eas.json`**. Use `eas secret:create` em vez disso (ver comandos abaixo).

---

### `eas.json` — VERSÃO SEGURA (com EAS Secrets)

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" },
      "env": {
        "BACKEND_URL": "https://deolho-ia.onrender.com",
        "BACKEND_API_KEY": "@backend_api_key"
      }
    }
  }
}
```

---

## Comandos em Ordem

### Passo 1 — Login no EAS

```bash
npx eas-cli@latest login
# Fazer login com a conta expo.dev
```

### Passo 2 — Configurar Secret (seguro, não fica no git)

```bash
npx eas-cli@latest secret:create \
  --scope project \
  --name BACKEND_API_KEY \
  --value "SEU_BACKEND_API_KEY_AQUI"
```

### Passo 3 — Build

```bash
npx eas-cli@latest build \
  --profile preview \
  --platform android \
  --non-interactive
```

> O build leva 5-15min na fila gratuita. O terminal exibe o progresso e a URL final.

### Passo 4 — Obter link de download

```bash
# O output do build exibe a URL. Também disponível em:
# https://expo.dev/accounts/SEU_USERNAME/projects/DeOlho/builds
```

### Passo 5 — Criar índices Firestore (se necessário)

Após o primeiro `onSnapshot` com `orderBy`, o Firebase Console pode exibir um link de erro:
```
FirebaseError: The query requires an index.
https://console.firebase.google.com/...
```
Clicar no link → "Criar índice" → aguardar ~2min.

### Passo 6 — Configurar cron-job.org

```
URL: https://deolho-ia.onrender.com/health
Frequência: */10 * * * * (a cada 10 minutos)
Method: GET
```

---

## Cenários de Teste GQS

### Formulário Google Forms — Template

**Título**: Teste de Usabilidade — App DeOlho No Lixo

**Seção 1: Identificação**
- Nome (texto curto)
- E-mail (texto curto)
- Você tem experiência com apps de denúncia cidadã? (Sim/Não)

**Seção 2: Tarefas — Executar cada uma e avaliar**

| Tarefa | O que fazer |
|---|---|
| T1 | Criar uma conta com e-mail e senha |
| T2 | Fazer login com a conta criada |
| T3 | Ver o feed de denúncias existentes |
| T4 | Curtir uma denúncia |
| T5 | Comentar em uma denúncia |
| T6 | Fazer uma denúncia manual (foto + local + descrição) |
| T7 | Usar a denúncia com IA (tirar foto → ver análise automática) |
| T8 | Editar o perfil e salvar |
| T9 | Recuperar senha por e-mail |

**Para cada tarefa** (escala 1-5):
- Conseguiu completar? (Sim / Com dificuldade / Não)
- Dificuldade: (1 = Muito fácil → 5 = Muito difícil)
- Comentários (texto livre)

**Seção 3: Avaliação Geral**
- Avaliação geral do app (1-5 estrelas)
- O que você mais gostou? (texto livre)
- O que deve ser melhorado? (texto livre)
- Você usaria esse app no dia a dia? (Sim / Talvez / Não)
- Sugestões adicionais (texto livre)

---

## Checklist Final de Lançamento

### Infraestrutura
- [ ] Firebase Auth: habilitado com e-mail/senha
- [ ] Firestore: coleção `denuncias` existe, regras salvas
- [ ] Firestore: índice de `timestamp` criado
- [ ] Storage: bucket ativo, regras salvas
- [ ] BackendIA: `GET /health` retorna 200 no Render
- [ ] Cron-job.org: ativo e fazendo ping

### App
- [ ] APK instalado em 2 celulares diferentes e testado end-to-end
- [ ] Denúncia de um celular aparece no feed do outro
- [ ] IA analisa foto corretamente
- [ ] Perfil salva e persiste após fechar o app
- [ ] Recuperação de senha funciona (chega e-mail do Firebase)

### Distribuição
- [ ] Link do APK compartilhado via WhatsApp/grupo da turma
- [ ] Instruções de instalação enviadas junto ("Configurações → Segurança → Fontes desconhecidas")
- [ ] Formulário Google Forms com link aberto para respostas
- [ ] Conta de teste compartilhada criada: `teste.gqs@gmail.com` / senha: combinar no dia

---

## Commit

```bash
git add eas.json
git commit -m "chore: configure EAS Build preview profile for GQS user testing"
```
