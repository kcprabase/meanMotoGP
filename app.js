const express = require("express");
require("dotenv").config();
const app = express();

app.use((req, res, next) => {
    console.log("REC_", req.method, req.url);
    next();
});
app.use((err, req, res, next) => {
    console.error("ERR_", err);
    next();
});
app.get("/", (req, res) => {
    res.send("MEAN MotoGP");
});


const server = app.listen(process.env.Port, () => {
    console.log(process.env.AppStartMsg, server.address().port);
});