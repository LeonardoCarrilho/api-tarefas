import { test } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import request from "supertest";
import {validateTaskInput} from "../src/middlewares/validateTaskInput.js";
test("validação rejeita operadores, campos extras e paginação excessiva",async()=>{
 const app=express();app.use(express.json());app.use(validateTaskInput);app.use((_req,res)=>res.sendStatus(204));
 for(const body of [{title:{$ne:null}},{title:"ok",admin:true},{dueDate:"invalid"},[]]){
 await request(app).post("/").send(body).expect(400);
 }
 await request(app).get("/?page=99999999999999").expect(400);
 await request(app).get("/?search[x]=y").expect(400);
 assert.equal((await request(app).post("/").send({title:"Título normal"})).status,204);
});
