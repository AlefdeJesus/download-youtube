const fs = require('fs');
const path = require('path');
const cron = require('cron');


// Caminho da pasta de vídeos
const videosDir = path.join(__dirname, 'videos');

// Função para apagar arquivos mais antigos que 2 minutos
const deleteOldVideos = () => {
    console.log('função deletar videos iniciada!');

    fs.readdir(videosDir, (err, files) => {
        if (err) {
            console.error('Erro ao ler a pasta de vídeos:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(videosDir, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Erro ao obter estatísticas do arquivo:', err);
                    return;
                }

                const now = Date.now();
                const fileModifiedTime = new Date(stats.mtime).getTime();
                const diffMinutes = (now - fileModifiedTime) / (1000 * 60);

                // Se o arquivo foi modificado há mais de 2 minutos, apaga o arquivo
                if (diffMinutes > 2) {
                    fs.unlink(filePath, err => {
                        if (err) {
                            console.error('Erro ao apagar o arquivo:', err);
                        } else {
                            console.log(`ARQUIVO APAGADO COMSCESSO: ${file}`);
                        }
                    });
                }
            });
        });
    });
};

// Configurando o cron job para executar a cada 10 minutos
const job = new cron.CronJob('*/10 * * * *', deleteOldVideos, null, true, 'America/Sao_Paulo');


    module.exports = { job };




