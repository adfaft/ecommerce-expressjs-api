export default class MongoQuery{

    public query;
    public page: number = 1;
    public limit:number = 10;

    constructor(query:any){
        this.query = query;
    }

    pagination(page:number, limit:number){
        this.page = page <= 0 ? 1 : page;
        this.limit = limit;

        this.query.skip((this.page - 1) * this.limit).limit(this.limit)

        return this;
    }

    where(query:any){
        this.query.where(query);
        
        return this;
    }

    getQuery(){
        return this.query;
    }
}