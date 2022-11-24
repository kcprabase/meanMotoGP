const express = require("express");
const userController = require("../controllers/users.controller");
const router = express.Router();

router.route(process.env.UsersRouteRegister)
    .post(userController.register);

router.route(process.env.UsersRouteLogin)
    .post(userController.login);


module.exports = router;

