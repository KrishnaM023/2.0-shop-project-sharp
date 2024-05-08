const User = require('../models/user');

exports.addUser = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const phoneNumber = req.body.number;

        const data = await User.create({name: name, email: email, phoneNumber: number});
        res.status(201).json({newUserDetail: data});
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}

exports.getUser = async(req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({allUsers: users});
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
}