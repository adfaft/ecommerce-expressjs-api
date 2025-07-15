import { faker } from "@faker-js/faker";
import mongoose from 'mongoose';
import util from 'util';
import config from "../config/app";

// agar log bisa menampilkan max:4 deepobject
util.inspect.defaultOptions.depth = 4

const AdminModel = require('../database/models/admin.schema');

const generateUsers = (num) => {
  const user = [];

  for (let i = 0; i < num; i++) {
    const sex = faker.person.sexType();
    const firstName = faker.person.firstName(sex);
    const middleName = faker.person.middleName();
    const lastName = faker.person.lastName();
    const password = "testingsaja";
    const email = faker.internet.email({ firstName, lastName });
    const status = faker.helpers.arrayElement(['active', 'inactive']);
    const role = ["admin"];

    user.push({
      firstName,
      middleName,
      lastName,
      email,
      password,
      status,
      role
    });
  }

  return user;
};


(async () => {

  let db;
  try {
    db = await mongoose.connect(config.db_connection);
    // const dbs = await mongoose.connection.listDatabases();
    console.log( "connected to db" );

  } catch (error) {    
    console.error(error);
    return;
  }

  const disconnect = () => {
    db.disconnect();
    console.log("db connection is closed.");
  }

  // generate and insert 50 user data
  try{
    const users = generateUsers(50);
    let docs = await AdminModel.create(users);
    console.log(`${docs.length} users have been inserted into the database.`)
  }catch(error){
    console.error(error);
    console.error(`${error.writeErrors?.length ?? 0} errors occurred during the insertMany operation.`);
    
    disconnect();
    return;
  }
  
  let sample = await AdminModel.findOne().select('+password').sort({_id: -1})
  console.log(sample)

  let count = await AdminModel.countDocuments({});
  console.log(`total current documents: ${count}`)

  // close connection
  disconnect()
  return;

})()




