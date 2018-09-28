const jwtWeb = require('jsonwebtoken');
const rest = require('restler');

exports.generateToken = async(data) => {
    return jwtWeb.sign(data, global.SALT_KEY, {expiresIn: '1d'});
}

exports.decodeToken = async(token) => {
    var data = await jwtWeb.verify(token, global.SALT_KEY);
    return data;
}

exports.authorize = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(!token) {
        res.status(401).json({
            message: 'Acesso Restrito'
        });
    } else {
        jwtWeb.verify(token, global.SALT_KEY, function (error, decoded) {
            if(error) {
                res.status(401).json({
                    message: 'Token Inválido'
                });
            } else {
                next();
            }
        });
    }
}

exports.authorizeByOffice365 = async(login) => {
	let basic = Buffer.from(`${login.email}:${login.password}`).toString('base64')
	return new Promise((resolve, reject) => {
		rest.get("https://outlook.office365.com/api/v1.0/me/", {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				"Accept": "application/json",
				"Authorization": `Basic ${basic}`
			}
		}).on('complete', function (data, response) {
			if (response.statusCode == 200) {
                return resolve();
            }
			return reject();
		});
	});
}