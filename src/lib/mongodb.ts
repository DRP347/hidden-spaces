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

  if (global.mongooseCache?.conn) {
    return global.mongooseCache.conn;
  }

  if (!global.mongooseCache?.promise) {
    global.mongooseCache!.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
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
