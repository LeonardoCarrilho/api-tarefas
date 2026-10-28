import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../src/app.js";
const mongo = await MongoMemoryServer.create();
await mongoose.connect(mongo.getUri());
const server = app.listen(4173,"127.0.0.1");
process.on("SIGTERM", async () => { server.close(); await mongoose.disconnect(); await mongo.stop(); process.exit(0); });
