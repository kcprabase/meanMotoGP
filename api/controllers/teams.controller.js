const mongoose = require("mongoose");
const utility = require("../utility");
const { getRaceById } = require("./races.controller");

const addOne = (req, res) => {
    const response = utility.getDefaultResponse(process.env.CreateSuccessStatusCode);

    getRaceById(req, response)
        .then(race => _addTeamToRaceFromRequestBody(req, race))
        .then(race => _saveRace(response, race))
        .then(savedRace => _getLastSavedTeamResponse(savedRace, response))
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
};

const deleteOne = (req, res) => {
    const response = utility.getDefaultResponse(process.env.NoContentSuccessStatusCode);
    getRaceById(req, response)
        .then(race => _findTeamByIdAndDelete(req, race, response))
        .then(race => _saveRace(response, race))
        .catch(error => utility.appLog(error))
        .finally(() => utility.sendResponse(res, response));
};

const fullUpdate = (req, res) => {
    const response = utility.getDefaultResponse(process.env.NoContentSuccessStatusCode);
    getRaceById(req, response)
        .then(race => _getTeamByIdAndFullUpdate(req, race, response))
        .then(race => _saveRace(response, race))
        .catch(error => utility.appLog(error))
        .finally(() => utility.sendResponse(res, response));
};

const partialUpdate = (req, res) => {
    const response = utility.getDefaultResponse(process.env.NoContentSuccessStatusCode);
    getRaceById(req, response)
        .then(race => _getTeamByIdAndPartialUpdate(req, race, response))
        .then(race => _saveRace(response, race))
        .catch(error => utility.appLog(error))
        .finally(() => utility.sendResponse(res, response));
};

const _sendTeamListResponse = (teams, response) => {
    response.message = teams;
}

const _getLastSavedTeamResponse = (savedRace, response) => {
    response.message = savedRace.teams[savedRace.teams.length - 1];
}

const _getTeamById = (teams, teamId, response) => {
    if (teams.id(teamId)) {
        return teams.id(teamId);
    } else {
        response.status = process.env.ResourceNotFoundStatusCode;
        response.message = process.env.TeamIdNotFound;
        return null;
    }
}

const _getTeamByIdResponse = (req, teams, response) => {
    const teamId = _readQueryParamForTeamId(req, response);
    if (teamId) {
        const team = _getTeamById(teams, teamId, response);
        response.status = process.env.OkStatusCode;
        response.message = team;
    }
}

const _saveRace = (response, race) => {
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

const _getTeamByIdAndFullUpdate = (req, race, response) => {
    return new Promise((resolve, reject) => {
        const teamId = _readQueryParamForTeamId(req, response);
        if (race.teams) {
            const updateIndex = race.teams.findIndex(team => team._id.equals(teamId));
            race.teams[updateIndex].riderName = req.body.riderName;
            race.teams[updateIndex].teamName = req.body.teamName;
            race.teams[updateIndex].rank = req.body.rank;
            resolve(race);
        } else {
            response.status = process.env.ResourceNotFoundStatusCode;
            response.message = process.env.NoTeamsFoundMsg;
            reject(response.message);
        }
    });
}

const _getTeamByIdAndPartialUpdate = (req, race, response) => {
    return new Promise((resolve, reject) => {
        const teamId = _readQueryParamForTeamId(req, response);
        if (race.teams) {
            const updateIndex = race.teams.findIndex(team => team._id.equals(teamId));
            if (req.body.riderName) race.teams[updateIndex].riderName = req.body.riderName
            if (req.body.teamName) race.teams[updateIndex].teamName = req.body.teamName;
            if (req.body.rank) race.teams[updateIndex].rank = req.body.rank;
            resolve(race);
        } else {
            response.status = process.env.ResourceNotFoundStatusCode;
            response.message = process.env.NoTeamsFoundMsg;
            reject(response.message);
        }
    });
}

const _findTeamByIdAndDelete = (req, race, response) => {
    return new Promise((resolve, reject) => {
        const teamId = _readQueryParamForTeamId(req, response);
        if (race.teams) {
            const teamIndex = race.teams.findIndex(team => team._id.equals(teamId));
            race.teams.splice(teamIndex, 1);
            resolve(race);
        } else {
            response.status = process.env.ResourceNotFoundStatusCode;
            response.message = process.env.NoTeamsFoundMsg;
            reject(response.message);
        }
    })
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

module.exports = {
    getOne, getAll, addOne, deleteOne, fullUpdate, partialUpdate
}