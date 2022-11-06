const mongoose = require("mongoose");
const Race = mongoose.model(process.env.RaceModel);

const getAll = (req, res) => {
    console.log("GETONE team controller");
    const raceId = req.params.raceId;
    Race.findById(raceId).select("teams").exec((err, race) => {
        console.log("found teams", races.teams.length, "for race", race.trackName);
        res.status(process.env.OkStatusCode).json(race.teams);
    });
};


const getOne = (req, res) => {
    console.log("GETONE team controller");
    const raceId = req.params.raceId;
    const teamId = req.params.teamId;
    Race.findById(raceId).select("teams").exec((err, race) => {
        console.log("found team", races.teams.id(teamId), "for race", race.trackName);
        res.status(process.env.OkStatusCode).json(race.teams.id(teamId));
    });
};

const _addTeam = (req, res, race) => {
    const newTeam = {
        riderName: req.body.riderName,
        teamName: req.body.teamName,
        rank: req.body.riderName
    };
    if (!race.teams) {
        race.teams = [];
    }
    race.teams.push(newTeam);
    race.save((err, updatedRace) => {
        const response = { status: process.env.OkStatusCode, message: [] };
        if (err) {
            response = { status: process.env.InternalServerErrorStatusCode, message: err };
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
        const response = { status: process.env.OkStatusCode, message: race };
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
    const teamId = req.params.teamId;
    const removeIndex = race.teams.findIndex(team => team._id.equals(teamId));
    race.teams.splice(removeIndex, 1);
    race.save(function (err, updatedRace) {
        const response = {
            status: 204,
            message: []
        };
        if (err) {
            response.status = 500;
            response.message = err;
        } else {
            response.status = 201;
            response.message = updatedRace.teams;
        }
        res.status(response.status).json(response.message);
    });
};

const deleteOne = (req, res) => {
    console.log("Delete one team Teams controller");
    const raceId = req.params.raceId;
    Race.findById(raceId).select("teams").exec((err, race) => {
        console.log("found race", race);
        const response = { status: process.env.OkStatusCode, message: race };
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
    const teamId = req.params.teamId;
    const teamToUpdateWith = {
        riderName: req.body.riderName,
        teamName: req.body.teamName,
        rank: req.body.riderName
    }
    const updateIndex = race.teams.findIndex(team => team._id.equals(teamId));
    race.teams[updateIndex] = { ...teams[updateIndex], ...teamToUpdateWith };

    race.save(function (err, updatedRace) {
        const response = {
            status: 204,
            message: []
        };
        if (err) {
            response.status = 500;
            response.message = err;
        } else {
            response.status = 201;
            response.message = updatedRace.teams;
        }
        res.status(response.status).json(response.message);
    });
};

const updateOne = (req, res) => {
    console.log("Update one team Teams controller");
    const raceId = req.params.raceId;
    Race.findById(raceId).select("teams").exec((err, race) => {
        console.log("found race", race);
        const response = { status: process.env.OkStatusCode, message: race };
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
    getOne, getAll, addOne, deleteOne, updateOne
}