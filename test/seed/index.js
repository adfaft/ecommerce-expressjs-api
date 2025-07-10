const { faker } = require("@faker-js/faker")
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const util = require('util')

util.inspect.defaultOptions.depth = 4

const UserModel = require('../../models/user.schema')

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


const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://root:password@127.0.0.1:27017/ecommerce?authSource=admin&directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.5.5");
    const dbs = await mongoose.connection.listDatabases();
    console.log("connected to db" );
    console.log(dbs)

    const users = generateUsers(50);

    UserModel.insertMany(users)
      .then(docs => {
        console.log(`${docs.length} users have been inserted into the database.`)
    
        const check = async () => {
          const one = await UserModel.findOne()
          console.log(one)
        }
        
        check()

      })
      .catch(err => {
        console.error(err);
        console.error(`${err.writeErrors?.length ?? 0} errors occurred during the insertMany operation.`);
      });

  } catch (error) {
    console.error(error);
  }
};
connectDB()





