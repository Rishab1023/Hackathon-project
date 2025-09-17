import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!MONGODB_URI) {
  console.warn(
    "MONGODB_URI environment variable is not defined. Using in-memory client. Features requiring a database will not work."
  );
  // @ts-ignore - Using a mock client to prevent crash
  client = { connect: () => Promise.resolve(client) };
  // @ts-ignore
  clientPromise = Promise.resolve(client);

} else if (MONGODB_URI.includes("<") || MONGODB_URI.includes(">")) {
  console.warn(
    "Your MONGODB_URI in the .env file appears to be a placeholder. The application will run, but database features will not work until it is replaced with your actual connection string from MongoDB Atlas."
  );
  // @ts-ignore
  client = { connect: () => Promise.resolve(client) };
  // @ts-ignore
  clientPromise = Promise.resolve(client);
  
} else {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(MONGODB_URI);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(MONGODB_URI);
    clientPromise = client.connect();
  }
}

async function getDb(): Promise<Db> {
    if (!MONGODB_URI || MONGODB_URI.includes("<") || MONGODB_URI.includes(">")) {
       // Return a mock Db object if not configured
       // @ts-ignore
       return { 
         collection: () => {
           console.warn("MongoDB is not configured. Returning mock collection.");
           const mockCollection = {
             findOne: async () => null,
             find: () => ({
                toArray: async () => [],
                sort: () => ({
                    limit: () => ({
                        toArray: async () => [],
                    })
                })
             }),
             countDocuments: async () => 0,
             updateOne: async () => ({}),
             insertOne: async () => ({ insertedId: ""}),
             deleteOne: async () => ({ deletedCount: 0 }),
             deleteMany: async () => ({}),
           };
           return mockCollection;
         }
       };
    }
    const mongoClient = await clientPromise;
    return mongoClient.db();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export { clientPromise, getDb };
