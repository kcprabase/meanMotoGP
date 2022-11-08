const { response } = require("express");
const mongoose = require("mongoose");
const Race = mongoose.model(process.env.RaceModel);

const _sendResponse = (res, response) => {
    res.status(parseInt(response.status)).json(response.message);
}


const _findRaceByIdAndCallBack = (req, res, callBack) => {
    const raceId = req.params.raceId;
    if (mongoose.isValidObjectId(raceId)) {
        Race.findById(raceId).exec((err, race) => {
            callBack(req, res, err, race);
        });
    } else {
        _sendResponse(res, { status: parseInt(process.env.BadRequestStatusCode), message: process.env.InvalidRaceIdMsg });
    }
}

const _checkRaceIdValidityAndExecuteTask = (req, res, func) => {
    const raceId = req.params.raceId;
    if (mongoose.isValidObjectId(raceId)) {
        func(req, res, raceId);
    } else {
        _sendResponse(res, { status: parseInt(process.env.BadRequestStatusCode), message: process.env.InvalidRaceIdMsg });
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
            _sendResponse(res, { status: parseInt(process.env.BadRequestStatusCode), message: process.env.RequestItemPerPageCountExceededMsg });
            return;
        }
        Race.find().skip(offset).limit(count).exec((err, races) => {
            const response = { status: process.env.OkStatusCode, message: races };
            if (err) {
                response.status = process.env.InternalServerErrorStatusCode;
                response.message = process.env.ErrorWhileFetchingRaceMsg;
            }
            if (!races) {
                response.status = process.env.ResourceNotFoundStatusCode;
                response.message = process.env.RaceNotFoundMsg;
            }
            _sendResponse(res, response);
        });
    }
}

const _getOne = (req, res, err, race) => {
    let response = { status: process.env.OkStatusCode, message: race }
    if (err) {
        response.status = process.env.InternalServerErrorStatusCode;
        response.message = err;
    }
    if (!race) {
        response.status = process.env.ResourceNotFoundStatusCode;
        response.message = process.env.RaceWithIdDoesnotExist;
    }
    _sendResponse(res, response);
    // Race.findById(raceId).exec((err, race) => {
    //     let response = { status: process.env.OkStatusCode, message: race }
    //     if (err) {
    //         response.status = process.env.InternalServerErrorStatusCode;
    //         response.message = err;
    //     }
    //     if (!race) {
    //         response.status = process.env.ResourceNotFoundStatusCode;
    //         response.message = process.env.RaceWithIdDoesnotExist;
    //     }
    //     _sendResponse(res, response);
    // });
}

const getOne = (req, res) => {
    _findRaceByIdAndCallBack(req, res, _getOne);
    // _checkRaceIdValidityAndExecuteTask(req, res, _getOne);
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

const _deleteOne = (req, res, raceId) => {
    Race.findByIdAndDelete(raceId).exec((err, deletedRace) => {
        let response = { status: process.env.NoContentSuccessStatusCode, message: deletedRace };
        if (err) {
            response.status = process.env.InternalServerErrorStatusCode;
            response.message = err;
        } else if (!deletedRace) {
            response.status = process.env.ResourceNotFoundStatusCode;
            response.message = process.env.RaceIdNotFound;
        }
        _sendResponse(res, response);
    });
}

const deleteOne = (req, res) => {
    _checkRaceIdValidityAndExecuteTask(req, res, _deleteOne);
}

const fullUpdate = (req, res,) => {
    const raceId = req.params.raceId;
    if (mongoose.isValidObjectId(raceId)) {
        Race.findById(raceId).exec((err, race) => {
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
                race.circuitName = req.body.circuitName;
                race.season = req.body.season;
                race.winner = req.body.winner;
                race.save((err, updatedGame) => {
                    response.message = updatedGame;
                    if (err) {
                        response.status = process.env.InternalServerErrorStatusCode;
                        response.message = err;
                    }
                    _sendResponse(res, response);
                });
            }
        });
    } else {
        _sendResponse(res, { status: parseInt(process.env.BadRequestStatusCode), message: process.env.InvalidRaceIdMsg });
    }
}

const partialUpdate = (req, res) => {
    const raceId = req.params.raceId;
    if (mongoose.isValidObjectId(raceId)) {
        Race.findById(raceId).exec((err, race) => {
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
                if (req.body.circuitName) race.circuitName = req.body.circuitName;
                if (req.body.season) race.season = req.body.season;
                if (req.body.winner) race.winner = req.body.winner;
                race.save((err, updatedGame) => {
                    if (err) {
                        response.status = process.env.InternalServerErrorStatusCode;
                        response.message = err;
                    }
                    _sendResponse(res, response);
                });
            }
        });
    } else {
        _sendResponse(res, { status: parseInt(process.env.BadRequestStatusCode), message: process.env.InvalidRaceIdMsg });
    }
}

module.exports = { getAll, getOne, addOne, deleteOne, fullUpdate, partialUpdate };