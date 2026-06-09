import { Db, MongoClient } from 'mongodb'

declare global {
  var qinziMongoClientPromise: Promise<MongoClient> | undefined
}

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB ?? 'qinzi'

export async function getDb(): Promise<Db> {
  if (!uri) {
    throw new Error('Missing MONGODB_URI. Add your MongoDB Atlas connection string to .env.local.')
  }

  if (!globalThis.qinziMongoClientPromise) {
    const client = new MongoClient(uri)
    globalThis.qinziMongoClientPromise = client.connect()
  }

  const client = await globalThis.qinziMongoClientPromise
  return client.db(dbName)
}
