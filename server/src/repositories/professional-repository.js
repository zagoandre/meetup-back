const mongoose = require('mongoose');
const Professional = mongoose.model('Professional');

exports.get = async() => {
    const res = await Professional.find({});
    return res;
}

exports.getByEmail = async(email) => {
    const res = await Professional.findOne({email: email});
    return res;
}

exports.getById = async(id) => {
    const res = await Professional.findById(id);
    return res;
}

exports.getByObj = async(professional) => {
    const objProfessional = JSON.parse(professional);
    const res = await Professional.find({$or:
                [{'name': { $regex: '*' + objProfessional.name +'*'} }]});
                console.log(res);
                // , {'email': `/${professional.email} /i`}, 
                // {'linkedin': `/${professional.linkedin} /i`}, {'github': `/${professional.github} /i`}
    return res;
}

exports.create = async(body) => {
    var professional = new Professional(body);
    await professional.save();
}

exports.update = async(id, data) => {
    await Professional
            .findByIdAndUpdate(id, {
                $set: {
                    name: data.name,
                    email: data.email,
                    linkedin: data.linkedin,
                    github: data.github
                }
            })   ;
}

exports.delete = async(id) => {
    await Professional.findByIdAndRemove(id);
}