import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

process.env.NODE_ENV = "test";
process.env.RATE_LIMIT_MAX = "2";
process.env.RATE_LIMIT_WINDOW_MS = "60000";

const { default: app } = await import("../src/app.js");

let mongo;

before(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

after(async () => {
  await mongoose.disconnect();
  if (mongo) {
    await mongo.stop();
  }
});

describe("Rate limit das rotas de tarefas", () => {
  it("bloqueia com 429 após exceder o limite configurado", async () => {
    const first = await request(app).get("/api/tasks").expect(200);
    assert.equal(first.headers["ratelimit-limit"], "2");
    assert.equal(first.headers["ratelimit-remaining"], "1");

    await request(app).get("/api/tasks").expect(200);

    const blocked = await request(app).get("/api/tasks").expect(429);

    assert.equal(
      blocked.body.error,
      "Muitas requisições. Tente novamente em alguns instantes."
    );
    assert.equal(blocked.headers["ratelimit-remaining"], "0");
    assert.ok(blocked.headers["retry-after"]);
  });

  it("não aplica o limite fora das rotas de tarefas", async () => {
    await request(app).get("/api/health").expect(200);
  });
});
