const express = require("express");
// const raceController = require("../controllers/races.controller");
// const teamController = require("../controllers/teams.controller");
// const userController = require("../controllers/users.controller");
const router = express.Router();
const racesRoutes = require("./races.routes");
const usersRoutes = require("./users.routes");

router.use("/races", racesRoutes);
router.use("/users", usersRoutes);

module.exports = router;

