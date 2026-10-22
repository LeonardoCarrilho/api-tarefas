import "dotenv/config";
import app from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/db.js";

const PORT = Number(process.env.PORT) || 3000;

async function start() {
  try {
    await connectDatabase();

    const server = app.listen(PORT, () => {
      console.log(`API disponível em http://localhost:${PORT}/api/tasks`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });

    const shutdown = (signal) => {
      console.log(`\n${signal} recebido. Encerrando o servidor...`);
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Falha ao iniciar a API:", error.message);
    process.exit(1);
  }
}

process.on("unhandledRejection", (error) => {
  console.error("Promise rejeitada sem tratamento:", error);
});

start();
