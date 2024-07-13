# Use uma imagem oficial do Node.js como base
FROM node:14

# Defina o diretório de trabalho no container
WORKDIR /app

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências da aplicação
RUN npm install

# Copie o restante do código da aplicação para o diretório de trabalho
COPY . .

# Construa a aplicação para produção
RUN npm run build

# Instale o servidor web estático
RUN npm install -g serve

# Exponha a porta que a aplicação irá rodar
EXPOSE 3000

# Defina o comando para rodar a aplicação
CMD ["serve", "-s", "build", "-l", "3000"]

