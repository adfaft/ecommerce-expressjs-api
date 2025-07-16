import { faker } from "@faker-js/faker";
import mongoose from 'mongoose';
import util from 'util';
import AdminModel from '../database/models/admin.schema.js';
import { connect, currentdb, disconnect } from '../database/mongodb.js';

// agar log bisa menampilkan max:4 deepobject
util.inspect.defaultOptions.depth = 4


const generateUsers = (num:number) => {
  const user:any = [];

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

  await connect();
  const db = currentdb();

  // generate and insert 50 user data
  try{
    const users = generateUsers(50);
    let docs:any = await AdminModel.create(users);
    console.log(`${docs.length} users have been inserted into the database.`)
  }catch(error:any){
    console.error(error);
    console.error(`${error.writeErrors?.length ?? 0} errors occurred during the insertMany operation.`);
    
    await disconnect();
    return;
  }
  
  let sample = await AdminModel.findOne().select('+password').sort({_id: -1})
  console.log(sample)

  let count = await AdminModel.countDocuments({});
  console.log(`total current documents: ${count}`)

  // close connection
  await disconnect();
  return;

})()




