const mongoose = require('mongoose');
const util = require('util')
const config = require("../config/app")

// agar log bisa menampilkan max:4 deepobject
util.inspect.defaultOptions.depth = 4;

const UserModel = require('../models/user.schema');

(async () => {

  let connection;
  try {
    connection = await mongoose.connect(await config.db_connection);
    // const dbs = await mongoose.connection.listDatabases();
    console.log("connected to db");

  } catch (error) {
    console.error(error);
    return;
  }

  const disconnect = () => {
    connection.disconnect();
    console.log("db connection is closed.");
  }

  const db = mongoose.connection.db;

  // Get all collections
  const collections = await db.listCollections().toArray();

  // Create an array of collection names and drop each collection
  collections
    .map((collection) => collection.name)
    .forEach(async (collectionName) => {
      db.dropCollection(collectionName);
    });


  let sample = await UserModel.findOne().select('+password').sort({ _id: -1 })
  console.log(sample)

  let count = await UserModel.countDocuments({});
  console.log(`total current documents: ${count}`)

  // close connection
  disconnect()
  return;

})()




