const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.get = async() => {
    const res = await User.find({}, '_id name email password isAdmin');
    return res;
}

exports.getByEmail = async(email) => {
    const res = await User.findOne({email: email}, '_id name email password isAdmin');
    return res;
}

exports.create = async(body) => {
    var user = new User(body);
    await user.save();
}

exports.update = async(id, data) => {
    await User
            .findByIdAndUpdate(id, {
                $set: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    isAdmin: data.isAdmin
                }
            });
}

exports.delete = async(id) => {
    await User.findByIdAndRemove(id);
}

exports.authenticate = async(data) => {
    const res = await User.findOne({
            email: data.email, 
            password: data.password}, '_id name email password isAdmin');
    return res;
}

exports.validEmailOffice = async(email) => {
    const res = await User.findOne({
            "email": email}, '_id name email password isAdmin');
    return res;
}