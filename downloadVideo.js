const fs = require('fs');
const path = require('path');
const ytdl = require('@distube/ytdl-core');

// Definir os cookies no novo formato suportado
const cookies = [
  { name: "__Secure-1PSIDTS", value: "sidts-CjEBQT4rX9qLAXE_ibmNsz7gqSJO5Ue0yS_-fLvjSC7gBxaMc8Ld8b0p90UdWiJ3jNzmEAA" },
  { name: "__Secure-3PAPISID", value: "A8CK1MgF8g0irnZz/A3QIDW_f_D9pEToJs" },
  { name: "__Secure-3PSID", value: "g.a000nghNALlnXJ_dVSVLWbMw7db6hKumq8zGlyfoK52XsgBJrV9AvNptmR9Tp5GKBbM9CCICsQACgYKAaASARISFQHGX2MixAaxnJx3MDi1Ayi1dl3LKBoVAUF8yKqzKMyawmQWYoB5oEelttGB0076" },
  { name: "__Secure-3PSIDCC", value: "AKEyXzW_7G6PK-hOPPOKmIYFtZc9WJN1bX5W9dkIGkZgR1u5mXYZtTfMWtcAc98jtmodQckC-TI" },
  { name: "__Secure-3PSIDTS", value: "sidts-CjEBQT4rX9qLAXE_ibmNsz7gqSJO5Ue0yS_-fLvjSC7gBxaMc8Ld8b0p90UdWiJ3jNzmEAA" },
  { name: "LOGIN_INFO", value: "AFmmF2swRgIhAIof808vDUjhbNrGQLT5ik7IgAAG_8xHGnfBzI9c_d65AiEAmM3BTT_OhgxUN-KZkktqI9TPa5sECB_mPRNpr13tVIc:QUQ3MjNmeXBlc1Q5Y2FXVXg5QzdFVUV4OEotTGhURFBqd0paWGR1ano2clB0LTUxajlXU2UxR2NDTDhEY0NuTmtxbkpZZWNWTTFGNjFQODEzdUlYdGtUWHVkRTZhbUF4VWtuTXVteDZlYWMwMmw4d3BRdHBGRGNvVEhvX2ZTT2stTXRvVHEzMm5OMmYzY05NT2R2UmpWOXJSX3VOWUdjdHJB" }
];

// Criar o agente com os cookies
const agent = ytdl.createAgent(cookies);

const dataFile = path.join(__dirname, "quantidade-videos.js");

function loadQuantidadeVideos() {
  if (fs.existsSync(dataFile)) {
    const data = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(data).quantidadeVideos;
  } else {
    return 0;
  }
}

function saveQuantidadeVideos(quantidade) {
  const data = { quantidadeVideos: quantidade };
  fs.writeFileSync(dataFile, JSON.stringify(data), 'utf-8');
}

async function downloadVideo(url) {
  if (!url || typeof url !== 'string') {
    throw new Error('URL inválida!');
  }

  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    };

    console.log('Cabeçalhos da solicitação:', headers); // Adicione este log para verificar os cabeçalhos

    const info = await ytdl.getInfo(url, {
      requestOptions: {
        headers,
        agent,
      }
    });

    let format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'videoandaudio' });
    if (!format) {
      format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'videoandaudio' });
    }
    console.log('Formato encontrado:', format);

    const title = info.videoDetails.title
      .replace(/[<>:"\/\\|?*#]+/g, '') // Remover caracteres inválidos
      .replace(/[\u{1F600}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ''); // Remover emojis e caracteres especiais

    const output = path.join(__dirname, 'videos', `${title}.mp4`);

    if (!fs.existsSync(path.join(__dirname, 'videos'))) {
      fs.mkdirSync(path.join(__dirname, 'videos'));
    }

    return new Promise((resolve, reject) => {
      ytdl(url, { format, requestOptions: { headers, agent } })
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