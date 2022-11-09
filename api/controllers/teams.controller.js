const mongoose = require("mongoose");
const Race = mongoose.model(process.env.RaceModel);


const _sendResponse = (res, response) => {
    res.status(parseInt(response.status)).json(response.message);
};

const _findRaceByIdAndCallBack = (req, res, callBack) => {
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
                console.log("before call back ", race);
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
        console.log("Race to add team", race);
        const newTeam = {
            riderName: req.body.riderName,
            teamName: req.body.teamName,
            rank: req.body.rank
        };
        if (!race.teams) {
            race.teams = [];
        }
        race.teams.push(newTeam);
        race.save((err, updatedRace) => {
            response = { status: process.env.OkStatusCode, message: [] };
            if (err) {
                console.log("error here", err);
                response.status = process.env.InternalServerErrorStatusCode;
                response.message = err;
            } else {
                response.status = process.env.CreateSuccessStatusCode;
                response.message = updatedRace.teams
            }
            res.status(response.status).json(response.message);
        });
    };
    _findRaceByIdAndCallBack(req, res, _addTeam);
};

const _deleteTeam = function (req, res, race) {
    const response = {
        status: 204,
        message: []
    };
    const teamId = req.params.teamId;
    const removeIndex = race.teams.findIndex(team => team._id.equals(teamId));
    console.log("remove index is ", removeIndex);
    if (removeIndex >= 0) {
        race.teams.splice(removeIndex, 1);
        race.save(function (err, updatedRace) {
            if (err) {
                response.status = 500;
                response.message = err;
            } else {
                response.status = 201;
                response.message = updatedRace.teams;
            }
            res.status(response.status).json(response.message);
        });
    } else {
        response.status = process.env.ResourceNotFoundStatusCode;
        response.message = "Team with given id doesnot exist";
        res.status(response.status).json(response.message);
    }
};

const deleteOne = (req, res) => {
    console.log("Delete one team Teams controller");
    const raceId = req.params.raceId;
    Race.findById(raceId).select("teams").exec((err, race) => {
        console.log("found race", race);
        let response = { status: process.env.OkStatusCode, message: race };
        if (err) {
            console.log("error finding race");
            response = { status: process.env.InternalServerErrorStatusCode, message: err };
        } else if (!race) {
            console.log("Race with given Id not found");
            response = { status: process.env.ResourceNotFoundStatusCode, message: "Race with given Id not found" };
        }
        if (race) {
            _deleteTeam(req, res, race);
        } else {
            res.status(response.status).json(response.message);
        }
    });

};

const _updateTeam = function (req, res, race) {
    let response = {
        status: 201,
        message: []
    };
    const teamId = req.params.teamId;
    const teamToUpdateWith = {
        riderName: req.body.riderName,
        teamName: req.body.teamName,
        rank: req.body.rank
    }
    const updateIndex = race.teams.findIndex(team => team._id.equals(teamId));
    if (updateIndex >= 0) {
        race.teams[updateIndex].riderName = teamToUpdateWith.riderName;
        race.teams[updateIndex].teamName = teamToUpdateWith.teamName;
        race.teams[updateIndex].rank = teamToUpdateWith.rank;
        race.save(function (err, updatedRace) {
            if (err) {
                response.status = 500;
                response.message = err;
            } else {
                response.status = 201;
                response.message = updatedRace.teams;
            }
            res.status(response.status).json(response.message);
        });
    } else {
        response.status = process.env.ResourceNotFoundStatusCode;
        response.message = "Team with given id doesnot exist";
        res.status(response.status).json(response.message);
    }
};

const fullUpdate = (req, res) => {
    console.log("Update one team Teams controller");
    const raceId = req.params.raceId;
    Race.findById(raceId).select("teams").exec((err, race) => {
        console.log("found race", race);
        let response = { status: process.env.OkStatusCode, message: race };
        if (err) {
            console.log("error finding race");
            response = { status: process.env.InternalServerErrorStatusCode, message: err };
        } else if (!race) {
            console.log("Race with given Id not found");
            response = { status: process.env.ResourceNotFoundStatusCode, message: "Race with given Id not found" };
        }
        if (race) {
            _updateTeam(req, res, race);
        } else {
            res.status(response.status).json(response.message);
        }
    });

};

module.exports = {
    getOne, getAll, addOne, deleteOne, fullUpdate
}