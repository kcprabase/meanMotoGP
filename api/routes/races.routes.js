const express = require("express");
const raceController = require("../controllers/races.controller");
const teamController = require("../controllers/teams.controller");
const router = express.Router();

router.route(process.env.RacesRouteMain)
    .get(raceController.getAll)
    .post(raceController.addOne);
router.route(process.env.RacesRouteRaceId)
    .get(raceController.getOne)
    .delete(raceController.deleteOne)
    .put(raceController.fullUpdate)
    .patch(raceController.partialUpdate);
router.route(process.env.RacesRouteRaceIdTeams)
    .get(teamController.getAll)
    .post(teamController.addOne);
router.route(process.env.RacesRouteRaceIdTeamsTeamId)
    .get(teamController.getOne)
    .delete(teamController.deleteOne)
    .put(teamController.fullUpdate)
    .patch(teamController.partialUpdate);

module.exports = router;
