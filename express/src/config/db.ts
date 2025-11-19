import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer | null = null;

export default async function connectDB() {
  // Step 1: Try real MongoDB
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Connected to MongoDB URI");
      return;
    } catch (err: any) {
      console.warn(`Failed to connect to MONGO_URI: ${err.message}`);
    }
  }

  // Step 2: Fallback to in-memory MongoDB
  mongoServer = await MongoMemoryServer.create();
  const inMemoryUri = mongoServer.getUri();
  await mongoose.connect(inMemoryUri);
  console.log("Connected to in-memory MongoDB");

  // Optional: Migrate to real MongoDB if it becomes available
  if (process.env.MONGO_URI) {
    setTimeout(async () => {
      try {
        console.log("Migrating data from in-memory to real MongoDB...");
        const realUri = process.env.MONGO_URI!;
        const realDb = await mongoose.createConnection(realUri);

        const inMemoryDb = mongoose.connection.db;
        const collections = await inMemoryDb.listCollections().toArray();

        for (const { name } of collections) {
          const docs = await inMemoryDb.collection(name).find().toArray();
          if (docs.length === 0) continue;

          const realCollection = realDb.db.collection(name);
          await realCollection.insertMany(docs);
        }

        // Disconnect in-memory and reconnect mongoose to real DB
        await mongoose.disconnect();
        await mongoServer?.stop();
        await mongoose.connect(realUri);
        console.log("Switched mongoose to real MongoDB successfully");
      } catch (err: any) {
        console.error("Migration failed:", err.message);
      }
    }, 5000);
  }

  process.on("SIGINT", async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
    process.exit(0);
  });
}
