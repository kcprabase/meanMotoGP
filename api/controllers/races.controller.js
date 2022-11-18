const mongoose = require("mongoose");
const Race = mongoose.model(process.env.RaceModel);


const _log = (...log) => {
    console.log(log);
}

const _getDefaultResponse = (status, message) => {
    let response = {
        status: status || process.env.OkStatusCode,
        message: message || {}
    }
    return response;
}

const _sendResponse = (res, response) => {
    res.status(parseInt(response.status)).json(response.message);
}

const getAll = function (req, res) {
    const response = _getDefaultResponse(process.env.OkStatusCode);
    _readQueryParamsForGetAll(req, response)
        .then((params) => _queryAllRaces(params, response))
        .then((races) => _prepareRacesResponse(races, response))
        .catch(error => { _log(error); })
        .finally(() => { _sendResponse(res, response); });
}

const getOne = (req, res) => {
    const response = _getDefaultResponse(process.env.OkStatusCode);
    _getRaceById(req, response)
        .then(race => { response.message = race; })
        .catch(error => _log(error))
        .finally(() => _sendResponse(res, response));
}

const addOne = (req, res) => {
    let response = _getDefaultResponse(process.env.CreateSuccessStatusCode);
    _readBodyParamsForAddOne(req)
        .then(newRace => _runRaceCreateQuery(newRace, response))
        .catch(error => _log(error))
        .finally(() => _sendResponse(res, response));
};

const fullUpdate = (req, res) => {
    let response = _getDefaultResponse(process.env.NoContentSuccessStatusCode);
    _getRaceById(req, response)
        .then(race => _readBodyParamsForFullUpdate(req, race))
        .then(race => _runRaceUpdateQuery(race, response))
        .catch(error => _log(error))//need to handle error here.
        .finally(() => _sendResponse(res, response));
}

const partialUpdate = (req, res) => {
    let response = _getDefaultResponse(process.env.NoContentSuccessStatusCode);
    _getRaceById(req, response)
        .then(race => _readBodyParamsForPartialUpdate(req, race))
        .then(race => _runRaceUpdateQuery(race, response))
        .catch(error => _log(error))
        .finally(() => _sendResponse(res, response));
}

const deleteOne = (req, res) => {
    let response = _getDefaultResponse(process.env.NoContentSuccessStatusCode);
    _getRaceById(req, response)
        .then(race => _runRaceDeleteQuery(race, response))
        .catch(error => _log(error))
        .finally(() => _sendResponse(res, response));
}

const _readQueryParamsForGetAll = (req, response) => {
    return new Promise((resolve, reject) => {
        let offset = parseInt(req.query.offset || process.env.DefaultGetOffset, 10);
        let count = parseInt(req.query.count || process.env.DefaultGetCount, 10);
        if (count > parseInt(process.env.RacePageCountLimit)) {
            response.status = process.env.BadRequestStatusCode;
            response.message = process.env.RequestItemPerPageCountExceededMsg;
            reject(process.env.RequestItemPerPageCountExceededMsg);
        } else {
            resolve({ offset, count });
        }
    });
}

const _queryAllRaces = (params, response) => {
    return new Promise((resolve, reject) => {
        Race.find().skip(params.offset).limit(params.count).then((races) => {
            resolve(races);
        }).catch((error) => {
            response.status = process.env.InternalServerErrorStatusCode;
            response.message = process.env.ErrorWhileFetchingRaceMsg;
            reject(error);
        });
    });
}

const _prepareRacesResponse = (races, response) => {
    if (!races || races.length == 0) {
        response.status = process.env.ResourceNotFoundStatusCode;
        response.message = process.env.RaceNotFoundMsg;
    } else {
        response.status = process.env.OkStatusCode;
        response.message = races;
    }
}

const _readQueryParamForRaceId = (req, response) => {
    return new Promise((resolve, reject) => {
        const raceId = req.params.raceId;
        if (mongoose.isValidObjectId(raceId)) {
            resolve(raceId);
        } else {
            response.status = process.env.BadRequestStatusCode;
            response.message = process.env.InvalidRaceIdMsg
            reject(process.env.InvalidRaceIdMsg);
        }
    });
}

const _queryRaceById = (raceId, response) => {
    return new Promise((resolve, reject) => {
        Race.findById(raceId)
            .then((race) => {
                if (!race) {
                    response.status = process.env.ResourceNotFoundStatusCode;
                    response.message = process.env.RaceIdNotFound
                    reject(process.env.RaceIdNotFound);
                } else { resolve(race); }
            }).catch(err => {
                response.status = process.env.InternalServerErrorStatusCode;
                response.message = process.env.ErrorWhileFetchingRaceMsg
                reject(err);
            });
    });
}

const _getRaceById = (req, response) => {
    return new Promise((resolve, reject) => {
        _readQueryParamForRaceId(req, response)
            .then(raceId => _queryRaceById(raceId, response))
            .then(race => resolve(race))
            .catch((error) => reject(error));
    });
}

const _readBodyParamsForAddOne = (req) => {
    return new Promise((resolve, reject) => {
        const newRace = {
            circuitName: req.body.circuitName,
            season: req.body.season,
            winner: req.body.winner
        };
        resolve(newRace);
    });
}

const _runRaceCreateQuery = (newRace, response) => {
    return new Promise((resolve, reject) => {
        Race.create(newRace)
            .then(race => {
                response.status = process.env.CreateSuccessStatusCode;
                response.message = race;
                resolve(newRace);
            }).catch(err => {
                response.status = process.env.InternalServerErrorStatusCode;
                response.message = err;
                reject(err);
            });
    });
}

const _runRaceDeleteQuery = (race, response) => {
    return new Promise((resolve, reject) => {
        race.deleteOne()
            .then(deletedRace => resolve(deletedRace))
            .catch(error => {
                response.status = process.env.InternalServerErrorStatusCode;
                response.message = error;
                reject(error);
            });
    });
}

// const deleteOne = (req, res) => {
//     const raceId = req.params.raceId;
//     let response = {
//         status: process.env.NoContentSuccessStatusCode,
//         message: {}
//     };
//     if (mongoose.isValidObjectId(raceId)) {
//         Race.findByIdAndDelete(raceId).exec().then((race) => {
//             if (!race) {
//                 response = { status: process.env.ResourceNotFoundStatusCode, message: process.env.RaceIdNotFound };
//             } else {
//                 response = {
//                     status: process.env.NoContentSuccessStatusCode,
//                     message: race
//                 };
//             }
//         }).catch(err => {
//             response.status = process.env.InternalServerErrorStatusCode;
//             response.message = err;
//         }).finally(() => {
//             _sendResponse(res, response);
//         });
//     } else {
//         _sendResponse(res, { status: process.env.BadRequestStatusCode, message: process.env.InvalidRaceIdMsg });

//     }
// }


const _runRaceUpdateQuery = (race, response) => {
    return new Promise((resolve, reject) => {
        race.save()
            .then(updatedGame => resolve(updatedGame))
            .catch(err => {
                response.status = process.env.InternalServerErrorStatusCode;
                response.message = err;
                reject(err);
            });
    });
}

const _readBodyParamsForFullUpdate = (req, race) => {
    return new Promise((resolve, reject) => {
        race.circuitName = req.body.circuitName;
        race.season = req.body.season;
        race.winner = req.body.winner;
        resolve(race);
    });
}

const _readBodyParamsForPartialUpdate = (req, race) => {
    return new Promise((resolve, reject) => {
        if (req.body.circuitName) race.circuitName = req.body.circuitName;
        if (req.body.season) race.season = req.body.season;
        if (req.body.winner) race.winner = req.body.winner;
        resolve(race);
    });
}


module.exports = { getAll, getOne, addOne, deleteOne, fullUpdate, partialUpdate };