const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
    riderName: String,
    teamName: String,
    rank: Number
});

const raceSchema = mongoose.Schema({
    raceTrackName: String,
    season: Number,
    winner: String,
    teams: [teamSchema]
});

mongoose.model(process.env.RaceModel, raceSchema, process.env.RaceModelCollection);