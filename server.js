const {app} = require('./app.js');
const {job} = require('./deletarVideo.js');

const port = 3333;
//alef dev
job.start();

app.listen(port, ()=>{
    console.log(`Servidor rodando na porta ${port}`)
});

