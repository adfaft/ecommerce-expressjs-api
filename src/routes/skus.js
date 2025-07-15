var express = require('express');
var router = express.Router();

const model = 'skus'; 


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


/* GET skus listing. */
router.get('/', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with query: ${model} list resource`});
});

/* POST skus/ create data. */
router.post('/', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with created: a ${model} resource`});
});

/* GET skus/:skudId data. */
router.get('/:skudId', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with query (id: ${req.params.skudId}): a ${model} resource`});
});

/* PUT skus/ data. */
router.put('/', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with update: a ${model} resource`});
});

/* POST skus/:skudId data. */
router.post('/:skudId', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with update (id: ${req.params.skudId}): a ${model} resource`});
});

/* DELETE skus/:skudId data. */
router.delete('/:skudId', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with delete (id: ${req.params.skudId}): a ${model} resource`});
});

module.exports = router;
