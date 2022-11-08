const mongoose = require("mongoose");
const Race = mongoose.model(process.env.RaceModel);

const getAll = (req, res) => {
    console.log("GET all team controller");
    const raceId = req.params.raceId;
    Race.findById(raceId).select("teams").exec((err, race) => {
        console.log("found teams", race.teams.length, "for race", race.circuitName);
        res.status(process.env.OkStatusCode).json(race.teams);
    });
};


const getOne = (req, res) => {
    console.log("GET ONE team controller");
    const raceId = req.params.raceId;
    const teamId = req.params.teamId;
    console.log("raceid", raceId, "teamId", teamId);
    Race.findById(raceId).select("teams").exec((err, race) => {
        const response = { status: process.env.OkStatusCode, message: race };
        if (err) {
            response.status = process.env.InternalServerErrorStatusCode;
            response.message = err;
        } else if (!race) {
            response.status = process.env.ResourceNotFoundStatusCode;
            response.message = "Race do not exist for given RaceId."
        } else if (race.teams && race.teams.id(teamId)) {
            response.status = process.env.OkStatusCode;
            response.message = race.teams.id(teamId);
        } else {
            response.status = process.env.ResourceNotFoundStatusCode;
            response.message = "Team do not exist for given TeamId."
        }
        // console.log("found team.", race.teams.id(teamId), "for race", race);
        res.status(response.status).json(response.message);
    });
};

const _addTeam = (req, res, race) => {
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
        const response = { status: process.env.OkStatusCode, message: [] };
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

const addOne = (req, res) => {
    console.log("Add one team Teams controller");
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
            _addTeam(req, res, race);
        } else {
            res.status(response.status).json(response.message);
        }
    });

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