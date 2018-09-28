const mongoose = require('mongoose');
const Professional = mongoose.model('Professional');
const Validator = require('../validators/validator');
const repository = require('../repositories/professional-repository');;

exports.get = async(req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch(err) {
        res.status(500).send({
            message: 'Falha ao processar requisição'
        });
    }        
}

exports.getByEmail = async(req, res, next) => {
    try {
        var data = await repository.getByEmail(req.params.email);         
        res.status(200).send(data);
    } catch(err) {
        res.status(500).send({
            message: 'Falha ao processar requisição'
        });
    }

}

exports.getById = async(req, res, next) => {
    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch(err) {
        res.status(500).send({
            message: 'Falha ao processar requisição'
        });
    }    
}

exports.getByObj = async(req, res, next) => {
    try {
        var data = await repository.getByObj(req.params.obj);
        res.status(200).send(data);
    } catch(err) {
        res.status(500).send({
            message: 'Falha ao processar requisição'
        });
    }    
}

exports.post = async (req, res, next) => {
    let validInfo = new Validator();        
    validInfo.hasMinLen(req.body.name, 3, 'O nome deve conter pelo menos 3 caracteres');
    validInfo.hasMaxLen(req.body.name, 50, 'O nome deve conter no máximo 50 caracteres');
    validInfo.isEmail(req.body.email, 'E-mail é obrigatório o preenchimento', 'E-mail inválido');

    //Se os dados forem válidos
    if(!validInfo.isValid()) {
        console.log('Erro, dados inválidos');
        res.status(400).send(validInfo.errors()).end();
        return;
    }

    try {        
        await repository.create(req.body);
        res.status(201).send({
            message: `${req.body.name} cadastrado com sucesso!`
        });
    } catch(err) {
        res.status(500).send({
            message: 'Falha ao processar requisição'
        });
    }     
};

exports.put = async (req, res, next) => {
    try {
        await repository.update(req.params.id, req.body);
        res.status(200).send({
            message: 'Profissional atualizado com sucesso!'
        });
    } catch(err) {
        res.status(500).send({
            message: 'Falha ao processar requisição'
        });
    }      
};

exports.delete = async(req, res, next) => {
    try {
        await repository.delete(req.body.id);
        res.status(200).send({
            message: 'Profissional removido com sucesso!'
        })
    } catch(err) {
        res.status(500).send({
            message: 'Falha ao processar requisição'
        });
    }    
};