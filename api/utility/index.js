

module.exports.sendResponse = (res, response) => {
    res.status(parseInt(response.status)).json(response.message);
}

module.exports.appLog = (...log) => {
    console.log(log);
}

module.exports.getDefaultResponse = (status, message) => {
    let response = {
        status: status || process.env.OkStatusCode,
        message: message || {}
    }
    return response;
}