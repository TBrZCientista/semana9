const fs = require('fs')
const { formatWithOptions } = require('util')

fs.createReadStream('./assets/salsicha.jpg')
    .pipe(fs.createWriteStream('./assets/salsicha-stream.jpg'))
    .on('finish',()=> console.log('imagem foi escrita com sucesso'))