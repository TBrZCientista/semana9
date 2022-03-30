const  axios = require('axios')
const moment = require('moment')
const conexao = require('../infraestrutura/database/conexao')
const repositorio = require('../repositorios/atendimento')

class Atendimento {
    adiciona(atendimento){
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')

        const data = moment(atendimento.data,'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')

        const dataEhValida = moment(data).isSameOrAfter(dataCriacao)
        const clienteEhValido = atendimento.cliente.length >= 5

        const validacoes = [
            {
                nome: 'data',
                valido: dataEhValida,
                mensagem: 'Data deve ser igual ou maior a data atual.'
            },
            {
                nome:'cliente',
                valido: clienteEhValido,
                mensagem: 'Nome do cliente precisa ter mais de quatro caracteres.'
            }
        ]

        const erros = validacoes.filter(campo => !campo.valido)
        const existemErros = erros.length

        if (existemErros){
            return new Promise ((resolve, reject) => reject(erros))
            
        }else{
            const atendimentoDatado = {...atendimento, dataCriacao, data}

            return repositorio.adiciona(atendimentoDatado)
                .then(resultados => {
                    const id = resultados.insertId
                    return{...atendimento,id }
                })
        }

        
    }
    lista(res){
        const sql = 'SELECT * FROM agenda_petshop.atendimentos'

        conexao.query(sql, (erro, resultados) => {
            if (erro){
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultados)
            }
        })
    } 
    buscaPorId(id, res){
        const sql = `SELECT * FROM agenda_petshop.atendimentos WHERE id=${id}`

        conexao.query(sql, async (erro, resultados)=> {
            const atendimento = resultados[0]

            const cpf = atendimento.cliente
            
            if (erro){
                res.status(400).json(erro)
            } else {
                const {data} = await axios.get(`http://localhost:8082/${cpf}`)
                atendimento.cliente = data
                res.status(200).json(atendimento)
            }
        })
    }
    altera(id, valores, res){
       if(valores.data){
           valores.data = moment(valores.data,'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
       }
       
        const sql = 'UPDATE agenda_petshop.atendimentos SET? WHERE id=?'

       conexao.query(sql, [valores,id], (erro,resultados) => {
           if (erro){
               res.status(400).json(erro)
           }else {
               res.status(200).json({...valores,id})
           }
       })
    }
    deleta(id,res){
        const sql ='DELETE FROM agenda_petshop.atendimentos WHERE id=?'

        conexao.query(sql, id, (erro, resultados)=> {
            if(erro){
                res.status(400).json(erro)
            } else {
                res.status(200).json({id})
            }
        } )
    }

}

module.exports = new Atendimento