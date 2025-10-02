# Base Node LTS
FROM node:20

# Definir diretório de trabalho
WORKDIR /app

# Instalar dependências necessárias
RUN apt-get update && apt-get install -y \
  openjdk-17-jdk \
  watchman \
  git \
  python3 \
  build-essential \
  && rm -rf /var/lib/apt/lists/*

# Instalar expo-cli global
RUN npm install -g expo-cli yarn

# Copiar arquivos do projeto
COPY package*.json yarn.lock* ./

# Instalar dependências
RUN yarn install || npm install


# Expor portas do Expo
EXPOSE 19000 19001 19002

# Rodar o app
CMD ["expo", "start", "--tunnel"]
