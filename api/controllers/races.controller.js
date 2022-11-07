const mongoose = require("mongoose");
const Race = mongoose.model(process.env.RaceModel);

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
        Race.find().skip(offset).limit(count).exec((err, races) => {
            console.log("Found races", races.length);
            res.status(process.env.OkStatusCode).json(races);
        });
    }
}

const getOne = (req, res) => {
    const raceId = req.params.raceId;
    Race.findById(raceId).exec((err, race) => {
        let response = { status: process.env.OkStatusCode, message: race }
        if (err) {
            console.log("error while fetching race");
            response.status = process.env.InternalServerErrorStatusCode;
            response.message = err;
        }
        if (!race) {
            response.status = process.env.ResourceNotFoundStatusCode;
            response.message = "Race with given Id doesnot exist";
        }
        res.status(response.status).json(response.message);
    });
}

const addOne = (req, res) => {
    console.log("Race add one request");
    const newRace = {
        circuitName: req.body.circuitName,
        season: req.body.season,
        winner: req.body.winner,
    };
    Race.create(newRace, (err, race) => {
        let response = { status: 201, message: race };
        if (err) {
            console.log("error creating race");
            response = { status: process.env.InternalServerErrorStatusCode, message: err };
        }
        res.status(response.status).json(response.message);
    });
};

const deleteOne = function (req, res) {
    const raceId = req.params.raceId;
    Race.findByIdAndDelete(raceId).exec((err, deletedRace) => {
        let response = { status: process.env.CreateSuccessStatusCode, message: deletedRace };
        if (err) {
            console.log("Error finding race");
            response.status = process.env.InternalServerErrorStatusCode;
            response.message = err;
        } else if (!deletedRace) {
            console.log("Race id not found");
            response.status = process.env.ResourceNotFoundStatusCode;
            response.message = {
                "message": "Race ID not found"
            };
        } else {
            response.message = "Race deleted"
        }
        res.status(response.status).json(response.message);
    });
}


const udpateOne = function (req, res) {
    console.log("update called", req.body)
    const raceId = req.params.raceId;
    const raceToUdpateWith = {
        circuitName: req.body.circuitName,
        season: req.body.season,
        winner: req.body.winner,
    };
    Race.findByIdAndUpdate(raceId, raceToUdpateWith).exec((err, udpatedRace) => {
        let response = { status: process.env.NoContentSuccessStatusCode, message: udpatedRace };
        if (err) {
            console.log("Error finding race");
            response.status = process.env.InternalServerErrorStatusCode;
            response.message = err;
        } else if (!udpatedRace) {
            console.log("Race id not found");
            response.status = process.env.ResourceNotFoundStatusCode;
            response.message = {
                "message": "Race ID not found."
            };
        }
        console.log("update success ful", raceToUdpateWith, "and", udpatedRace);
        res.status(response.status).json(response.message);
    });
}

module.exports = { getAll, getOne, addOne, deleteOne, udpateOne };