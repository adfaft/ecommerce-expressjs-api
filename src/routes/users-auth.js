var express = require('express');
var router = express.Router();

const model = 'users'; 


// middleware that is specific to this router
let time = null;

const timeBeforeMiddleware = (req, res, next) => {
    time = Date.now()
    console.log(`BEGIN: `, time)

    next()
}
router.use(timeBeforeMiddleware)

const beforeRenderHook = async (req, res, next) => {
  Promise.resolve().then(() => {
      time = Date.now() - time
      console.log(`ELAPSED: ${(time/1000).toFixed(3)} s`)
  })
}


/* GET users/auth/me check profile. */
router.get('/me', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with profile`});
});

/* POST users/auth/login login. */
router.post('/login', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with login`});
});

/* GET users/auth/logout to logout. */
router.get('/logout', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with logout`});
});

/* GET users/auth/refresh to refresh token. */
router.get('/refresh', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with refresh jwt token`});
});


module.exports = router;
