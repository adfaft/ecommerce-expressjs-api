var express = require('express');
var router = express.Router();

const model = 'orders'; 


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


/* GET orders listing. */
router.get('/', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with query: ${model} list resource`});
});

/* POST orders/ create data. */
router.post('/', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with created: a ${model} resource`});
});

/* GET orders/:orderId data. */
router.get('/:orderId', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with query (id: ${req.params.orderId}): a ${model} resource`});
});

/* PUT orders/ data. */
router.put('/', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with update: a ${model} resource`});
});

/* POST orders/:orderId data. */
router.post('/', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with update (id: ${req.params.orderId}): a ${model} resource`});
});

/* DELETE orders/:orderId data. */
router.delete('/:orderId', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with delete (id: ${req.params.orderId}): a ${model} resource`});
});

module.exports = router;
