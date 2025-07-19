import { Request, Response, NextFunction } from 'express';
import { checkSchema, param } from 'express-validator';
import validate from '@app/utils/express_validation_validate.js';
import mongoose, { isValidObjectId } from 'mongoose';
import * as z from 'zod';
import { objectid } from '@app/utils/zod_validation.js';


export const findByIdValidation = z.object({
    id: z.string().trim().refine(objectid.check, objectid.params )
});


// validate([
//     param('id')
//         .notEmpty()
//         .custom((value, {req: Request}) => {
//             if ( ! mongoose.Types.ObjectId.isValid(value) ){
//                 throw new Error('Not a valid ObjectId');
//             }
//             return true;
//         })
// ]);


export const createValidation = z.object({
    title: z.string().max(150),
    slug: z.string().max(150),
    excerpt: z.string().optional(),
    content: z.string().optional(),
    type: z.string(),
    lang: z.string().max(2),
    translation: z.array(z.object({
        postId: z.string(),
        type: z.string(),
        lang: z.string(),
        title: z.string(),
        slug: z.string(),
        url: z.string()
    })).optional(),
    status: z.string(),
    meta: z.object().optional(),
    category: z.array(z.object({
        name: z.string(),
        slug: z.string(),
        parent: z.string(),
        breadcrumb: z.array(z.string()),
        breadcrumbsPath: z.array(z.string())
    })).optional(),
    tags: z.array(z.string()),
    authorId: z.string().trim().refine(objectid.check, objectid.params ),
    editorId: z.string().trim().refine(objectid.check, objectid.params ),
});


export default {
    findByIdValidation,
    createValidation
}