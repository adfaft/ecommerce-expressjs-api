import * as z from 'zod';
import { objectid_refine, password_superRefine, REGEX_ALNUM, REGEX_OBJECTID, REGEX_SLUG } from '@app/utils/zod_validation.js';
import { allowableWhereFields, allowableWhereInFields } from '@app/database/models/admins.schema.js';
import validator from 'validator';


export const findByIdValidation = z.object({
    id: z.string().trim().regex(REGEX_OBJECTID, objectid_refine.params)
});

// TODO: validation ini harus mengembalikan zod.JSONSchema yang valid
export const createValidation = z.object({
    fullName: z.string().min(3).max(50),
    email: z.email(),
    phone: z.string().regex(/^\d+$/),
    password: z.string().superRefine(password_superRefine)
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