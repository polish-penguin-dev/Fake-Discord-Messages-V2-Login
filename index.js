/*
    Fake-Discord-Messages-V2-Login
*/

import { MongoClient } from "mongodb";
import express from "express";
import cors from "cors";
const app = express();

app.use(cors());

import { deploy } from "./bot/deploy.js";
import { bot } from "./bot/index.js";

await deploy();
bot();

// Create a single MongoClient instance for the entire application
const url = process.env.MONGO_URL;
const DBclient = new MongoClient(url);

// Verify route
app.get("/verify", async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(400).json({ error: "Token is required" });
    }

    try {
        await DBclient.connect();
        console.log("Connected to database!");

        const db = DBclient.db("FakeDiscordMessages");
        const collection = db.collection("Users");

        const user = await collection.findOne({ token: token });

        if (!user) {
            return res.status(404).json({ error: "Token not found" });
        }

        if (user.expires > new Date()) {
            await collection.updateOne(
                { token: token },
                { $unset: { expires: "" } }
            );

            return res.json({ message: "Token verified successfully" });
        } else {
            await collection.deleteOne({ token: token });

            return res.status(401).json({ error: "Token has expired" });
        }
    } catch (err) {
        console.log(err);
    }
});

// Identify route
app.get("/identify", async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.status(400).json({ error: "Token is required" });
    }

    try {
        await DBclient.connect();
        console.log("Connected to database!");

        const db = DBclient.db("FakeDiscordMessages");
        const collection = db.collection("Users");

        const user = await collection.findOne({ token: token });

        if (!user) {
            return res.status(404).json({ error: "Token not found" });
        }

        return res.json({ userId: user.id });
    } catch (err) {
        console.log(err);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
