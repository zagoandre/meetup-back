const mongoose = require('mongoose');
const User = mongoose.model('User');
const Validator = require('../validators/validator');
const repository = require('../repositories/user-repository');
const md5 = require('md5');
const authService = require('../services/auth-service');

exports.get = async(req, res, next) => {
    try {        
        const userExists = await getUserExists(req);
        if (!userExists) {
            return messageUserNotExists(res);
        } 

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
        const userExists = getUserExists(req);
        if (!userExists) {
            return messageUserNotExists(res);
        } 
        var data = await repository.getByEmail(req.params.email);         
        res.status(200).send(data);
    } catch(err) {
        res.status(500).send({
            message: 'Falha ao processar requisição'
        });
    }

}

exports.post = async (req, res, next) => {
    const userExists = getUserExists(req);
    if (!userExists) {
        return messageUserNotExists(res);
    } 

    let contract = new Validator();
    contract.hasMinLen(req.body.name, 3, 'O nome deve conter pelo menos 3 caracteres');
    contract.hasMaxLen(req.body.name, 50, 'O nome deve conter no máximo 50 caracteres');
    contract.isEmail(req.body.email, 'E-mail é obrigatório o preenchimento', 'E-mail inválido');

    //Se os dados forem válidos
    if(!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {        
        await repository.create({
            name: req.body.name,
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
            isAdmin: req.body.isAdmin
        });
        res.status(201).send({
            message: 'Usuário cadastrado com sucesso!'
        });
    } catch(err) {
        
        res.status(500).send({
            message: 'Falha ao processar requisição'
        });
    }     
};

exports.put = async (req, res, next) => {
    const userExists = getUserExists(req);
    if (!userExists) {
        return messageUserNotExists(res);
    } 

    try {
        await repository.update(req.params.id, 
            {
                name: req.body.name,
                email: req.body.email,
                password: md5(req.body.password + global.SALT_KEY),
                isAdmin: req.body.isAdmin
            });
        res.status(200).send({
            message: 'Usuário atualizado com sucesso!'
        });
    } catch(err) {
        res.status(500).send({
            message: 'Falha ao processar requisição'
        });
    }      
};

exports.delete = async(req, res, next) => {
    const userExists = getUserExists(req);
    if (!userExists) {
        return messageUserNotExists(res);
    } 
    try {
        await repository.delete(req.body.id);
        res.status(200).send({
            message: 'Usuário removido com sucesso!'
        })
    } catch(err) {
        res.status(500).send({
            message: 'Falha ao processar requisição'
        });
    }    
};

exports.authenticate = async (req, res, next) => {
    try {        
        let user = await repository.authenticate({
            email: req.body.email,
            password: md5(req.body.password + global.SALT_KEY),
        });

        if(!user) {
            const office = await repository.validEmailOffice(req.body.email);
            if (office) {
                try{
                    await authService.authorizeByOffice365(req.body);
                    user = {
                        email: office.email,
                        name: office.name
                    }
                } catch(err) {
                    console.log('Erro após verificar se existe no banco e no office:', err);
                    res.status(404).send({
                        "message": "Usuário ou Senha inválidos"
                    });
                    return;
                }
            } else {
                res.status(404).send({
                "message": "Usuário ou Senha inválidos"
                });
                return;
            }
            
        }
    
        const token = await authService.generateToken({email: user.email, name: user.name});

        res.status(201).send({
            token: token,
            data: {
                email: user.name,
                email: user.email
            }
        });
    } catch(err) {  
        res.status(500).send({
            message: 'Falha ao processar requisição'
        });
    }     
};

getUserExists = async (req) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    const userInfo = await authService.decodeToken(token);    
    
    return await repository.getByEmail(userInfo.email);         
}

messageUserNotExists = (res) => {
    res.status(404).send({
        "message": "Usuário ou Senha inválidos"
      });
      return;
}