import { currentdb, dblist} from "@app/database/mongodb.js";

const reset = async () =>  {

    const db = currentdb();

    if( ! db ) return;

    const all = await dblist();

    for( const i in all){
        await db.dropCollection(i);
    }
    
}

export default reset;