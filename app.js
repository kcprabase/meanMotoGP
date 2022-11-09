const express = require("express");
require("dotenv").config();
require("./api/data/db");
const routes = require("./api/routes");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

app.use((req, res, next) => {
    console.log("REC_", req.method, req.url);
    next();
});
app.use("/api", (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use((err, req, res, next) => {
    console.error("ERR_", err);
    next();
});
app.use(process.env.ApiRoute, routes);

const server = app.listen(process.env.Port, () => {
    console.log(process.env.AppStartMsg, server.address().port);
});