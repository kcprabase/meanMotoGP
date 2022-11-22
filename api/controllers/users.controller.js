const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const utility = require("../utility")

const User = mongoose.model(process.env.UserModel);


const register = (req, res) => {
    console.log("reg body", req.body);
    // bcrypt.genSaltSync(10, (err, saltValue) => {
    //     if (err) { }
    //     else {
    bcrypt.hash(req.body.password, 10, (err, passwordHash) => {
        if (err) {
            // utility.sendResponse(res);
         } else {
            const newUser = {
                name: req.body.name,
                username: req.body.username,
                password: passwordHash
            };
            User.create(newUser, (err, user) => {
                let response = { status: process.env.CreateSuccessStatusCode, message: { name: user.name, username: user.username } };
                if (err) {
                    response = { status: process.env.InternalServerErrorStatusCode, message: err };
                }
                utility.sendResponse(res, response);
                // res.status(response.status).json(response.message);
            });
        }
    });
    //     }
    // })
};

const registerSync = (req, res) => {

    const passwordHash = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))

    const newUser = {
        name: req.body.name,
        username: req.body.username,
        password: passwordHash
    };
    User.create(newUser, (err, user) => {
        let response = { status: process.env.CreateSuccessStatusCode, message: { name: user.name, username: user.username } };
        if (err) {
            response = { status: process.env.InternalServerErrorStatusCode, message: err };
        }
        res.status(response.status).json(response.message);
    });
};

module.exports = { register }