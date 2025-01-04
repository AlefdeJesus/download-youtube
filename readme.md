## COMANDO PARA IGNORAR PYTHON QUANDO DER ERRO NA INSTALAÇÃO.
set YOUTUBE_DL_SKIP_PYTHON_CHECK=1 && npm install @distube/ytdl-core@latest


# DownTube Back-end

# Link do front-end
https://github.com/AlefdeJesus/FORNT-END-DOWNLOAD-VIDEO-YOUTUBE


## Descrição
Este projeto permite o download de vídeos do YouTube. Atualmente, ele funciona apenas localmente, pois ao ser hospedado em um servidor, o YouTube consegue bloquear a biblioteca `ytdl`, impedindo seu funcionamento.

## Instalação
Passos para instalar e configurar o projeto:

```bash
# Clone o repositório
git clone https://github.com/AlefdeJesus/download-youtube.git

# Entre no diretório do projeto
cd downtube

# Instale as dependências
npm install

# Comando para iniciar o projeto
node server.js

Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.
