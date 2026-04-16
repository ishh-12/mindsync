const parseAllowedOrigins = () => {
  const rawOrigins = process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "";

  return rawOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

const allowedOrigins = parseAllowedOrigins();

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.length === 0) return true;
  return allowedOrigins.includes(origin);
};

const corsOrigin = (origin, callback) => {
  if (isAllowedOrigin(origin)) {
    callback(null, true);
    return;
  }

  callback(new Error("Origin not allowed by CORS"));
};

const corsOptions = {
  origin: corsOrigin,
  credentials: true,
};

module.exports = {
  allowedOrigins,
  corsOptions,
};
