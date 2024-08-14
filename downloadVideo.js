const fs = require('fs');
const path = require('path');
const ytdl = require('@distube/ytdl-core');
const { Client } = require('undici');

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

  const cookies = "HSID=AzQdg6LJ1lz9Bh07M; SSID=AtS_1kGYDOoVMnUv5; APISID=wZW1CyH8dzksSTMS/AxcU4DMNWW-p_1UXt; SAPISID=KhDV_IQrD-sFbRF0/AZz8KT373EN-f65F6; __Secure-1PAPISID=KhDV_IQrD-sFbRF0/AZz8KT373EN-f65F6; __Secure-3PAPISID=KhDV_IQrD-sFbRF0/AZz8KT373EN-f65F6; LOGIN_INFO=AFmmF2swRAIgARBE6B-Abi5JZVgi_A0u0Yr4DU_jvjbPHYs3QPe5enoCIEY6e-estaTboatqqYC2R9oPp0UbbblYB7dn1jKVtO3t:QUQ3MjNmd0kyUkVPY1hQSzhHRnlod0hYSFdsWmNmZmhMcTVHUVVQd3ktQnB5NXBZMW9QZ1NxTUxqbHBmX3RkRFcxaFE4djhELV9kOXFqdXZGdENTdU5uS240X2hWVk1kZXhGTnBYZ3VWcGdCeWttYkNHX0VESlZVVkY2cUYzQ0tldDlBcGlqejhtNktfLWFyZ21NdDl1RXpRSUwxZGlNcDNB; VISITOR_INFO1_LIVE=qCqXuY3kUqY; VISITOR_PRIVACY_METADATA=CgJCUhIEGgAgZA%3D%3D; SID=g.a000mAhSuNoNYCJtK1W5T6MRWkhVzyPLlSjLo2IkJLOX9clUp6cuvWAP8buxqJzhy9IDF-GKEQACgYKAb8SARESFQHGX2MiMzvr7aiOeIm3qRItIlQF2BoVAUF8yKq7ZotQ34B5TO4bFebr3lnv0076; __Secure-1PSID=g.a000mAhSuNoNYCJtK1W5T6MRWkhVzyPLlSjLo2IkJLOX9clUp6cuw7EXvt2Yg59pfQK9e5bZAgACgYKAWcSARESFQHGX2MiBXqgvKbi7mHyiEKcdEXNExoVAUF8yKpKAdbzULHvZ6WlIVhenXba0076; __Secure-3PSID=g.a000mAhSuNoNYCJtK1W5T6MRWkhVzyPLlSjLo2IkJLOX9clUp6cutZEWGxGTWEI9QsB5-vYjVwACgYKARsSARESFQHGX2MibbJ8yoXYUVdNpcIUyOaxOhoVAUF8yKoVO43UVBtg-f0w98WJjBu70076; PREF=tz=America.Fortaleza; YSC=tiyB8_iNUos; __Secure-1PSIDTS=sidts-CjIBUFGoh7lY0FNGUz25fOyVSxhFrC-SBkKEi4RbzDlLXD9uZBs-nhcHeFIZ56ubZaRzyRAA; __Secure-3PSIDTS=sidts-CjIBUFGoh7lY0FNGUz25fOyVSxhFrC-SBkKEi4RbzDlLXD9uZBs-nhcHeFIZ56ubZaRzyRAA; SIDCC=AKEyXzVG5zwxIeSPcyjxVTgaXhn-Q3ITpE8aKAIiINI4XcwNCRLq1m-Dd21SkbdBZ6eBlnI78rU; __Secure-1PSIDCC=AKEyXzVCebeTCQdcOAlHKFg96L-KV_LxsxQ9VyRIOwvsHK1FDYKffjto2kjIlyueSNJ8PVZFGo0; __Secure-3PSIDCC=AKEyXzUQiaa-aDzVA4yn9JmZEtvaMzTzHTQGyb2f5MD7ASh9M03YJikBaZagsAaUkw5MLgjtDA";

  try {
    const info = await ytdl.getInfo(url, {
      requestOptions: {
        headers: {
          'Cookie': cookies
        }
      }
    });

    const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'videoandaudio' });
    console.log('Formato encontrado:', format);

    const title = info.videoDetails.title
      .replace(/[<>:"\/\\|?*#]+/g, '')
      .replace(/[\u{1F600}-\u{1F64F}]/gu, '')
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/[\u{1F700}-\u{1F77F}]/gu, '')
      .replace(/[\u{1F780}-\u{1F7FF}]/gu, '')
      .replace(/[\u{1F800}-\u{1F8FF}]/gu, '')
      .replace(/[\u{1F900}-\u{1F9FF}]/gu, '')
      .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '')
      .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '')
      .replace(/[\u{2600}-\u{26FF}]/gu, '')
      .replace(/[\u{2700}-\u{27BF}]/gu, '');

    const output = path.join(__dirname, 'videos', `${title}.mp4`);

    if (!fs.existsSync(path.join(__dirname, 'videos'))) {
      fs.mkdirSync(path.join(__dirname, 'videos'));
    }

    return new Promise((resolve, reject) => {
      ytdl(url, { format: format })
        .pipe(fs.createWriteStream(output))
        .on('finish', () => {
          console.log(`Download concluído: ${output}`);

          let quantidade = loadQuantidadeVideos();
          quantidade += 1;
          saveQuantidadeVideos(quantidade);
          console.log(`Quantidade de videos baixados: ${quantidade}`);

          resolve(output);
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

// Exemplo de uso:
// downloadVideo('https://www.youtube.com/watch?v=Scu9qoyrVJE');
module.exports = { downloadVideo, loadQuantidadeVideos };
