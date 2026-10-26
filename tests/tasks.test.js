import { after, before, beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import Task from "../src/models/Task.js";

process.env.NODE_ENV = "test";

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

beforeEach(async () => {
  await Task.deleteMany({});
});

describe("API de Tarefas", () => {
  it("retorna o health check com o banco conectado", async () => {
    const response = await request(app).get("/api/health").expect(200);

    assert.equal(response.body.status, "ok");
    assert.equal(response.body.database, "conectado");
    assert.equal(typeof response.body.uptime, "number");
    assert.ok(response.body.timestamp);
  });

  it("cria uma tarefa com os valores padrão", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({ title: "Estudar testes automatizados" })
      .expect(201);

    assert.equal(response.body.data.title, "Estudar testes automatizados");
    assert.equal(response.body.data.status, "pendente");
    assert.equal(response.body.data.priority, "media");
    assert.ok(response.body.data.id);
    assert.equal(await Task.countDocuments(), 1);
  });

  it("rejeita uma tarefa com título inválido", async () => {
    const response = await request(app)
      .post("/api/tasks")
      .send({ title: "ab" })
      .expect(400);

    assert.equal(response.body.error, "Dados inválidos.");
    assert.equal(response.body.details[0].field, "title");
  });

  it("filtra, busca e pagina tarefas", async () => {
    await Task.create([
      { title: "Revisar portfólio", status: "pendente", priority: "alta" },
      { title: "Publicar API", status: "concluida", priority: "alta" },
      { title: "Estudar MongoDB", status: "em_andamento", priority: "baixa" },
    ]);

    const byStatus = await request(app)
      .get("/api/tasks?status=pendente")
      .expect(200);
    assert.equal(byStatus.body.meta.total, 1);
    assert.equal(byStatus.body.data[0].title, "Revisar portfólio");

    const bySearch = await request(app)
      .get("/api/tasks?search=mongo")
      .expect(200);
    assert.equal(bySearch.body.meta.total, 1);
    assert.equal(bySearch.body.data[0].title, "Estudar MongoDB");

    const secondPage = await request(app)
      .get("/api/tasks?limit=2&page=2")
      .expect(200);
    assert.equal(secondPage.body.meta.total, 3);
    assert.equal(secondPage.body.meta.page, 2);
    assert.equal(secondPage.body.meta.pages, 2);
    assert.equal(secondPage.body.data.length, 1);
  });

  it("expõe cabeçalhos de paginação coerentes com page e limit", async () => {
    await Task.create([
      { title: "Primeira tarefa" },
      { title: "Segunda tarefa" },
      { title: "Terceira tarefa" },
    ]);

    const firstPage = await request(app)
      .get("/api/tasks?page=1&limit=2")
      .expect(200);

    assert.equal(firstPage.body.meta.total, 3);
    assert.equal(firstPage.body.data.length, 2);
    assert.equal(firstPage.headers["x-total-count"], "3");
    assert.equal(firstPage.headers["x-page"], "1");
    assert.equal(firstPage.headers["x-page-size"], "2");
    assert.match(firstPage.headers.link, /rel="first"/);
    assert.match(firstPage.headers.link, /rel="next"/);
    assert.match(firstPage.headers.link, /rel="last"/);
    assert.doesNotMatch(firstPage.headers.link, /rel="prev"/);
    assert.match(firstPage.headers.link, /page=2&limit=2/);

    const lastPage = await request(app)
      .get("/api/tasks?page=2&limit=2")
      .expect(200);

    assert.equal(lastPage.body.data.length, 1);
    assert.equal(lastPage.headers["x-page"], "2");
    assert.match(lastPage.headers.link, /rel="first"/);
    assert.match(lastPage.headers.link, /rel="prev"/);
    assert.match(lastPage.headers.link, /rel="last"/);
    assert.doesNotMatch(lastPage.headers.link, /rel="next"/);
    assert.match(lastPage.headers.link, /page=1&limit=2/);
  });

  it("rejeita filtros com valores inválidos", async () => {
    const response = await request(app)
      .get("/api/tasks?status=invalido")
      .expect(400);

    assert.equal(response.body.error, "Status inválido.");
    assert.deepEqual(response.body.allowed, [
      "pendente",
      "em_andamento",
      "concluida",
    ]);
  });

  it("calcula as estatísticas gerais", async () => {
    await Task.create([
      { title: "Concluída A", status: "concluida", priority: "alta" },
      { title: "Concluída B", status: "concluida", priority: "media" },
      {
        title: "Atrasada",
        status: "pendente",
        priority: "media",
        dueDate: new Date(Date.now() - 86_400_000),
      },
      { title: "Em andamento", status: "em_andamento", priority: "baixa" },
    ]);

    const response = await request(app).get("/api/tasks/stats").expect(200);
    const stats = response.body.data;

    assert.equal(stats.total, 4);
    assert.equal(stats.completed, 2);
    assert.equal(stats.overdue, 1);
    assert.equal(stats.completionRate, 50);
    assert.deepEqual(stats.byStatus, {
      pendente: 1,
      em_andamento: 1,
      concluida: 2,
    });
    assert.deepEqual(stats.byPriority, {
      baixa: 1,
      media: 2,
      alta: 1,
    });
  });

  it("atualiza o status e mantém completedAt coerente", async () => {
    const task = await Task.create({ title: "Finalizar documentação" });

    const completed = await request(app)
      .patch(`/api/tasks/${task.id}`)
      .send({ status: "concluida" })
      .expect(200);
    assert.ok(completed.body.data.completedAt);

    const reopened = await request(app)
      .patch(`/api/tasks/${task.id}`)
      .send({ status: "pendente" })
      .expect(200);
    assert.equal(reopened.body.data.completedAt, null);
  });

  it("atualiza o status pelo endpoint dedicado", async () => {
    const task = await Task.create({ title: "Acompanhar andamento" });

    const inProgress = await request(app)
      .patch(`/api/tasks/${task.id}/status`)
      .send({ status: "em_andamento" })
      .expect(200);

    assert.equal(inProgress.body.data.status, "em_andamento");
    assert.equal(inProgress.body.data.completedAt, null);

    const completed = await request(app)
      .patch(`/api/tasks/${task.id}/status`)
      .send({ status: "concluida" })
      .expect(200);

    assert.equal(completed.body.data.status, "concluida");
    assert.ok(completed.body.data.completedAt);

    const reopened = await request(app)
      .patch(`/api/tasks/${task.id}/status`)
      .send({ status: "pendente" })
      .expect(200);

    assert.equal(reopened.body.data.status, "pendente");
    assert.equal(reopened.body.data.completedAt, null);
  });

  it("valida o endpoint de status e trata tarefas inexistentes", async () => {
    const task = await Task.create({ title: "Validar status" });

    const missing = await request(app)
      .patch(`/api/tasks/${task.id}/status`)
      .send({})
      .expect(400);
    assert.equal(missing.body.error, "Informe o status desejado.");
    assert.deepEqual(missing.body.allowed, [
      "pendente",
      "em_andamento",
      "concluida",
    ]);

    const invalid = await request(app)
      .patch(`/api/tasks/${task.id}/status`)
      .send({ status: "finalizada" })
      .expect(400);
    assert.equal(invalid.body.error, "Status inválido.");

    const notFound = await request(app)
      .patch(`/api/tasks/${new mongoose.Types.ObjectId()}/status`)
      .send({ status: "concluida" })
      .expect(404);
    assert.equal(notFound.body.error, "Tarefa não encontrada.");

    const invalidId = await request(app)
      .patch("/api/tasks/id-invalido/status")
      .send({ status: "concluida" })
      .expect(400);
    assert.equal(invalidId.body.error, "ID inválido.");
  });

  it("remove uma tarefa e retorna 404 depois", async () => {
    const task = await Task.create({ title: "Tarefa temporária" });

    await request(app).delete(`/api/tasks/${task.id}`).expect(204);
    await request(app).get(`/api/tasks/${task.id}`).expect(404);
  });

  it("trata IDs inválidos e tarefas inexistentes", async () => {
    const invalid = await request(app)
      .get("/api/tasks/id-invalido")
      .expect(400);
    assert.equal(invalid.body.error, "ID inválido.");

    const missing = await request(app)
      .get(`/api/tasks/${new mongoose.Types.ObjectId()}`)
      .expect(404);
    assert.equal(missing.body.error, "Tarefa não encontrada.");
  });

  it("publica o contrato OpenAPI e a interface de documentação", async () => {
    const contract = await request(app).get("/api/docs.json").expect(200);
    assert.equal(contract.body.openapi, "3.0.3");
    assert.ok(contract.body.paths["/api/tasks"]);

    const docs = await request(app).get("/api/docs/").expect(200);
    assert.match(docs.text, /id="swagger-ui"/);
  });
});
