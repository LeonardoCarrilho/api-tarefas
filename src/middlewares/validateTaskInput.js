export function validateTaskInput(req, res, next) {
  const bad = () => res.status(400).json({ error: "Dados inválidos." });
  for (const [key, value] of Object.entries(req.query)) {
    if (typeof value !== "string") return bad();
    if (["page", "limit"].includes(key) && (!/^[1-9]\d{0,5}$/.test(value))) return bad();
    if (key === "sort" && !["recent", "oldest", "due"].includes(value)) return bad();
    if (key === "search" && value.length > 80) return bad();
  }
  if (!["POST", "PUT", "PATCH"].includes(req.method)) return next();
  const body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) return bad();
  for (const [key, value] of Object.entries(body)) {
    if (!["title", "description", "status", "priority", "dueDate"].includes(key)) return bad();
    if (key === "dueDate") {
      if (value !== null && (typeof value !== "string" || !Number.isFinite(Date.parse(value)))) return bad();
    } else if (typeof value !== "string") return bad();
  }
  return next();
}
