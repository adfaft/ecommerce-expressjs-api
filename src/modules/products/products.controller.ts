import { Request, Response, NextFunction } from 'express';
import asyncHandler from '@app/utils/route_catch_async.js';
import { ErrorStatus } from '@app/utils/error.js';
import validation, { createValidation, findByIdValidation, findQueryValidation, updateValidation } from './products.validation.js';

import Model, { querySearch, refill } from '@app/database/models/products.schema.js';
import z from 'zod';
import MongoPaginateHelper from '@app/utils/mongodb_query.js';


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

    const validate = findQueryValidation.safeParse(req.query);
    if (!validate.success) {
        throw new ErrorStatus(400, "validation error", z.flattenError(validate.error));
    }

    const paginate = new MongoPaginateHelper(Model)
        .pagination(validate.data.page, validate.data.limit);

    // search
    if( validate.data.search ){
        paginate.getQuery().where(querySearch(validate.data.search));
    }

    // where
    if( validate.data.where ){
        paginate.where(validate.data.where);
        
    }
    
     // whereIn
    if( validate.data.whereIn ){
        paginate.where(validate.data.whereIn);
        
    }

    // sort
    
    // TODO: sort belum dipasangkan

    // result
    const alldata = await paginate.getQuery();
    const count = await paginate.getQueryCount();

    await beforeRenderHook(req, res, next);

    res.status(200).json({ data: alldata, pagination: {
        page: validate.data.page,
        limit: validate.data.limit,
        count: count,
    } });

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
        const value = validate.data[i as keyof typeof validate.data];
        if( typeof value !== "undefined" ){
            model.set(i, value);
        }
        
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

