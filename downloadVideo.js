const fs = require('fs');
const path = require('path');
const ytdl = require('@distube/ytdl-core');

// Carregar cookies do arquivo cookies.json
let cookies = [];
try {
  cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf-8'));
} catch (err) {
  console.error("Erro ao carregar os cookies:", err.message);
}

const dataFile = path.join(__dirname, "quantidade-videos.js");

// Função para carregar a quantidade de vídeos
function loadQuantidadeVideos() {
  if (fs.existsSync(dataFile)) {
    const data = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(data).quantidadeVideos;
  } else {
    return 0;
  }
}

// Função para salvar a quantidade de vídeos
function saveQuantidadeVideos(quantidade) {
  const data = { quantidadeVideos: quantidade };
  fs.writeFileSync(dataFile, JSON.stringify(data), 'utf-8');
}

// Criar o agente com cookies
const agent = ytdl.createAgent(cookies);

async function downloadVideo(url) {
  if (!url || typeof url !== 'string') {
    throw new Error('URL inválida!');
  }

  try {
    const info = await ytdl.getInfo(url, { agent });

    const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'videoandaudio' });
    console.log('Formato encontrado:', format);

    const title = info.videoDetails.title
      .replace(/[<>:"\/\\|?*#]+/g, '') // Remover caracteres inválidos
      .replace(/[\u{1F600}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ''); // Remover emojis e caracteres especiais

    const output = path.join(__dirname, 'videos', `${title}.mp4`);

    if (!fs.existsSync(path.join(__dirname, 'videos'))) {
      fs.mkdirSync(path.join(__dirname, 'videos'));
    }

    return new Promise((resolve, reject) => {
      ytdl(url, { format, agent })
        .pipe(fs.createWriteStream(output))
        .on('finish', () => {
          console.log(`Download concluído: ${output}`);

          let quantidade = loadQuantidadeVideos();
          quantidade += 1;
          saveQuantidadeVideos(quantidade);
          console.log(`Quantidade de vídeos baixados: ${quantidade}`);

          resolve(output);
        })
        .on('error', (err) => {
          console.error(`Erro durante o download: ${err.message}`);
          if (fs.existsSync(output)) {
            fs.unlinkSync(output); // Remove o arquivo corrompido
          }
          reject(err);
        });
    });

  } catch (err) {
    console.error(`Erro ao obter informações do vídeo: ${err.message}`);
    throw err;
  }
}

// Exemplo de uso:
// downloadVideo('https://www.youtube.com/watch?v=Scu9qoyrVJE');
module.exports = { downloadVideo, loadQuantidadeVideos };
