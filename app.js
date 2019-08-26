/* eslint-disable no-nested-ternary */
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import logger from "morgan";
import bodyParser from "body-parser";
import config from "./config/index";
import { notFound, errorHandler } from "./middlewares/errorhandlers";
import traceLogger from "./logger/tracelogger";
import routes from "./routes";
// Mental Delemma

// initialize express
const app = express();

// for request
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Enable All CORS Requests

// connect to mongodb
// eslint-disable-next-line no-nested-ternary
// eslint-disable-next-line max-len

// const mongoURL = process.env.NODE_ENV === 'test' ? config.DB_TEST : process.env.NODE_ENV === 'production' ? config.DB_URL_PROD : config.MONGODB_DATABASE;
mongoose.connect(
    "mongodb://user100:olatunji200@ds123196.mlab.com:23196/auth",
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    },
    () => {
        process.stdout.write("connected to mongodb");
    }
);

app.get("/api", cors(), (req, res) => {
    res.json({ massage: "Welcome to skillclique Api" });
});

// Routes
app.use("/api/v1", cors(), routes);

app.use("*", notFound);
app.use(errorHandler);

process.on("unhandledRejection", reason => {
    traceLogger(reason);
});

process.on("uncaughtException", reason => {
    traceLogger(reason);
});

const PORT = process.env.PORT || 5678;
app.listen(PORT, () => {
    process.stdout.write(`app is listening on port ${PORT}`);
});

export default app;
