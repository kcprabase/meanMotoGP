const mongoose = require("mongoose");
const Race = mongoose.model(process.env.RaceModel);


const _sendResponse = (res, response) => {
    res.status(parseInt(response.status)).json(response.message);
};

const _findRaceByIdAndCallBack = (req, res, callBack) => {
    console.log("params", req.params);
    const raceId = req.params.raceId;
    if (mongoose.isValidObjectId(raceId)) {
        Race.findById(raceId).select("teams").exec((err, race) => {
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
    // _findRaceByIdAndCallBack(req, res, _deleteTeam);
};

const _updateTeamFull = function (req, res, response, race, updateIndex) {
    console.log("here ", req.body);
    if (req.body) {
        const teamToUpdateWith = {
            riderName: req.body.riderName,
            teamName: req.body.teamName,
            rank: req.body.rank
        }
        race.teams[updateIndex].riderName = teamToUpdateWith.riderName;
        race.teams[updateIndex].teamName = teamToUpdateWith.teamName;
        race.teams[updateIndex].rank = teamToUpdateWith.rank;
        _saveRace(res, response, race);
    } else {
        response.status = process.env.BadRequestStatusCode;
        response.message = process.env.RequestBodyNotFound;
        _sendResponse(res, response);
    }

};

const fullUpdate = (req, res) => {
    _findTeamByIdAndCallBack(req, res, _updateTeamFull);

};

module.exports = {
    getOne, getAll, addOne, deleteOne, fullUpdate
}