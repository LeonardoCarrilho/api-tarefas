import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import taskRoutes from "./routes/taskRoutes.js";
import { openApiDocument } from "./docs/openapi.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
import { taskRateLimiter } from "./middlewares/rateLimit.js";

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
  : "*";

// A UI do Swagger usa scripts e estilos inline; o restante da API continua restrito.
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        fontSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
      },
    },
  })
);
app.use(
  cors({
    origin: allowedOrigins,
    exposedHeaders: [
      "RateLimit",
      "RateLimit-Limit",
      "RateLimit-Policy",
      "RateLimit-Remaining",
      "RateLimit-Reset",
      "Retry-After",
    ],
  })
);
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

app.use("/api/tasks", taskRateLimiter, taskRoutes);

app.get("/api/docs.json", (_req, res) => res.json(openApiDocument));

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, {
    customSiteTitle: "API de Tarefas — Documentação",
  })
);

app.use(notFound);
app.use(errorHandler);

export default app;
