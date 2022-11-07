const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
    riderName: { type: String, required: true },
    teamName: { type: String, required: true },
    rank: { type: Number, required: true, min: 1, max: 30 }
});

const raceSchema = mongoose.Schema({
    circuitName: { type: String, required: true },
    season: { type: Number, required: true, min: 2000, max: 2022 },
    winner: { type: String, required: false },
    teams: [teamSchema]
});

mongoose.model(process.env.RaceModel, raceSchema, process.env.RaceModelCollection);