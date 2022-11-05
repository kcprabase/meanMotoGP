const express = require("express");
require("dotenv").config();
const app = express();


const server = app.listen(process.env.Port, () => {
    console.log(process.env.AppStartMsg, server.address().port);
});