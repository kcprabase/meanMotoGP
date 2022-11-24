const mongoose = require("mongoose");
const Race = mongoose.model(process.env.RaceModel);
const utility = require("../utility");
const { getRaceById } = require("./races.controller");


const _sendResponse = (res, response) => {
    res.status(parseInt(response.status)).json(response.message);
};

const addOne = (req, res) => {
    const response = utility.getDefaultResponse(process.env.CreateSuccessStatusCode);

    getRaceById(req, response)
        .then(race => _addTeamToRaceFromRequestBody(req, race))
        .then(race => _saveRace2(response, race))
        .then(savedRace => response.message = savedRace.teams[savedRace.teams.length - 1]) //this should have its own funtion
        .catch(error => utility.appLog(error))
        .finally(() => utility.sendResponse(res, response));
}

const getAll = (req, res) => {
    const response = utility.getDefaultResponse(process.env.OkStatusCode);

    getRaceById(req, response)
        .then(race => _getTeamListFromRace(race, response))
        .then(race => _sendTeamListResponse(race, response))
        .catch(error => utility.appLog(error))
        .finally(() => utility.sendResponse(res, response));
};

const getOne = (req, res) => {
    const response = utility.getDefaultResponse(process.env.OkStatusCode);
    getRaceById(req, response)
        .then(race => _getTeamListFromRace(race, response))
        .then(teamList => _getTeamByIdResponse(req, teamList, response))
        .catch(error => utility.appLog(error))
        .finally(() => utility.sendResponse(res, response));

    // const _getOneTeamCallBack = (req, res, response, teams) => {
    //     const teamId = req.params.teamId;
    //     if (mongoose.isValidObjectId(teamId)) {
    //         if (teams.id(teamId)) {
    //             response.status = process.env.OkStatusCode;
    //             response.message = teams.id(teamId);
    //         } else {
    //             response.status = process.env.ResourceNotFoundStatusCode;
    //             response.message = process.env.TeamIdNotFound;
    //         }
    //         _sendResponse(res, response);
    //     } else {
    //         _sendResponse(res, { status: process.env.BadRequestStatusCode, message: process.env.InvalidTeamIdMsg });
    //     }
    // }

    // _findTeamsByRaceIdAndCallBack(req, res, _getOneTeamCallBack);
};
const _readQueryParamForTeamId = (req, response) => {
    teamId = req.params.teamId;
    if (mongoose.isValidObjectId(teamId)) {
        return teamId;
    } else {
        response.status = process.env.BadRequestStatusCode;
        response.message = process.env.InvalidTeamIdMsg
        return null;
    }
}

const _getTeamById = (teams, teamId, response) => {
    utility.appLog(teams, teamId);
    if (teams.id(teamId)) {
        utility.appLog("found")
        response.status = process.env.OkStatusCode;
        response.message = teams.id(teamId);
    } else {
        utility.appLog("notofund")
        response.status = process.env.ResourceNotFoundStatusCode;
        response.message = process.env.TeamIdNotFound;
    }
}

const _getTeamByIdResponse = (req, teams, response) => {
    const teamId = _readQueryParamForTeamId(req, response);
    if (teamId) {
        _getTeamById(teams, teamId, response);
    }
}

const _sendTeamListResponse = (teams, response) => {
    response.message = teams;
}

const _getTeamListFromRace = (race, response) => {
    return new Promise((resolve, reject) => {
        if (race.teams && race.teams.length > 0) {
            resolve(race.teams);
        } else {
            response.status = process.env.ResourceNotFoundStatusCode;
            response.message = process.env.NoTeamsFoundMsg;
            reject(response.message);
        }
    });
}

const _findTeamsByRaceIdAndCallBack = (req, res, callBack) => {
    const _getTeams = (req, res, response, race) => {
        if (race.teams && race.teams.length > 0) {
            //CALLBACK
            callBack(req, res, response, race.teams);
            return;
        } else {
            response.status = process.env.ResourceNotFoundStatusCode;
            response.message = process.env.NoTeamsFoundMsg;
        }
    }

    _findRaceByIdAndCallBack(req, res, _getTeams);
}


const _addTeamToRaceFromRequestBody = (req, race) => {
    return new Promise((resolve, reject) => {
        const newTeam = {
            riderName: req.body.riderName,
            teamName: req.body.teamName,
            rank: req.body.rank
        };
        if (!race.teams) {
            race.teams = [];
        }
        race.teams.push(newTeam);
        resolve(race);
    });
};

const _saveRace2 = (response, race) => {
    return new Promise((resolve, reject) => {
        race.save()
            .then(savedRace => resolve(savedRace))
            .catch(error => {
                response.status = process.env.InternalServerErrorStatusCode;
                response.message = error;
                reject();
            });
    });
}

const _saveRace = (res, response, race) => {
    race.save((err, updatedRace) => {
        if (err) {
            response.status = process.env.InternalServerErrorStatusCode;
            response.message = err;
        } else {
            if (!response.status)
                response.status = process.env.CreateSuccessStatusCode;
            response.message = updatedRace.teams[updatedRace.teams.length - 1]
        }
        console.log("st code", response);
        _sendResponse(res, response);
    });
}

const _readBodyParamsForAddOne = (req, newTeam) => {
    return new Promise((resolve, reject) => {
        newTeam = {
            riderName: req.body.riderName,
            teamName: req.body.teamName,
            rank: req.body.rank
        };
        resolve(newTeam);
    });
}

const addOne2 = (req, res) => {
    const _addTeam = (req, res, response, race) => {
        const newTeam = {
            riderName: req.body.riderName,
            teamName: req.body.teamName,
            rank: req.body.rank
        };
        if (!race.teams) {
            race.teams = [];
        }
        race.teams.push(newTeam);
        response.status = process.env.CreateSuccessStatusCode;
        _saveRace(res, response, race);
    };
    _findRaceByIdAndCallBack(req, res, _addTeam);
};

const _findRaceByIdAndCallBack = (req, res, callBack) => {
    const raceId = req.params.raceId;
    if (mongoose.isValidObjectId(raceId)) {
        Race.findById(raceId).select(process.env.RaceTeamsSubDocumentName).exec((err, race) => {
            const response = { status: process.env.OkStatusCode, message: race };
            if (err) {
                response.status = process.env.InternalServerErrorStatusCode;
                response.message = err;
            }
            if (!race) {
                response.status = process.env.ResourceNotFoundStatusCode;
                response.message = process.env.RaceIdNotFound;
            } else {
                //CALLBACK
                callBack(req, res, response, race);
                return;
            }
            _sendResponse(res, response);
        });
    } else {
        _sendResponse(res, { status: process.env.BadRequestStatusCode, message: process.env.InvalidRaceIdMsg });
    }
}

const _findTeamByIdAndCallBack = (req, res, callBack) => {
    const _getTeamById = function (req, res, response, race) {
        const teamId = req.params.teamId;
        if (mongoose.isValidObjectId(teamId)) {
            const teamIndex = race.teams.findIndex(team => team._id.equals(teamId));
            if (teamIndex >= 0) {
                // race.teams.splice(teamIndex, 1);
                // response.status = process.env.NoContentSuccessStatusCode;
                // _saveRace(res, response, race);
                //CALLBACK
                callBack(req, res, response, race, teamIndex);
            } else {
                response.status = process.env.ResourceNotFoundStatusCode;
                response.message = process.env.TeamIdNotFound;
                _sendResponse(res, response);
            }
        } else {
            _sendResponse(res, { status: process.env.BadRequestStatusCode, message: process.env.InvalidTeamIdMsg });
        }
    };
    _findRaceByIdAndCallBack(req, res, _getTeamById);
}


const getAll2 = (req, res) => {
    const _getAllTeamsCallBack = (req, res, response, teams) => {
        response.message = teams;
        _sendResponse(res, response);
    }
    _findTeamsByRaceIdAndCallBack(req, res, _getAllTeamsCallBack);

};


const getOne2 = (req, res) => {
    utility.appLog("requesting team");
    const _getOneTeamCallBack = (req, res, response, teams) => {
        const teamId = req.params.teamId;
        if (mongoose.isValidObjectId(teamId)) {
            if (teams.id(teamId)) {
                response.status = process.env.OkStatusCode;
                response.message = teams.id(teamId);
            } else {
                response.status = process.env.ResourceNotFoundStatusCode;
                response.message = process.env.TeamIdNotFound;
            }
            utility.appLog("sending team", response.message);
            _sendResponse(res, response);
        } else {
            _sendResponse(res, { status: process.env.BadRequestStatusCode, message: process.env.InvalidTeamIdMsg });
        }
    }

    _findTeamsByRaceIdAndCallBack(req, res, _getOneTeamCallBack);
};

const deleteOne = (req, res) => {
    const _deleteTeam = function (req, res, response, race, teamIndex) {
        race.teams.splice(teamIndex, 1);
        response.status = process.env.NoContentSuccessStatusCode;
        _saveRace(res, response, race);
    };
    _findTeamByIdAndCallBack(req, res, _deleteTeam);
};

const _updateOneTeam = (req, res, response, race, updateIndex, updateCallBack) => {
    if (Object.keys(req.body).length > 0) {
        updateCallBack(req, race, updateIndex);
        _saveRace(res, response, race);
    } else {
        response.status = process.env.BadRequestStatusCode;
        response.message = process.env.RequestBodyNotFound;
        _sendResponse(res, response);
    }
};

const _updateTeamFull = (req, res, response, race, updateIndex) => {
    _updateOneTeam(req, res, response, race, updateIndex, (req, race, updateIndex) => {
        race.teams[updateIndex].riderName = req.body.riderName;
        race.teams[updateIndex].teamName = req.body.teamName;
        race.teams[updateIndex].rank = req.body.rank;
    });
};

const _updateTeamPartial = (req, res, response, race, updateIndex) => {
    _updateOneTeam(req, res, response, race, updateIndex, (req, race, updateIndex) => {
        if (req.body.riderName) race.teams[updateIndex].riderName = req.body.riderName
        if (req.body.teamName) race.teams[updateIndex].teamName = req.body.teamName;
        if (req.body.rank) race.teams[updateIndex].rank = req.body.rank;
    });
};

const fullUpdate = (req, res) => {
    _findTeamByIdAndCallBack(req, res, _updateTeamFull);
};

const partialUpdate = (req, res) => {
    _findTeamByIdAndCallBack(req, res, _updateTeamPartial);
};

module.exports = {
    getOne, getAll, addOne, deleteOne, fullUpdate, partialUpdate
}