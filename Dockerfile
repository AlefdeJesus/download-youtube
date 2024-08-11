# Usar uma imagem base do Node.js
FROM node:20

# Criar um diretório de trabalho dentro do container
WORKDIR /app

# Copiar o arquivo package.json e package-lock.json (se existir) para o diretório de trabalho
COPY package*.json ./

# Instalar as dependências da aplicação
RUN npm install

# Copiar todos os arquivos do diretório atual para o diretório de trabalho no container
COPY . .

# Expor a porta em que a aplicação vai rodar (ajuste se necessário)
EXPOSE 3000

# Comando para rodar a aplicação (ajuste conforme o ponto de entrada da sua aplicação)
CMD ["node", "server.js"]
