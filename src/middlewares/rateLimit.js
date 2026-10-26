import rateLimit from "express-rate-limit";

const parsePositiveInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
};

const configuredMax = parsePositiveInt(process.env.RATE_LIMIT_MAX, null);
const isTestEnvironment = process.env.NODE_ENV === "test";

// Em testes o limitador fica desativado, a menos que RATE_LIMIT_MAX seja
// definido explicitamente (usado pelo teste que cobre o 429).
export const taskRateLimiter = rateLimit({
  windowMs: parsePositiveInt(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
  limit: configuredMax ?? 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTestEnvironment && configuredMax === null,
  message: {
    error: "Muitas requisições. Tente novamente em alguns instantes.",
  },
});

export default taskRateLimiter;
