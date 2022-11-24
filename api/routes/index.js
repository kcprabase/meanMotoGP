const express = require("express");
// const raceController = require("../controllers/races.controller");
// const teamController = require("../controllers/teams.controller");
const userController = require("../controllers/users.controller");
const router = express.Router();
const racesRoutes = require("./races.routes");

router.use("/races", racesRoutes);
// router.route("/races")
//     .get(raceController.getAll)
//     .post(raceController.addOne);
// router.route("/races/:raceId")
//     .get(raceController.getOne)
//     .delete(raceController.deleteOne)
//     .put(raceController.fullUpdate)
//     .patch(raceController.partialUpdate);
// router.route("/races/:raceId/teams")
//     .get(teamController.getAll)
//     .post(teamController.addOne);
// router.route("/races/:raceId/teams/:teamId")
//     .get(teamController.getOne)
//     .delete(teamController.deleteOne)
//     .put(teamController.fullUpdate)
//     .patch(teamController.partialUpdate);

router.route("/users/register")
    .post(userController.register);

router.route("/users/login")
    .post(userController.login);


module.exports = router;

