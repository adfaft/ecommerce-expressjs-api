import mongoose from 'mongoose';
import config from '../config/app';

var connection;
export const connectdb = async () => {
    try {
        connection = await mongoose.connect(await config.db_connection);
        // const dbs = await mongoose.connection.listDatabases();
        console.log("connected to db");

    } catch (error) {
        console.error(error);
        return;
    }
}

export const disconnectdb = () => {
    connection.disconnect();
    console.log("db connection is closed.");
}

export const dblist = async () => {
    return await db.listCollections().toArray();
}

export default connectdb;
