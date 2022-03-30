const query = require('../infraestrutura/database/queries')
const { adiciona } = require('../models/pets')

class Atendimento {
    adiciona(atendimento){
        const sql = 'INSERT INTO agenda_petshop.atendimentos SET ?'
        return query(sql, atendimento)
    }

}

module.exports = new Atendimento()