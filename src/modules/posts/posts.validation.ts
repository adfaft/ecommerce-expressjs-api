import * as z from 'zod';
import { objectid_refine, REGEX_ALNUM, REGEX_OBJECTID, REGEX_SLUG } from '@app/utils/zod_validation.js';
import { allowableWhereFields, allowableWhereInFields, PostStatusEnum, PostTypeEnum } from '@app/database/models/post.schema.js';
import DOMPurify from "isomorphic-dompurify";
import validator from 'validator';


export const findByIdValidation = z.object({
    id: z.string().trim().regex(REGEX_OBJECTID, objectid_refine.params)
});

// @todo validation ini harus mengembalikan zod.JSONSchema yang valid
export const createValidation = z.object({
    title: z.string().min(3).max(150),
    slug: z.string().min(3).max(150).regex(REGEX_SLUG),
    excerpt: z.string().optional(),
    content: z.preprocess((x) => x ? x : undefined, z.string().transform((x) => DOMPurify.sanitize(x)).optional()),
    type: z.enum(Object.values(PostTypeEnum)),
    lang: z.string().max(2),
    translation: z.array(z.object({
        postId: z.string().trim().regex(REGEX_OBJECTID, objectid_refine.params),
        lang: z.string(),
    })).optional(),
    status: z.enum(Object.values(PostStatusEnum)),
    meta: z.any().optional(),
    categories: z.array(
        z.object({
            categoryId: z.string().trim().regex(REGEX_OBJECTID, objectid_refine.params)
        })
    ).optional(),
    tags: z.array(
        z.string().regex(REGEX_ALNUM)
    ).optional(),
    author: z.object({
        authorId: z.string().trim().regex(REGEX_OBJECTID, objectid_refine.params)
    }),
    editor: z.object({
        editorId: z.string().trim().regex(REGEX_OBJECTID, objectid_refine.params)
    }),
});

// @todo pisahkan sanitize dalam pipeline terpisah agar bisa menjadi JSON Schema

// @todo unit test apakah bisa menerima optional, default kalau ada
export const findQueryValidation = z.object({
    page: z.preprocess((x) => x ? x : undefined, z.coerce.number().gt(0).optional().default(1)), 
    limit: z.preprocess((x) => x ? x : undefined, z.coerce.number().gt(0).optional().default(10)),
    search: z.string().min(3).optional().transform((x) => x ? validator.escape(x) : undefined ),
    where: z.partialRecord(z.enum(allowableWhereFields), z.string().transform((x) => validator.escape(x))).optional(),
    whereIn: z.partialRecord(z.enum(allowableWhereInFields), z.string().transform((x) => validator.escape(x))).optional(),
});


export const updateValidation = createValidation.partial();


export default {
    findByIdValidation,
    findQueryValidation,
    createValidation
}