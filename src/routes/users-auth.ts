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


/* GET users/auth/me check profile. */
router.get('/me', async function(req: Request, res: Response, next: NextFunction) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with profile`});
});

/* POST users/auth/login login. */
router.post('/login', async function(req: Request, res: Response, next: NextFunction) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with login`});
});

/* GET users/auth/logout to logout. */
router.get('/logout', async function(req: Request, res: Response, next: NextFunction) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with logout`});
});

/* GET users/auth/refresh to refresh token. */
router.get('/refresh', async function(req: Request, res: Response, next: NextFunction) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with refresh jwt token`});
});


export default router;
