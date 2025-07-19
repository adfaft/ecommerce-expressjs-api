import { Request, Response, NextFunction } from 'express';
import asyncHandler from '@app/utils/route_catch_async.js';
import { ErrorStatus } from '@app/utils/error.js';
import validation, { createValidation, findByIdValidation } from './posts.validation.js';

import Model from '@model/post.schema.js';
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
        .where({status: "publish"})
        .pagination(1, 10)
        .getQuery();

    const alldata = await query;

    await beforeRenderHook(req, res, next);

    res.status(200).json({ data: alldata });

});

export const findById = asyncHandler(async function(req: Request, res: Response, next: NextFunction) {

    await beforeStartHook(req, res, next);


    const validate = findByIdValidation.safeParse(req.params);
    if( ! validate.success ){
        throw new ErrorStatus(400, "validation error", z.flattenError(validate.error));
    }

    const data = await Model.findById(validate.data.id);
    if( ! data ){
        throw new ErrorStatus(402, "empty");
    }

    await beforeRenderHook(req, res, next);

    res.json(data);

});

export const create = asyncHandler(async function(req: Request, res: Response, next: NextFunction) {

    await beforeStartHook(req, res, next);

    await Model.init();
    await PostCategories.init();

    const result = await Model.create(req.body);

    // const validate = createValidation.safeParse(req.body);
    // if( ! validate.success ){
    //     throw new ErrorStatus(400, "validation error", z.flattenError(validate.error));
    // }

    // const result = await Model.create(validate.data);

    await beforeRenderHook(req, res, next);

    res.json(result);

});



export const updateById = asyncHandler(async function(req: Request, res: Response, next: NextFunction) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with update: a ${Model.modelName} resource`});
});

export const deleteById = asyncHandler(async function(req: Request, res: Response, next: NextFunction) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with delete (id: ${req.params.postId}): a ${Model.modelName} resource`});
});

export default {
    find,
    create,
    findById,
    updateById,
    deleteById,
    ...validation
}

