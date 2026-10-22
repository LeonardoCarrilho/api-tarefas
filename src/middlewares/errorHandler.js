export function notFound(req, res) {
  res.status(404).json({
    error: "Rota não encontrada.",
    path: req.originalUrl,
  });
}

export function errorHandler(error, _req, res, _next) {
  if (error.name === "ValidationError") {
    return res.status(400).json({
      error: "Dados inválidos.",
      details: Object.values(error.errors).map((item) => ({
        field: item.path,
        message: item.message,
      })),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      error: "ID inválido.",
      value: error.value,
    });
  }

  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "JSON inválido no corpo da requisição." });
  }

  console.error(error);
  return res.status(error.status || 500).json({
    error: error.message || "Erro interno do servidor.",
  });
}
