import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import taskRoutes from "./routes/taskRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
  : "*";

app.use(helmet());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "10kb" }));

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

const DATABASE_STATES = ["desconectado", "conectado", "conectando", "desconectando"];

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    database: DATABASE_STATES[mongoose.connection.readyState] ?? "desconhecido",
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/tasks", taskRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
