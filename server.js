const express = require('express');
const {downloadVideo, videoUrl} = require('./downloadVideo.js')

const app = express();
const port = 3000;

downloadVideo(videoUrl);

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`)
});