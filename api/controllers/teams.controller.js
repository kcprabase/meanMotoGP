const mongoose = require("mongoose");
const Race = mongoose.model(process.env.RaceModel);


const _sendResponse = (res, response) => {
    res.status(parseInt(response.status)).json(response.message);
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


const _saveRace = (res, response, race) => {
    race.save((err, updatedRace) => {
        if (err) {
            response.status = process.env.InternalServerErrorStatusCode;
            response.message = err;
        } else {
            if (!response.status)
                response.status = process.env.CreateSuccessStatusCode;
            response.message = updatedRace.teams
        }
        console.log("st code", response);
        _sendResponse(res, response);
    });
}

const getAll = (req, res) => {
    const _getAllTeamsCallBack = (req, res, response, teams) => {
        response.message = teams;
        _sendResponse(res, response);
    }
    _findTeamsByRaceIdAndCallBack(req, res, _getAllTeamsCallBack);

};


const getOne = (req, res) => {
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
            _sendResponse(res, response);
        } else {
            _sendResponse(res, { status: process.env.BadRequestStatusCode, message: process.env.InvalidTeamIdMsg });
        }
    }

    _findTeamsByRaceIdAndCallBack(req, res, _getOneTeamCallBack);
};

const addOne = (req, res) => {
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