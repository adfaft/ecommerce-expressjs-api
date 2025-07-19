import mongoose from "mongoose"

export const objectid = {
    check: (value: string) : unknown => mongoose.Types.ObjectId.isValid(value), 
    params: { message : 'Not a valid ObjectId' } 
};