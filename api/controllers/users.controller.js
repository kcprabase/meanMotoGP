const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const utility = require("../utility")
var jwt = require('jsonwebtoken');

const User = mongoose.model(process.env.UserModel);

const login = (req, res) => {
    let response = { status: process.env.OkStatusCode };
    _checkBodyParamsForLogin(req, response)
        .then(() => _findOneUserByUsername(req.body.username))
        .then(user => _comparePassword(req, user, response))
        .then(user => _createTokenResponse(user, response))
        .catch(error => utility.appLog(error))
        .finally(() => utility.sendResponse(res, response));
}

const register = (req, res) => {
    let response = { status: process.env.OkStatusCode };
    let newUser = {};
    _readBodyParamsForRegister(req, response, newUser)
        .then(newUser => _runPasswordHash(newUser, response))
        .then(newUser => _runAddUserQuery(newUser, response))
        .then(user => _createTokenResponse(user, response))
        .catch((error) => utility.appLog(error))
        .finally(() => utility.sendResponse(res, response));
};

const _readBodyParamsForRegister = (req, response, newUser) => {
    return new Promise((resolve, reject) => {
        if (!req.body || !req.body.name || !req.body.username || !req.body.password) {
            response.message = process.env.NotAllDataAvailableForRegister;
            response.status = process.env.BadRequestStatusCode;
            reject();
        } else {
            newUser.username = req.body.username;
            newUser.name = req.body.name;
            newUser.password = req.body.password;
            resolve(newUser);
        }
    });
}

const _runPasswordHash = (newUser, response) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(newUser.password, 10)
            .then((hash) => {
                newUser.password = hash;
                resolve(newUser)
            })
            .catch((error) => {
                response.status = process.env.InternalServerErrorStatusCode;
                response.message = error;
                reject();
            })
    });
}

const _runAddUserQuery = (newUser, response) => {
    return new Promise((resolve, reject) => {
        User.create(newUser).then(user => {
            if (!user) {
                response.status = process.env.InternalServerErrorStatusCode;
                response.message = process.env.CouldNotAddUserMsg;
                reject(process.env.CouldNotAddUserMsg);
            } else {
                resolve(user);
            }
        }).catch(error => {
            response.status = process.env.InternalServerErrorStatusCode;
            response.message = error;
            reject(error);
        });
    });
}

const _createTokenResponse = (user, response) => {
    const token = _getToken(user);
    response.message = { token: token };
}

const _checkBodyParamsForLogin = (req, response) => {
    return new Promise((resolve, reject) => {
        if (req.body.username && req.body.password) {
            resolve();
        } else {
            response.status = process.env.BadRequestStatusCode;
            response.message = process.env.Unauthorized;
            reject(process.env.Unauthorized);
        }
    });
}

const _findOneUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        User.findOne({ username: username })
            .then(user => {
                if (!user) {
                    response.status = process.env.UnauthorizedStatusCode;
                    response.message = process.env.Unauthorized;
                    reject(process.env.Unauthorized);
                } else {
                    resolve(user);
                }
            }).catch(error => {
                response.status = process.env.InternalServerErrorStatusCode;
                response.message = error;
                reject(error);
            });
    });
}

const _comparePassword = (req, user, response) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(req.body.password, user.password)
            .then((match) => {
                if (match) {
                    resolve(user);
                } else {
                    response.status = process.env.UnauthorizedStatusCode;
                    response.message = process.env.Unauthorized;
                    reject(process.env.Unauthorized);
                }
            }).catch(error => {
                utility.appLog(error);
                response.status = process.env.InternalServerErrorStatusCode;
                response.message = process.env.Unauthorized;
                reject(process.env.Unauthorized);
            });
    });
}

const _getToken = (user) => {
    return jwt.sign({ name: user.name }, process.env.JwtSecretKey, { expiresIn: 60 * 60 });
}

module.exports = { register, login }