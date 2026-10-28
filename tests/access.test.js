import { test } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import request from "supertest";
process.env.NODE_ENV="production";
process.env.TASK_API_TOKEN="test-only-server-secret-32-characters";
const {requireTaskToken}=await import("../src/middlewares/taskAccess.js");
test("dados de tarefas exigem credencial servidor-servidor em produção",async()=>{
 const app=express();app.use(requireTaskToken);app.get("/",(_req,res)=>res.json({ok:true}));
 await request(app).get("/").expect(401);
 await request(app).get("/").set("Authorization","Bearer invalid").expect(401);
 const response=await request(app).get("/").set("Authorization","Bearer "+process.env.TASK_API_TOKEN).expect(200);
 assert.equal(response.body.ok,true);
});

