import {test,expect} from "@playwright/test";
test("cria, lê e remove tarefa pelo servidor HTTP",async({request})=>{
 const created=await request.post("/api/tasks",{data:{title:"Tarefa E2E segura"}});
 expect(created.status()).toBe(201);
 const {data}=await created.json();
 expect((await request.get("/api/tasks/"+data.id)).status()).toBe(200);
 expect((await request.delete("/api/tasks/"+data.id)).status()).toBe(204);
 expect((await request.get("/api/tasks/"+data.id)).status()).toBe(404);
});
test("rejeita payload com operador de banco",async({request})=>{
 expect((await request.post("/api/tasks",{data:{title:{"$ne":null}}})).status()).toBe(400);
});
