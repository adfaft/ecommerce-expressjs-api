import mongoose, { isValidObjectId } from 'mongoose';
import * as z from 'zod';
import { objectid } from '@app/utils/zod_validation.js';
import { PostStatusEnum, PostTypeEnum } from '@app/database/models/post.schema.js';


export const findByIdValidation = z.object({
    id: z.string().trim().refine(objectid.check, objectid.params )
});


export const createValidation = z.object({
    title: z.string().min(3).max(150),
    slug: z.string().min(3).max(150).regex(/[A-Za-z0-9_\-]/),
    excerpt: z.string().optional(),
    content: z.string().optional(),
    type: z.enum(Object.values(PostTypeEnum)),
    lang: z.string().max(2),
    translation: z.array(z.object({
        postId: z.string().trim().refine(objectid.check, objectid.params ),
        lang: z.string(),
    })).optional(),
    status: z.enum(Object.values(PostStatusEnum)),
    meta: z.any().optional(),
    categories: z.array(
        z.object({
            categoryId: z.string().trim().refine(objectid.check, objectid.params )
        })
    ).optional(),
    tags: z.array(
        z.string().regex(/[A-Za-z0-9]/)
    ),
    author: z.object({
        authorId: z.string().trim().refine(objectid.check, objectid.params )
    }),
    editor: z.object({
        editorId: z.string().trim().refine(objectid.check, objectid.params )
    }),
});


export default {
    findByIdValidation,
    createValidation
}