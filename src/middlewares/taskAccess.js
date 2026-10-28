import { timingSafeEqual } from "node:crypto";

if (process.env.NODE_ENV === "production" && (process.env.TASK_API_TOKEN?.length ?? 0) < 32) {
  throw new Error("TASK_API_TOKEN de pelo menos 32 caracteres é obrigatório em produção.");
}

// Esta API não tem usuários/ownership. Em produção, acesso apenas servidor-servidor.
export function requireTaskToken(req, res, next) {
  if (process.env.NODE_ENV !== "production") return next();
  const expected = Buffer.from("Bearer " + process.env.TASK_API_TOKEN);
  const received = Buffer.from(req.get("authorization") ?? "");
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) {
    return res.status(401).json({ error: "Não autorizado." });
  }
  return next();
}

