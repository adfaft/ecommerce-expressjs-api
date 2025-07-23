import express, { Request, Response, NextFunction } from 'express';
var router = express.Router();

const model = 'products-skus'; 


// middleware that is specific to this router
let time:number = 0;

const timeBeforeMiddleware = (req: Request, res: Response, next: NextFunction) => {
    time = Date.now()
    console.log(`BEGIN: `, time)

    next()
}
router.use(timeBeforeMiddleware)

const beforeRenderHook = async (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve().then(() => {
      time = Date.now() - time
      console.log(`ELAPSED: ${(time/1000).toFixed(3)} s`)
  })
}


/* GET products/sku listing. */
router.get('/', async function(req: Request, res: Response, next: NextFunction) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with query: ${model} list resource`});
});

/* POST products/sku/ create data. */
router.post('/', async function(req: Request, res: Response, next: NextFunction) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with created: a ${model} resource`});
});

/* GET products/sku/:skudId data. */
router.get('/:skudId', async function(req: Request, res: Response, next: NextFunction) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with query (id: ${req.params.skudId}): a ${model} resource`});
});

/* PUT products/sku/ data. */
router.put('/', async function(req: Request, res: Response, next: NextFunction) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with update: a ${model} resource`});
});

/* POST products/sku/:skudId data. */
router.post('/:skudId', async function(req: Request, res: Response, next: NextFunction) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with update (id: ${req.params.skudId}): a ${model} resource`});
});

/* DELETE products/sku/:skudId data. */
router.delete('/:skudId', async function(req: Request, res: Response, next: NextFunction) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with delete (id: ${req.params.skudId}): a ${model} resource`});
});

export default router;
