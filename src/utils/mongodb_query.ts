import { Document, Model, Models, Query } from "mongoose";

export default class MongoPaginateHelper<T>{

    public query: Query<T[], T, {}, unknown, "find", Record<string, never>>;
    public queryCount: Query<number, T, {}, unknown, "find", Record<string, never>>;
    public page: number = 1;
    public limit:number = 10;

    constructor(model:Model<T>){
        this.query = model.find({});
        this.queryCount = model.countDocuments();
    }

    pagination(page:number, limit:number){
        this.page = page <= 0 ? 1 : page;
        this.limit = limit;

        this.query.skip((this.page - 1) * this.limit).limit(this.limit)

        return this;
    }

    where(query:Partial<Record<string, string>>){

        for( const key in query ){
            this.query.where(key).equals(query[key]);
            this.queryCount.where(key).equals(query[key]);
        }
        
        return this;
    }

    /**
     * 
     * @param query Record<key:string, value:string> where value is comma separated
     * @returns 
     */
    whereIn(query:Partial<Record<string, string>>){

        for( const key in query ){
            const value:string = query[key] as string;
            this.query.in(key, value.split(',').map((x) => x.trim()));
            this.queryCount.in(key, value.split(',').map((x) => x.trim()));
        }
        
        return this;
    }

    getQuery(){
        return this.query;
    }

    getQueryCount(){
        return this.queryCount;
    }
}