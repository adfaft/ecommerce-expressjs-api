import { Request, Response, NextFunction } from 'express';
import { checkSchema, param } from 'express-validator';
import validate from '@app/utils/express_validation_validate.js';
import mongoose, { isValidObjectId } from 'mongoose';


export const findByIdValidation = validate([
    param('id')
        .notEmpty()
        .custom((value, {req: Request}) => {
            if ( ! mongoose.Types.ObjectId.isValid(value) ){
                throw new Error('Not a valid ObjectId');
            }
            return true;
        })
]);

export default {
    findByIdValidation
}