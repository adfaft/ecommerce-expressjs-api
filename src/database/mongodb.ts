import mongoose, { Mongoose } from 'mongoose';
import config from '@config/app.js';

class MongoDb{

    private connection: Mongoose|null = null;

    async connect() : Promise<Mongoose|undefined> {
        try {
            this.connection = await mongoose.connect(await config.db_connection);
            // const dbs = await mongoose.connection.listDatabases();
            console.log("connected to db");

            return this.connection;

        } catch (error) {
            console.error(error);
            
            return;
        }
    }

    async dblist() : Promise<string[]> {
        const db = this.db();
        
        const dblist = await db?.listCollections().map(x => x.name).toArray();
        
        return dblist || [];
    }

    db(): mongoose.mongo.Db|undefined {
        return this.connection?.connection.db;
    }

    disconnect(): void {
        this.connection?.disconnect();
        console.log("db connection is closed.");
    }
}

const mongodb = new MongoDb();

export default mongodb;
