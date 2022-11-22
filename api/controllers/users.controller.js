const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const utility = require("../utility")
var jwt = require('jsonwebtoken');

const User = mongoose.model(process.env.UserModel);


const register = (req, res) => {
    let response = { status: process.env.OkStatusCode };
    bcrypt.hash(req.body.password, 10, (err, passwordHash) => {
        if (err) {
            response.status = process.env.InternalServerErrorStatusCode;
            response.message = err;
            utility.sendResponse(res, response);
        } else {
            const newUser = {
                name: req.body.name,
                username: req.body.username,
                password: passwordHash
            };
            User.create(newUser, (err, user) => {
                if (err) {
                    response = { status: process.env.InternalServerErrorStatusCode, message: err };
                } else {
                    const token = _getToken(user);
                    response.message = { token: token };
                }
                utility.sendResponse(res, response);
            });
        }
    });
};

const login = (req, res) => {
    let response = { status: process.env.OkStatusCode };
    (new Promise((resolve, reject) => {
        User.findOne({ username: req.body.username })
            .then(user => {
                if (!user) {
                    utility.appLog("user not found. go away");
                    response.status = process.env.UnauthorizedStatusCode;
                    response.message = "Unauthorized"
                    reject();
                } else {
                    resolve(user);
                }
            }).catch(error => {
                utility.appLog("error is ", error);
                response.status = process.env.InternalServerErrorStatusCode;
                response.message = error;
                reject(error);
            })
    }))
        .then(user => {
            return new Promise((resolve, reject) => {
                bcrypt.compare(req.body.password, user.password).then((match) => {
                    if (match) {
                        const token = _getToken(user);
                        response.message = { token: token }
                    } else {
                        //password dont match
                        response.status = process.env.UnauthorizedStatusCode;
                        response.message = "Unauthorized"
                    }
                    resolve();
                }).catch(error => {
                    //error while compaing password
                    response.status = process.env.InternalServerErrorStatusCode;
                    response.message = "Error occured"
                    reject(error);
                });
            })
        })
        .catch(error => utility.appLog(error))
        .finally(() => utility.sendResponse(res, response));
}

const _getToken = (user) => {
    return jwt.sign({ name: user.name }, process.env.JwtSecretKey, { expiresIn: 60 * 60 });
}

module.exports = { register, login }