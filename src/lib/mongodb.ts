import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

export type MongoErrorType =
  | "MISSING_ENV"
  | "NETWORK_ACCESS"
  | "AUTH"
  | "TIMEOUT"
  | "INVALID_URI"
  | "MODEL_MISMATCH"
  | "UNKNOWN"
  | null;

export type DataSource = "database" | "fallback";

export type MongoStatus = {
  configured: boolean;
  connected: boolean;
  errorType: MongoErrorType;
  message: string;
  source?: DataSource;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null };
}

mongoose.set("strictQuery", true);

export async function connectToDatabase() {
  const MONGODB_URI = getMongoUri();

  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  if (global.mongooseCache?.conn && mongoose.connection.readyState === 1) {
    return global.mongooseCache.conn;
  }

  if (global.mongooseCache?.conn && mongoose.connection.readyState !== 1) {
    global.mongooseCache.conn = null;
    global.mongooseCache.promise = null;
  }

  if (!global.mongooseCache?.promise) {
    global.mongooseCache!.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      family: 4,
      heartbeatFrequencyMS: 10000,
      maxIdleTimeMS: 30000,
      maxPoolSize: 5,
      minPoolSize: 0,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 15000,
      tls: true,
    });
  }

  try {
    global.mongooseCache!.conn = await global.mongooseCache!.promise;
  } catch (error) {
    global.mongooseCache!.promise = null;
    throw error;
  }

  return global.mongooseCache!.conn;
}

export async function getMongoStatus(source?: DataSource): Promise<MongoStatus> {
  if (!getMongoUri()) {
    return {
      configured: false,
      connected: false,
      errorType: "MISSING_ENV",
      message:
        "MongoDB is not configured. Add MONGODB_URI to the server environment.",
      source,
    };
  }

  if (mongoose.connection.readyState === 1) {
    return {
      configured: true,
      connected: true,
      errorType: null,
      message: "MongoDB is connected.",
      source,
    };
  }

  try {
    await connectToDatabase();

    return {
      configured: true,
      connected: true,
      errorType: null,
      message: "MongoDB is connected.",
      source,
    };
  } catch (error) {
    if (isMongoNetworkError(error)) {
      await resetDatabaseConnection();
    }

    return createMongoStatus(error, source);
  }
}

export function createMongoStatus(error: unknown, source?: DataSource): MongoStatus {
  const errorType = classifyMongoError(error);

  return {
    configured: Boolean(getMongoUri()),
    connected: false,
    errorType,
    message: getSafeMongoMessage(errorType),
    source,
  };
}

export function getMongoUri() {
  return (
    process.env.MONGODB_URI ??
    process.env.MONGO_URI ??
    process.env.DATABASE_URL ??
    ""
  ).trim();
}

export function classifyMongoError(error: unknown): Exclude<MongoErrorType, null> {
  if (!getMongoUri()) {
    return "MISSING_ENV";
  }

  if (!error || typeof error !== "object") {
    return "UNKNOWN";
  }

  const name = "name" in error ? String(error.name) : "";
  const code = "code" in error ? String(error.code) : "";
  const message = "message" in error ? String(error.message) : "";
  const normalized = `${name} ${code} ${message}`.toLowerCase();

  if (
    normalized.includes("mongoparseerror") ||
    normalized.includes("invalid scheme") ||
    normalized.includes("invalid connection string")
  ) {
    return "INVALID_URI";
  }

  if (
    normalized.includes("overwritemodelerror") ||
    normalized.includes("schema hasn't been registered") ||
    normalized.includes("model mismatch") ||
    normalized.includes("missing schema")
  ) {
    return "MODEL_MISMATCH";
  }

  if (
    normalized.includes("authentication failed") ||
    normalized.includes("bad auth") ||
    normalized.includes("auth failed") ||
    normalized.includes("not authorized")
  ) {
    return "AUTH";
  }

  if (
    normalized.includes("ip whitelist") ||
    normalized.includes("isn't whitelisted") ||
    normalized.includes("not whitelisted") ||
    normalized.includes("network access") ||
    normalized.includes("could not connect to any servers in your mongodb atlas cluster")
  ) {
    return "NETWORK_ACCESS";
  }

  if (
    normalized.includes("timed out") ||
    normalized.includes("timeout") ||
    normalized.includes("etimedout") ||
    normalized.includes("server selection") ||
    normalized.includes("enotfound") ||
    normalized.includes("econnrefused")
  ) {
    return "TIMEOUT";
  }

  return "UNKNOWN";
}

export function getSafeMongoMessage(errorType: MongoErrorType) {
  switch (errorType) {
    case "MISSING_ENV":
      return "MongoDB is not configured. Add MONGODB_URI to the server environment.";
    case "NETWORK_ACCESS":
      return "MongoDB is configured, but Atlas network access is rejecting the connection.";
    case "AUTH":
      return "MongoDB authentication failed. Check the username, password, and database user permissions.";
    case "TIMEOUT":
      return "MongoDB connection timed out. Check Atlas Network Access, DNS, and Vercel environment configuration.";
    case "INVALID_URI":
      return "MongoDB URI is invalid. Use a mongodb+srv:// or mongodb:// connection string.";
    case "MODEL_MISMATCH":
      return "MongoDB is connected, but the app model or collection mapping does not match the stored place data.";
    case "UNKNOWN":
      return "MongoDB is unavailable. Check the database connection and deployment logs.";
    case null:
    default:
      return "MongoDB is connected.";
  }
}

export async function resetDatabaseConnection() {
  global.mongooseCache = { conn: null, promise: null };

  if (mongoose.connection.readyState !== 0) {
    try {
      await mongoose.disconnect();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[Hidden Spaces] MongoDB disconnect failed:", error);
      }
    }
  }
}

function isMongoNetworkError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const name = "name" in error ? String(error.name) : "";
  const message = "message" in error ? String(error.message) : "";

  return (
    name.includes("MongoNetworkError") ||
    name.includes("MongoPoolClearedError") ||
    name.includes("MongoServerSelectionError") ||
    message.includes("MongoNetworkError") ||
    message.includes("SSL routines") ||
    message.includes("tlsv1 alert") ||
    message.includes("server selection")
  );
}
