const express = require("express");
const raceController = require("./controllers/races.controller");
const teamController = require("./controllers/teams.controller")
const router = express.Router();

router.route("/races")
    .get(raceController.getAll)
    .post(raceController.addOne);
router.route("/races/:raceId")
    .get(raceController.getOne)
    .delete(raceController.deleteOne)
    .put(raceController.udpateOne);
router.route("/races/:raceId/teams")
    .get(teamController.getAll)
    .post(teamController.addOne);
router.route("/races/:raceId/teams/:teamId")
    .get(teamController.getOne)
    .delete(teamController.deleteOne)
    .put(teamController.updateOne);

module.exports = router;

