const fs = require('fs');
const path = require('path');
const ytdl = require('@distube/ytdl-core');
const { Client } = require('undici'); // Importa o Client do pacote undici

const dataFile = path.join(__dirname, "quantidade-videos.js");

// Função para carregar a quantidade de vídeos baixados
function loadQuantidadeVideos() {
  if (fs.existsSync(dataFile)) {
    const data = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(data).quantidadeVideos;
  } else {
    return 0;
  }
}

// Função para salvar a quantidade de vídeos baixados
function saveQuantidadeVideos(quantidade) {
  const data = { quantidadeVideos: quantidade };
  fs.writeFileSync(dataFile, JSON.stringify(data), 'utf-8');
}

// Função para baixar o vídeo na maior resolução com o nome do YouTube
async function downloadVideo(url) {
  if (!url || typeof url !== 'string') {
    throw new Error('URL inválida!');
  }

  // Configuração do proxy
  const proxyUri = "http://35.185.196.38:3128"; // Endereço e porta do proxy
  const client = new Client(proxyUri); // Cria o client de proxy

  try {
    // Obtendo informações do vídeo com o proxy
    const info = await ytdl.getInfo(url, { requestOptions: { client } });

    // Selecionando o formato com a maior qualidade (por resolução)
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'videoandaudio' });
    console.log('Formato encontrado:', format);

    // Nome do arquivo baseado no título do vídeo, removendo caracteres inválidos e emojis
    const title = info.videoDetails.title
      .replace(/[<>:"\/\\|?*#]+/g, '') // Inclui a remoção do caractere #
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '')  // Emoticons
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')  // Símbolos e pictogramas
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')  // Transporte e símbolos de mapa
      .replace(/[\u{1F700}-\u{1F77F}]/gu, '')  // Símbolos diversos e pictogramas
      .replace(/[\u{1F780}-\u{1F7FF}]/gu, '')  // Símbolos suplementares de pictogramas
      .replace(/[\u{1F800}-\u{1F8FF}]/gu, '')  // Símbolos suplementares de flechas
      .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')  // Símbolos suplementares de emoticons
      .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '')  // Símbolos de atividades
      .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '')  // Símbolos de objetos
      .replace(/[\u{2600}-\u{26FF}]/gu, '')    // Símbolos diversos
      .replace(/[\u{2700}-\u{27BF}]/gu, '');   // Dingbats

    const output = path.join(__dirname, 'videos', `${title}.mp4`);

    // Certifique-se de que o diretório 'videos' existe
    if (!fs.existsSync(path.join(__dirname, 'videos'))) {
      fs.mkdirSync(path.join(__dirname, 'videos'));
    }

    return new Promise((resolve, reject) => {
      ytdl(url, { format: format, requestOptions: { client } }) // Usando o proxy ao fazer o download
        .pipe(fs.createWriteStream(output))
        .on('finish', () => {
          console.log(`Download concluído: ${output}`);

          let quantidade = loadQuantidadeVideos();
          quantidade += 1;
          saveQuantidadeVideos(quantidade);
          console.log(`Quantidade de videos baixados: ${quantidade}`);

          resolve(output);  // Retorna o caminho completo do arquivo
        })
        .on('error', (err) => {
          console.error(`Erro durante o download: ${err.message}`);
          fs.unlinkSync(output);
          reject(err);
        });
    });

  } catch (err) {
    console.error(`Erro ao obter informações do vídeo: ${err.message}`);
    throw err;
  }
}

module.exports = { downloadVideo, loadQuantidadeVideos };
