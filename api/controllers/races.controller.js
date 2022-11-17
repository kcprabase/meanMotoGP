const { response } = require("express");
const mongoose = require("mongoose");
const Race = mongoose.model(process.env.RaceModel);

const _sendResponse = (res, response) => {
    res.status(parseInt(response.status)).json(response.message);
}

const _createResponse = (status, message) => {
    return { status, message };
}


const _findRaceByIdAndCallBack2 = (req) => {
    return new Promise((resolve, reject) => {
        const raceId = req.params.raceId;
        if (mongoose.isValidObjectId(raceId)) {
            Race.findById(raceId).exec().then((race) => {
                if (!race) {
                    reject({ status: process.env.ResourceNotFoundStatusCode, message: process.env.RaceIdNotFound });
                } else { resolve(race); }
            }).catch(err => { reject(err); });
        } else {
            // _sendResponse(res, { status: process.env.BadRequestStatusCode, message: process.env.InvalidRaceIdMsg });
            reject({ status: process.env.BadRequestStatusCode, message: process.env.InvalidRaceIdMsg });
        }
    });
}

const _findRaceByIdAndCallBack = (req, res, callBack) => {
    const raceId = req.params.raceId;
    if (mongoose.isValidObjectId(raceId)) {
        Race.findById(raceId).exec((err, race) => {
            callBack(req, res, err, race);
        });
    } else {
        _sendResponse(res, { status: process.env.BadRequestStatusCode, message: process.env.InvalidRaceIdMsg });
    }
}

const getAll = (req, res) => {
    let offset = 0;
    let count = 5;
    if (req.query) {
        if (req.query.offset) {
            offset = parseInt(req.query.offset, 10);
        }
        if (req.query.count) {
            count = parseInt(req.query.count, 10);
        }
        if (count > parseInt(process.env.RacePageCountLimit)) {
            _sendResponse(res, { status: process.env.BadRequestStatusCode, message: process.env.RequestItemPerPageCountExceededMsg });
            return;
        }
        let response = { status: process.env.OkStatusCode, message: {} };
        Race.find().skip(offset).limit(count).exec().then(races => {
            // if (!races || races.length == 0) {
            //     response.status = process.env.ResourceNotFoundStatusCode;
            //     response.message = process.env.RaceNotFoundMsg;
            // } else {
            response = { status: process.env.OkStatusCode, message: races };
            // }
        }).catch(err => {
            console.log(err);
            response.status = process.env.InternalServerErrorStatusCode;
            response.message = process.env.ErrorWhileFetchingRaceMsg;
        }).finally(() => {
            _sendResponse(res, response);
        });
    }
}

// const getOne = (req, res) => {
//     const _getOne = (req, res, err, race) => {
//         let response = { status: process.env.OkStatusCode, message: race }
//         if (err) {
//             response.status = process.env.InternalServerErrorStatusCode;
//             response.message = err;
//         }
//         if (!race) {
//             response.status = process.env.ResourceNotFoundStatusCode;
//             response.message = process.env.RaceWithIdDoesnotExist;
//         }
//         _sendResponse(res, response);
//     }
//     _findRaceByIdAndCallBack(req, res, _getOne);
// }
const getOne = (req, res) => {
    let response = { status: process.env.OkStatusCode, message: {} }
    _findRaceByIdAndCallBack2(req).then(race => {
        response.message = race;
    }).catch(err => {
        console.log(err);
        if (err.status) {
            response = err;
        } else {
            response.status = process.env.InternalServerErrorStatusCode;
            response.message = err;
        }
    }).finally(() => {
        _sendResponse(res, response);
    });
}

const addOne = (req, res) => {
    const newRace = {
        circuitName: req.body.circuitName,
        season: req.body.season,
        winner: req.body.winner
    };
    Race.create(newRace, (err, race) => {
        let response = { status: process.env.CreateSuccessStatusCode, message: race };
        if (err) {
            response = { status: process.env.InternalServerErrorStatusCode, message: err };
        }
        res.status(response.status).json(response.message);
    });
};

const deleteOne = (req, res) => {
    const raceId = req.params.raceId;
    let response = {
        status: process.env.NoContentSuccessStatusCode,
        message: {}
    };
    if (mongoose.isValidObjectId(raceId)) {
        Race.findByIdAndDelete(raceId).exec().then((race) => {
            console.log("race is: ", race);
            if (!race) {
                response = { status: process.env.ResourceNotFoundStatusCode, message: process.env.RaceIdNotFound };
            } else {
                response = {
                    status: process.env.NoContentSuccessStatusCode,
                    message: race
                };
            }
        }).catch(err => {
            response.status = process.env.InternalServerErrorStatusCode;
            response.message = err;
        }).finally(() => {
            _sendResponse(res, response);
        });
    } else {
        _sendResponse(res, { status: process.env.BadRequestStatusCode, message: process.env.InvalidRaceIdMsg });

    }
}

const _updateOneCallBack = (req, res, err, race, callBack) => {
    let response = {
        status: process.env.NoContentSuccessStatusCode,
        message: race
    };
    if (err) {
        response.status = process.env.InternalServerErrorStatusCode;
        response.message = err;
    }
    if (!race) {
        response.status = process.env.ResourceNotFoundStatusCode;
        response.message = process.env.RaceIdNotFound;
    }
    if (response.status !== process.env.NoContentSuccessStatusCode) {
        _sendResponse(res, response);
    } else {
        callBack(req, race);
        race.save((err, updatedGame) => {
            response.message = updatedGame;
            if (err) {
                response.status = process.env.InternalServerErrorStatusCode;
                response.message = err;
            }
            _sendResponse(res, response);
        });
    }
}

const _fullUpdateOneCallBack = (req, res, err, race) => {
    const _setFullUpdateObject = (req, race) => {
        race.circuitName = req.body.circuitName;
        race.season = req.body.season;
        race.winner = req.body.winner;
    }
    _updateOneCallBack(req, res, err, race, _setFullUpdateObject);
}

const _updateOneCallBack2 = (req, res, race) => {
    let response = {
        status: process.env.NoContentSuccessStatusCode,
        message: {}
    };
    race.save().then(updatedGame => {
        console.log("update success");
        response.message = updatedGame;
    }).catch(err => {
        console.log("update fail");
        response.status = process.env.InternalServerErrorStatusCode;
        response.message = err;
    }).finally(() => {
        _sendResponse(res, response);
    });
}

const _fullUpdateOneCallBack2 = (req, res, race) => {
    race.circuitName = req.body.circuitName;
    race.season = req.body.season;
    race.winner = req.body.winner;

    _updateOneCallBack2(req, res, race);
}

const fullUpdate = (req, resp) => {
    let response = _createResponse(process.env.NoContentSuccessStatusCode, {});
    _findRaceByIdAndCallBack2(req).then(race => {
        _fullUpdateOneCallBack2(req, resp, race);
    }).catch(err => {
        console.log("race not found", err)
        response = err;
        _sendResponse(resp, response);
    });
}

const _partialUpdateOneCallBack = (req, res, err, race) => {
    const _setPartialUpdateObject = (req, race) => {
        if (req.body.circuitName) race.circuitName = req.body.circuitName;
        if (req.body.season) race.season = req.body.season;
        if (req.body.winner) race.winner = req.body.winner;
    }
    _updateOneCallBack(req, res, err, race, _setPartialUpdateObject);
}

const _partialUpdateOneCallBack2 = (req, res, race) => {
    if (req.body.circuitName) race.circuitName = req.body.circuitName;
    if (req.body.season) race.season = req.body.season;
    if (req.body.winner) race.winner = req.body.winner;
    _updateOneCallBack2(req, res, race);
}

const partialUpdate = (req, res) => {
    // _findRaceByIdAndCallBack(req, res, _partialUpdateOneCallBack);
    let response = _createResponse(process.env.NoContentSuccessStatusCode, {});
    _findRaceByIdAndCallBack2(req).then(race => {
        _partialUpdateOneCallBack2(req, res, race);
    }).catch(err => {
        console.log("race not found", err)
        response = err;
        _sendResponse(resp, response);
    });
}

module.exports = { getAll, getOne, addOne, deleteOne, fullUpdate, partialUpdate };