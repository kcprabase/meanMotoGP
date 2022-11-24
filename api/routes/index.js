const express = require("express");
const router = express.Router();
const racesRoutes = require("./races.routes");
const usersRoutes = require("./users.routes");

router.use(process.env.RacesRoute, racesRoutes);
router.use(process.env.UsersRoute, usersRoutes);

module.exports = router;

