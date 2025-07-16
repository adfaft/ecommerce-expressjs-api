import express, { Request, Response, NextFunction } from 'express';
var router = express.Router();

const model = 'users'; 


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


/* GET users listing. */
router.get('/', async function(req: Request, res: Response, next: NextFunction) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with query: ${model} list resource`});
});

/* POST users/ create data. */
router.post('/', async function(req: Request, res: Response, next: NextFunction) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with created: a ${model} resource`});
});

/* GET users/:userId data. */
router.get('/:userId', async function(req: Request, res: Response, next: NextFunction) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with query (id: ${req.params.userId}): a ${model} resource`});
});

/* PUT users/ data. */
router.put('/', async function(req: Request, res: Response, next: NextFunction) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with update: a ${model} resource`});
});

/* POST users/update/:userId data. */
router.post('/update/:userId', async function(req: Request, res: Response, next: NextFunction) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with update (id: ${req.params.userId}): a ${model} resource`});
});

/* DELETE users/:userId data. */
router.delete('/:userId', async function(req: Request, res: Response, next: NextFunction) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with delete (id: ${req.params.userId}): a ${model} resource`});
});

/* POST users/delete/:userId data. */
router.post('/delete/:userId', async function(req: Request, res: Response, next: NextFunction) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with delete (id: ${req.params.userId}): a ${model} resource`});
});

export default router;
