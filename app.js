const express = require('express');
const {downloadVideo} = require('./downloadVideo.js')
const path = require('path')

const app = express();
app.use(express.json())

app.post('/download',async (req,res)=>{
    const {url} = req.body;
    console.log(url)
    if(!url){
        return res.status(400).json({error: 'URL do video é necessária'});
    }
    try {
        const filePath =  await downloadVideo(url);
        res.status(200).json({message: 'Download concluido com sucesso', filePath})
    } catch (error) {
        res.status(500).json({error:'Erro ao baixar o video'})
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