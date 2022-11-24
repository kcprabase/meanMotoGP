const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
    riderName: { type: String, required: true },
    teamName: { type: String, required: true },
    rank: {
        type: Number,
        required: true,
        min: parseInt(process.env.TeamSchemaRankMin),
        max: parseInt(process.env.TeamSchemaRankMax)
    }
});

const raceSchema = mongoose.Schema({
    circuitName: { type: String, required: true },
    season: {
        type: Number,
        required: true,
        min: parseInt(process.env.RaceSchemaSeasonMin),
        max: parseInt(process.env.RaceSchemaSeasonMax)
    },
    winner: { type: String, required: false },
    teams: [teamSchema]
});

mongoose.model(process.env.RaceModel, raceSchema, process.env.RaceModelCollection);