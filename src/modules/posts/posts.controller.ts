import { Request, Response, NextFunction } from 'express';
import asyncHandler from '@app/utils/route_catch_async.js';
import { ErrorStatus } from '@app/utils/error.js';
import validation, { createValidation, findByIdValidation, updateValidation } from './posts.validation.js';

import Model, { refill } from '@model/post.schema.js';
import PostCategories from '@model/post_category.schema.js';
import z from 'zod';
import MongoQuery from '@app/utils/mongodb_query.js';


// middleware that is specific to this router
let time: number = 0;

export const beforeStartHook = async (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve().then(() => {
        time = Date.now()
        // console.log(`BEGIN: `, time)
    });
};

export const beforeRenderHook = async (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve().then(() => {
        time = Date.now() - time
        // console.log(`ELAPSED: ${(time / 1000).toFixed(3)} s`)
    })
};

export const find = asyncHandler(async function (req: Request, res: Response, next: NextFunction) {
    await beforeStartHook(req, res, next);

    const query = new MongoQuery(Model.find())
        .pagination(1, 10)
        .getQuery();

    const alldata = await query;

    await beforeRenderHook(req, res, next);

    res.status(200).json({ data: alldata });

});

export const findById = asyncHandler(async function (req: Request, res: Response, next: NextFunction) {

    await beforeStartHook(req, res, next);


    const validate = findByIdValidation.safeParse(req.params);
    if (!validate.success) {
        throw new ErrorStatus(400, "validation error", z.flattenError(validate.error));
    }

    const data = await Model.findById(validate.data.id);
    if (!data) {
        throw new ErrorStatus(402, "empty");
    }

    await beforeRenderHook(req, res, next);

    res.status(200).json(data.toJSON({ getters: true}));

});

export const create = asyncHandler(async function (req: Request, res: Response, next: NextFunction) {

    await beforeStartHook(req, res, next);

    // validate and insert data except relations
    const validate = createValidation.safeParse(req.body);
    if( ! validate.success ){
        throw new ErrorStatus(400, "validation error", z.flattenError(validate.error));
    }

    // validate if exist
    const exists = await Model.findOne({
        slug: validate.data.slug,
        type: validate.data.type,
        lang: validate.data.lang
    });

    if( exists ){
        throw new ErrorStatus(400, "already exist");
    }

    // create model
    let result = await Model.create(validate.data);

    // repopulate relation extra attributes
    result = await refill(result);

    await beforeRenderHook(req, res, next);

    res.status(200).json(result.toJSON({ getters: true }));

});



export const updateById = asyncHandler(async function (req: Request, res: Response, next: NextFunction) {

    await beforeStartHook(req, res, next);

    const validateId = findByIdValidation.safeParse(req.params);
    if (!validateId.success) {
        throw new ErrorStatus(400, "validation error", z.flattenError(validateId.error));
    }

    // validate and insert data except relations
    const validate = updateValidation.safeParse(req.body);
    if( ! validate.success ){
        throw new ErrorStatus(400, "validation error", z.flattenError(validate.error));
    }

    // get model
    const model = await Model.findById(validateId.data.id);
    if (!model) {
        throw new ErrorStatus(402, "empty");
    }

    // update
    for( const i in validate.data){
        model.set(i, validate.data[i as keyof typeof validate.data]);
    }
    await model.save();

    // repopulate
    const result = await refill(model);

    await beforeRenderHook(req, res, next);

    res.status(200).json(result.toJSON({ getters: true }));
});

export const deleteById = asyncHandler(async function (req: Request, res: Response, next: NextFunction) {
    await beforeRenderHook(req, res, next);

    const validate = findByIdValidation.safeParse(req.params);
    if (!validate.success) {
        throw new ErrorStatus(400, "validation error", z.flattenError(validate.error));
    }

    const data = await Model.findById(validate.data.id);
    if (!data) {
        throw new ErrorStatus(402, "empty");
    }

    const result = await Model.deleteOne({ _id: validate.data.id });

    if( ! result.deletedCount ){
        throw new ErrorStatus(400, "failed to delete");
    }

    res.status(200).json(data.toJSON({ getters: true}));
    
});

export default {
    find,
    create,
    findById,
    updateById,
    deleteById,
    ...validation
}

