# 📱 DeOlho NoLixo

> Aplicativo colaborativo para combater o descarte irregular de lixo usando Inteligência Artificial

[![License](https://img.shields.io/badge/license-0BSD-blue.svg)](LICENSE)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?logo=python)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?logo=fastapi)](https://fastapi.tiangolo.com/)

---

## 📖 Sobre o Projeto

**DeOlho NoLixo** é uma plataforma completa de denúncias cidadãs que conecta a população aos órgãos responsáveis pela gestão de resíduos. Usando **Inteligência Artificial**, o sistema classifica automaticamente denúncias de descarte irregular e as encaminha aos órgãos competentes.

### ✨ Funcionalidades

- 🔐 **Autenticação Completa**: Login, cadastro, recuperação de senha e login social (Google)
- 📸 **Denúncias Inteligentes**: Foto + GPS + descrição com classificação automática por IA
- 📱 **Feed Social**: Visualização, likes, comentários e compartilhamentos
- 🤖 **IA de Classificação**: YOLOv8 detecta tipos de lixo em imagens
- 🧠 **Análise Contextual**: Google Gemini identifica órgãos responsáveis
- 🔔 **Notificações**: Alertas sobre status das denúncias
- 👤 **Perfil Completo**: Histórico, estatísticas e configurações

### 🏗️ Arquitetura

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Mobile App    │ ───> │   Backend API    │ ───> │   Backend IA    │
│ React Native    │      │  FastAPI+Redis   │      │  YOLOv8+Gemini  │
│   + Expo        │ <─── │   + Firebase     │ <─── │                 │
└─────────────────┘      └──────────────────┘      └─────────────────┘
```

---

## 🚀 Quick Start

### Pré-requisitos

- [Node.js 18+](https://nodejs.org/) | [Python 3.11+](https://www.python.org/) | [Git](https://git-scm.com/)
- [Android Studio](https://developer.android.com/studio) (emulador)
- Conta [Firebase](https://firebase.google.com/) + API Key [Google Gemini](https://makersuite.google.com/app/apikey)

### Instalação Rápida

```bash
# 1. Clonar repositório
git clone https://github.com/Alejjandromart/DeOlhoNoLixo-App.git
cd DeOlhoNoLixo-App

# 2. Instalar dependências
npm install

# 3. Configurar backends
cd backend/BackendRedis && pip install -r requirements.txt
cd ../../backendIA && pip install -r requirements.txt
```

### Executar

```bash
# Terminal 1 - Backend Principal
cd backend/BackendRedis
uvicorn app.main:app --reload --port 8000

# Terminal 2 - Backend IA
cd backendIA
uvicorn app.main:app --reload --port 8001

# Terminal 3 - App Mobile
npm start
```

📚 **Guia completo**: [docs/INSTALACAO.md](docs/INSTALACAO.md)

---

## 📚 Documentação

| Documento | Descrição |
|-----------|-----------|  
| **[📦 Instalação](docs/INSTALACAO.md)** | Guia completo passo a passo de instalação e configuração |
| **[🚀 Tecnologias](docs/TECNOLOGIAS.md)** | Stack técnico detalhado e justificativas |
| **[📁 Estrutura](docs/ESTRUTURA.md)** | Organização de pastas e arquivos do projeto |
| **[🤝 Contribuindo](docs/CONTRIBUINDO.md)** | Como contribuir, padrões de código e Git workflow |
| **[🆘 Troubleshooting](docs/TROUBLESHOOTING.md)** | Soluções para problemas comuns |



---

## 📂 Estrutura do Projeto

```
DeOlhoNoLixo-App/
├── 📱 app/                      # Mobile App (React Native + Expo)
│   ├── screens/                 # Telas (Auth, Home, Denúncias)
│   ├── components/              # Componentes reutilizáveis
│   ├── navigation/              # Navegação
│   └── services/                # APIs
│
├── 🔧 backend/BackendRedis/     # Backend Principal (FastAPI)
│   └── app/                     # API REST
│
├── 🤖 backendIA/                # Backend IA (YOLOv8 + Gemini)
│   └── app/                     # Serviços de IA
│
└── 📄 docs/                     # Documentação
```

**Estrutura completa**: [docs/ESTRUTURA.md](docs/ESTRUTURA.md)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! 

### Como Contribuir

1. Fork o projeto
2. Crie sua branch (`git checkout -b feature/MinhaFeature`)
3. Commit (`git commit -m 'feat: adiciona MinhaFeature'`)
4. Push (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Áreas de Contribuição

- 🎨 **Frontend**: UI/UX, componentes
- 🔧 **Backend**: Endpoints, otimizações
- 🤖 **IA**: Modelos, prompts
- 📝 **Docs**: Tutoriais, traduções
- 🧪 **Testes**: Cobertura de testes

**Guia completo**: [docs/CONTRIBUINDO.md](docs/CONTRIBUINDO.md)

---

## 🐛 Problemas e Suporte

### Problemas Comuns

- ❌ **"Unable to resolve module"** → `npx expo start -c`
- ❌ **Backend não conecta** → Usar IP ao invés de localhost
- ❌ **Firebase errors** → Verificar credenciais
- ❌ **Permissões negadas** → Ver [PermissionsScreen.tsx](app/screens/Auth/PermissionsScreen.tsx)

**Soluções completas**: [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

### Obter Ajuda

- 🐛 **[Issues](https://github.com/Alejjandromart/DeOlhoNoLixo-App/issues)**: Para bugs
- 💬 **[Discussions](https://github.com/Alejjandromart/DeOlhoNoLixo-App/discussions)**: Para perguntas

---

## 🗺️ Roadmap

### ✅ Implementado
- [x] Autenticação com Firebase
- [x] Feed de denúncias
- [x] Classificação YOLOv8
- [x] Análise com Gemini

### 🚧 Em Desenvolvimento
- [ ] Testes automatizados
- [ ] Mapas interativos
- [ ] Notificações push

### 🎯 Planejado
- [ ] Dashboard administrativo
- [ ] App Web
- [ ] Internacionalização

---

## 👥 Equipe

Desenvolvido com ❤️ por estudantes engajados em melhorar a gestão de resíduos urbanos.

---

## 📄 Licença

Este projeto está sob a licença **0BSD** (Zero-Clause BSD).

---

## 🌟 Agradecimentos

- [React Native Community](https://reactnative.dev/)
- [Expo Team](https://expo.dev/)
- [Google Gemini AI](https://ai.google.dev/)
- [Firebase](https://firebase.google.com/)
- [Ultralytics YOLOv8](https://ultralytics.com/)

---

<div align="center">
  
**DeOlho NoLixo** - Juntos por cidades mais limpas! 🌍♻️

Se este projeto foi útil, considere dar uma ⭐️!

</div>

