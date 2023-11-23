/*
    Fake-Discord-Messages-V2-Login
*/

import { MongoClient } from "mongodb";
import express from "express";
const app = express();

import { deploy } from "./bot/deploy.js";
import { bot } from "./bot/index.js";

await deploy();
bot();