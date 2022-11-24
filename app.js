const express = require("express");
require("dotenv").config();
require("./api/data/db");
const routes = require("./api/routes");
const authorize = require("./api/auth");
const utility = require("./api/utility");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json())

app.use((req, res, next) => {
    utility.appLog("REC", req.method, req.url);
    next();
});

app.use(process.env.ApiRoute, (req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.AllowedOrigin);
    res.header('Access-Control-Allow-Headers', process.env.AllowedHeaders);
    res.header('Access-Control-Allow-Methods', process.env.AllowedMethods);
    next();
});

app.use(process.env.ApiRoute, authorize, routes);

const server = app.listen(process.env.Port, () => {
    console.log(process.env.AppStartMsg, server.address().port);
});