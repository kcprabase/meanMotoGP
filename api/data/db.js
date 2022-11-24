const mongoose = require("mongoose");
require("./races.model");
require("./users.model");

mongoose.connect(process.env.DbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on(process.env.MongooseConnectedEventName, () => {
    console.log(process.env.MongooseConnectedToMsg, process.env.DbName);
});

mongoose.connection.on(process.env.MongooseDisconnectedEventName, () => {
    console.log(process.env.MongooseDisconnectedMsg);
});

mongoose.connection.on(process.env.MongooseErrorEventName, (err) => {
    console.log(process.env.MongooseConnectionErrorMsg, err);
});

process.on(process.env.ProcessEventSIGINT, () => {
    mongoose.connection.close(() => {
        console.log(process.env.SigIntMsg);
        process.exit(0);
    });
});

process.on(process.env.ProcessEventSIGTERM, () => {
    mongoose.connection.close(() => {
        console.log(process.env.SigTermMsg);
        process.exit(0);
    });
});

process.on(process.env.ProcessEventSIGUSR2, () => {
    mongoose.connection.close(() => {
        console.log(process.env.SigUSR2Msg);
        process.kill(process.pid, process.env.ProcessEventSIGUSR2);
    });
});
