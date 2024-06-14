const fs = require('fs');
const ytdl = require('ytdl-core');

// Função para baixar o vídeo na maior resolução com o nome do YouTube
async function downloadVideo(videoUrl) {
  try {
    // Obtendo informações do vídeo
    const info = await ytdl.getInfo(videoUrl);
    
    // Selecionando o formato com a maior qualidade (por resolução)
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo', filter: 'videoandaudio' });
    console.log('Formato encontrado:', format);

    // Nome do arquivo baseado no título do vídeo
    const title = info.videoDetails.title.replace(/[<>:"\/\\|?*]+/g, '');
    const output = `${title}.mp4`;

    // Baixando o vídeo e salvando no arquivo de saída
    ytdl(videoUrl, { format: format })
      .pipe(fs.createWriteStream(output))
      .on('finish', () => {
        console.log(`Download concluído: ${output}`);
      })
      .on('error', (err) => {
        console.error(`Erro durante o download: ${err.message}`);
        fs.unlinkSync(output)
        //criar uma funçao para excluir video quando der erro durante download
      });

    // Exibindo informações do vídeo no console
    console.log('Título:', info.videoDetails.title);
    console.log('Duração:', info.videoDetails.lengthSeconds, 'segundos');
  
  } catch (err) {
    console.error(`Erro ao obter informações do vídeo: ${err.message}`);
  }
}

// URL do vídeo que você quer baixar
const videoUrl = 'https://www.youtube.com/watch?v=oh904_HdkwY';

module.exports = {downloadVideo, videoUrl};
