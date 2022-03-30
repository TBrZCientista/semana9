const fs = require('fs')
const { formatWithOptions } = require('util')

module.exports = (caminho, nomeDoArquivo, callbackImagemCriada)=> {
    const novoCaminho = `./assets/imagens/${nomeDoArquivo}`

    fs.createReadStream(caminho)
        .pipe(fs.createWriteStream(novoCaminho))
        .on('finish',()=> callbackImagemCriada(novoCaminho))
    }
