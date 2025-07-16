import { Request, Response, NextFunction } from 'express';
import asyncHandler from '@app/utils/route_catch_async.js';
import { ErrorStatus } from '@app/utils/error.js';
import validation from './posts.validation.js';

import Model from '@model/post.schema.js';


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
    // await beforeStartHook(req, res, next);

    const alldata = await Model.find({});

    // await beforeRenderHook(req, res, next);

    res.status(200).json({ data: alldata });

});

export const create = asyncHandler(async function(req: Request, res: Response, next: NextFunction) {

    await beforeStartHook(req, res, next);

    const data = new Model(req.body);
    const result = await data.save();

    console.log(result);

    await beforeRenderHook(req, res, next);

    res.json(result);

});

export const findById = asyncHandler(async function(req: Request, res: Response, next: NextFunction) {

    await beforeStartHook(req, res, next);

    const data = await Model.findById(req.params.id);
    if( ! data ){
        throw new ErrorStatus(402, "empty");
    }

    await beforeRenderHook(req, res, next);

    res.json(data);

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

