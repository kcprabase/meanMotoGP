const jwt = require("jsonwebtoken");
const utility = require("./utility");
const _methodsToAuthorize = ["POST", "PUT", "DELETE", "PATCH"];
const _urlToAllow = ["/api/users/register", "/api/users/login"];

const _authorize = (req) => {
    return new Promise((resolve, reject) => {
        if (_methodsToAuthorize.includes(req.method.toUpperCase()) && !_urlToAllow.includes(req.originalUrl.toLowerCase())) {
            const token = req.headers["authorization"].split(" ")[1];
            jwt.verify(token, process.env.JwtSecretKey, (err, verified) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(verified);
                }
            });
        }
        else {
            resolve();
        }
    })
}
module.exports = (req, res, next) => {
    let response = utility.getDefaultResponse(process.env.UnauthorizedStatusCode, "Unauthorized");
    _authorize(req)
        .then(verified => next())
        .catch(error => utility.sendResponse(res, response));
}