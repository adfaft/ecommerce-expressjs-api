import util from 'util';
import { connect, currentdb, disconnect } from '@app/database/mongodb.js';
import AdminModel from '@model/admin.schema.js';

// agar log bisa menampilkan max:4 deepobject
util.inspect.defaultOptions.depth = 4;

(async () => {

  await connect();

  const db = currentdb();

  // Get all collections
  let collections = await db?.listCollections().toArray() ?? [];

  console.log("collections before");
  console.log(collections);

  for( const item of collections){
    try{
      await db?.dropCollection(item.name);
    }catch(err){
      console.log(err)
    }
  }
  
  collections = await db?.listCollections().toArray() ?? [];

  console.log("collections after");
  console.log(collections);

  await db?.dropDatabase();

  console.log("database drop");

  // close connection
  await disconnect();
  return;

})()




