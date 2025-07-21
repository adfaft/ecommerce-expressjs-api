import mongoose, { Mongoose } from 'mongoose';
import config from '@config/app.js';

let connection: Mongoose | null = null;

export const connect = async () : Promise<Mongoose | undefined> => {
    if (connection) return connection;
    
    connection = await mongoose.connect(config.db_connection, { 
        autoIndex: config.environment === "development",
        autoCreate: config.environment === "development", 
    });
    mongoose.set("strictQuery", true);

    // const dbs = await mongoose.connection.listDatabases();
    // console.log("connected to db");

    return connection;
}

export const currentdb = () : mongoose.mongo.Db | undefined => {
    return connection?.connection.db;
}

export const dblist = async () : Promise<string[]> => {
    const db = currentdb();
    const dblist = await db?.listCollections().map(x => x.name).toArray();
    return dblist || [];
}


export const disconnect = async () : Promise<void> => {

    await connection?.disconnect();
    connection = null;
    // console.log("db connection is closed.");
}

export default {
    connect,
    currentdb,
    disconnect,
    dblist
};
