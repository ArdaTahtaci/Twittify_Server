import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors"
import dotenv from "dotenv";
import { userRoutes } from "./routes/userRoutes.js"
import { tweetRoutes } from "./routes/tweetRoutes.js";

dotenv.config();


const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors())

app.get("/", (req, res) => {
    res.json({
        author: "Arda",
        message: "Server calisiyor"
    });
});

app.use("/users", userRoutes)
app.use("/tweets", tweetRoutes)


const PORT = process.env.PORT || 5000;

const CONNECTION_URL = process.env.CONNECTION_URL;


mongoose.set("strictQuery", false);
mongoose.connect(CONNECTION_URL).then(() => {
    app.listen(PORT, () => {
        console.log("server started on port 5000");
    })
}).catch((err) => {
    console.log(err);
});

