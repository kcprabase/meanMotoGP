const mongoose = require("mongoose");
require("./races.model");
require("./users.model");
mongoose.connect(process.env.DbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to ", process.env.DbName);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected");
});

mongoose.connection.on("error", (err) => {
    console.log("Mongoose connection error", err);
});

process.on("SIGINT", () => {
    mongoose.connection.close(() => {
        console.log(process.env.SigIntMsg);
        process.exit(0);
    });
});

process.on("SIGTERM", () => {
    mongoose.connection.close(() => {
        console.log(process.env.SigTermMsg);
        process.exit(0);
    });
});

process.on("SIGUSR2", () => {
    mongoose.connection.close(() => {
        console.log(process.env.SigUSR2Msg);
        process.kill(process.pid, "SIGUSR2");
    });
});
