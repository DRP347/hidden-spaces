import mongoose from "mongoose";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
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
  const MONGODB_URI = process.env.MONGODB_URI;

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
