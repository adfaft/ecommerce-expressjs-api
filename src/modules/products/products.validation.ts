import * as z from 'zod';
import { objectid_refine, REGEX_ALNUM, REGEX_OBJECTID, REGEX_SLUG } from '@app/utils/zod_validation.js';
import { allowableWhereFields, allowableWhereInFields, ProductStatusEnum } from '@app/database/models/products.schema.js';
import DOMPurify from "isomorphic-dompurify";
import validator from 'validator';


export const findByIdValidation = z.object({
    id: z.string().trim().regex(REGEX_OBJECTID, objectid_refine.params)
});

// TODO: validation ini harus mengembalikan zod.JSONSchema yang valid
export const createValidation = z.object({
    title: z.string().min(3).max(150),
    slug: z.string().min(3).max(150).regex(REGEX_SLUG),
    description: z.preprocess((x) => x ? x : undefined, z.string().transform((x) => DOMPurify.sanitize(x)).optional()),
    
    lang: z.string().max(2),
    translation: z.array(z.object({
        postId: z.string().trim().regex(REGEX_OBJECTID, objectid_refine.params),
        lang: z.string(),
    })).optional(),

    publishedAt: z.date(),
    status: z.enum(Object.values(ProductStatusEnum)),

    categories: z.array(
        z.object({
            categoryId: z.string().trim().regex(REGEX_OBJECTID, objectid_refine.params)
        })
    ).optional(),
    attributes: z.array(
        z.object({
            categoryId: z.string().trim().regex(REGEX_OBJECTID, objectid_refine.params)
        })
    ).optional(),
    variants: z.array(
        z.object({
            productId: z.string().trim().regex(REGEX_OBJECTID, objectid_refine.params)
        })
    ).optional(),

    sku: z.object(),
    discount: z.object(),
    skuDisount: z.object(),
});

// TODO: pisahkan sanitize dalam pipeline terpisah agar bisa menjadi JSON Schema

// TODO: unit test apakah bisa menerima optional, default kalau ada
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