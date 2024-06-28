const express = require('express');
const {downloadVideo} = require('./downloadVideo.js')
const path = require('path')
const cors = require('cors');

const app = express();
app.use(express.json())

app.use(cors( {
  origin: '*',
  methods: 'GET, POST, OPTIONS, PATCH, DELETE, PUT',
  allowedHeaders: 'Content-Type, Authorization, Accept, X-Requested-With, credentials', // Certifique-se de incluir 'credentials'
  credentials: true
}));

app.post('/download', async (req, res) => {
  const { url } = req.body;
  console.log(url);
  if (!url) {
      return res.status(400).json({ error: 'URL do vídeo é necessária' });
  }
  try {
      const filePath = await downloadVideo(url);
      console.log('filePath:', filePath);  // Adicione este log para depuração

      // Retorna o caminho relativo
      const relativeFilePath = path.relative(__dirname, filePath).replace(/\\/g, '/');
      res.status(200).json({ message: 'Download concluído com sucesso', filePath: relativeFilePath });
  } catch (error) {
      console.error('Erro ao baixar o vídeo:', error);
      res.status(500).json({ error: 'Erro ao baixar o vídeo' });
  }
});


app.get('/videos/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'videos', filename);

  res.download(filePath, (err) => {
    if (err) {
      console.error('Erro ao fornecer o vídeo:', err);
      res.status(500).send('Erro ao fornecer o vídeo.');
    }
  });
}); 
//const videoUrl = 'https://youtu.be/DDJX_vor5N8?si=bo4zJJAf1eIdyCT7';
//downloadVideo(videoUrl);

module.exports = { app};