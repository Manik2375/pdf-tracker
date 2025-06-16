import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable")   
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: typeof import("mongoose") | null;
    promise: Promise<typeof import("mongoose")> | null;
  };
}


let cached = global.mongoose;

if (!cached) {
    cached  = global.mongoose = {conn: null, promise: null}
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn
    }
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI!, {
            bufferCommands: false
        }).then(mongoose => mongoose)
        console.log("A new connection done")
    }

    try {
        cached.conn = await cached.promise
    } catch(e) {
        cached.promise = null // we failed
        throw e
    }

    return cached.conn
}

export default connectToDatabase
