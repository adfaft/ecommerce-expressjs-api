import mongoose from 'mongoose';
import util from 'util';
import config from "../config/app.js";
import mongodb from '../database/mongodb.js';
import AdminModel from '../database/models/admin.schema.js';

// agar log bisa menampilkan max:4 deepobject
util.inspect.defaultOptions.depth = 4;

(async () => {

  await mongodb.connect();
  const db = mongodb.db()

  // Get all collections
  const collections = await db?.listCollections().toArray();

  // Create an array of collection names and drop each collection
  collections && collections
    .map((collection) => collection.name)
    .forEach(async (collectionName) => {
      db?.dropCollection(collectionName);
    });


  let sample = await AdminModel.findOne().select('+password').sort({ _id: -1 })
  console.log(sample)

  let count = await AdminModel.countDocuments({});
  console.log(`total current documents: ${count}`)

  // close connection
  mongodb.disconnect()
  return;

})()




