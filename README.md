Formatter Hero

Formatter Hero

# 📱 DeOlho NoLixo – Mobile App

Aplicativo colaborativo para registrar, monitorar e denunciar pontos de descarte irregular de lixo, desenvolvido em **React Native + Expo + TypeScript**.
O projeto busca engajar cidadãos e órgãos públicos no combate ao descarte irregular, garantindo transparência e participação social.

---

## 🚀 Tecnologias Utilizadas

- **React Native** → desenvolvimento multiplataforma (iOS/Android) com um único código-base.
- **Expo** → simplifica a configuração do ambiente mobile e oferece integrações nativas rápidas.
- **TypeScript** → adiciona tipagem estática ao JavaScript, prevenindo erros e facilitando manutenção.
- **Express.js (backend)** → framework rápido e flexível para criação da API REST.
- **MongoDB (planejado)** → banco de dados NoSQL para armazenamento das denúncias.

---

## 🔧 1. Pré-requisitos

- [Node.js (LTS)](https://nodejs.org/en/)
- [Git](https://git-scm.com/)
- [VS Code](https://code.visualstudio.com/)
- [Android Studio](https://docs.expo.dev/workflow/android-studio-emulator/) (para emulador Android)
- [Expo Go](https://expo.dev/go?sdkVersion=54&platform=android&device=false) (para rodar no celular físico)

Verifique a instalação:

```bash
node -v
npm -v
git --version
```

---

```bash
📂 2. Estrutura do Repositório

A organização do repositório segue boas práticas para projetos React Native com Expo e TypeScript:


DeOlhoNoLixo/
│
├── app/                     # Código fonte principal
│   ├── assets/              # Mídia estática
│   │   ├── fonts/           # Fontes do App
│   │   ├── images/          # Logo, ícones, backgorunds
│   │   ├── lottie/          # Animaçoes de loading, de sucesso
│   ├── components/          # Componentes UI reutilizáveis
│   ├── constants/           # Valores fixos
│   │   ├── Colors.ts        # Paleta de Cores
│   │   ├── Dimensions.ts    # Tamanho de tela e margens
│   │   ├── Config.ts        # Tamanho de tela e margens
│   ├── screens/             # Telas do aplicativo PRINCIPAL
│   │   ├── Auth/            # Telas de autenticação (Login, Cadastro, Recuperação de Senha)
│   │   ├── Profile/         # Telas de perfil e configurações
│   │   ├── Denuncia/        # Telas relacionadas às denúncias (Criar, Detalhes)
│   │   └── Feed/            # Telas do feed e interações
│   |
├── backend/                 # Código de Lógica
│   ├── ai/                  # Módulo de Inteligência Artificial 🤖
│   │   ├── classifiers/     # Classes de classificação (simples/contextual)
│   │   │   ├── ClassificadorSimples.js
│   │   │   └── ClassificadorContextual.js
│   │   ├── services/        # Serviços externos (AWS Rekognition, APIs IBGE/OSM)
│   │   │   ├── rekognition.js
│   │   │   ├── overpass.js
│   │   │   └── ibge.js
│   │   ├── utils/           # Funções auxiliares (cache, fallback, logs)
│   │   └── tests/           # Testes unitários da IA
│   │
│   ├── data/                # Módulo de Inteligência Artificial 🤖
│
├── # Configurações do sistema
└── README.md                # Documentação do projeto
```

Essa estrutura garante que cada parte do app seja modular e que os devs possam trabalhar em paralelo (ex: um no fluxo de **Autenticação** e outro no **Feed**).

---

## 📦 3. Instalação

Clonar o repositório e instalar dependências:

```bash
git clone <url-do-repo>
cd DeOlhoNoLixo
npm install
# ou
yarn install
```

---

## 📱 4. Configuração do Ambiente Mobile

1. Instalar o **Android Studio** e criar um emulador.
2. Instalar o **Expo CLI** globalmente:

   ```bash
   npm install -g expo-cli
   ```
3. Abrir o emulador ou instalar o **Expo Go** no celular físico.

---

## 🛠 5. Extensões Recomendadas no VS Code

* **Prettier – Code formatter** → formatação de código.
* **ESLint** → padronização e qualidade do código.
* **ES7+ React/Redux/React-Native snippets** → snippets úteis para agilizar.
* Formatter Hero → organiza imports automaticamente.

---

## ▶️ 6. Rodando o Projeto

* **No emulador Android**:

```bash
npm run android
```

* **No celular físico (QR Code)**:

```bash
npm start
```

---

## 🔄 7. Fluxo de Trabalho com Git

1. Atualizar branch principal:

   ```bash
   git pull origin main
   ```
2. Criar branch por funcionalidade:

   ```bash
   git checkout -b feature/nome-da-tela
   ```
3. Commitar com mensagens claras:

   ```bash
   git commit -m "feat: tela de login"
   ```
4. Subir branch:

   ```bash
   git push origin feature/nome-da-tela
   ```
5. Abrir **Pull Request** no GitHub para revisão.

---

## ✅ 8. Padronização de Código

* Usar **TypeScript** sempre.
* Componentes devem ser **funcionais com hooks**.
* Commits seguem convenção:

  * `feat:` → nova funcionalidade
  * `fix:` → correção
  * `refactor:` → refatoração
  * `docs:` → documentação
* Código deve passar por **ESLint + Prettier** antes de merge.

---

## 👨‍💻 Equipe e Divisão

* **Dev 1** → Autenticação (Login, Cadastro, Recuperação, Perfil).
* **Dev 2** → Denúncias e Feed (Home, Criar, Detalhes, Comentários).
* **Backend** → API com Express.js + MongoDB (implementação futura).
* **IA** → processamento de imagem/texto para classificação de denúncias.

---
