const crypto = require("crypto");

const TOKEN_VERSION = "v1";
const DEFAULT_TTL_MS = 1000 * 60 * 60 * 6;

const getSecret = () => {
  return process.env.PLAYER_AUTH_SECRET || process.env.MONGO_URI || "mindsync-dev-secret";
};

const sign = (payload) => {
  return crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex");
};

const encode = (data) => Buffer.from(JSON.stringify(data)).toString("base64url");
const decode = (value) => JSON.parse(Buffer.from(value, "base64url").toString("utf8"));

const generatePlayerToken = ({ roomCode, name }) => {
  const payload = {
    v: TOKEN_VERSION,
    roomCode: String(roomCode || "").trim().toUpperCase(),
    name: String(name || "").trim(),
    iat: Date.now(),
  };

  const encoded = encode(payload);
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
};

const verifyPlayerToken = (token) => {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return { valid: false, reason: "Missing token" };
  }

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) {
    return { valid: false, reason: "Malformed token" };
  }

  const expectedSignature = sign(encoded);
  const provided = Buffer.from(signature, "utf8");
  const expected = Buffer.from(expectedSignature, "utf8");

  if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
    return { valid: false, reason: "Invalid token signature" };
  }

  try {
    const payload = decode(encoded);

    if (payload.v !== TOKEN_VERSION) {
      return { valid: false, reason: "Unsupported token version" };
    }

    if (!payload.roomCode || !payload.name || !payload.iat) {
      return { valid: false, reason: "Incomplete token payload" };
    }

    if (Date.now() - Number(payload.iat) > DEFAULT_TTL_MS) {
      return { valid: false, reason: "Token expired" };
    }

    return { valid: true, payload };
  } catch (_error) {
    return { valid: false, reason: "Unreadable token" };
  }
};

module.exports = {
  generatePlayerToken,
  verifyPlayerToken,
};
