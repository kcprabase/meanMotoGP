const express = require("express");
const raceController = require("../controllers/races.controller");
const teamController = require("../controllers/teams.controller");
const router = express.Router();

router.route("/")
    .get(raceController.getAll)
    .post(raceController.addOne);
router.route("/:raceId")
    .get(raceController.getOne)
    .delete(raceController.deleteOne)
    .put(raceController.fullUpdate)
    .patch(raceController.partialUpdate);
router.route("/:raceId/teams")
    .get(teamController.getAll)
    .post(teamController.addOne);
router.route("/:raceId/teams/:teamId")
    .get(teamController.getOne)
    .delete(teamController.deleteOne)
    .put(teamController.fullUpdate)
    .patch(teamController.partialUpdate);

module.exports = router;
