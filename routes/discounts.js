var express = require('express');
var router = express.Router();

const model = 'discounts'; 


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


/* GET discounts listing. */
router.get('/', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with query: ${model} list resource`});
});

/* POST discounts/ create data. */
router.post('/', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with created: a ${model} resource`});
});

/* GET discounts/:discountId data. */
router.get('/:discountId', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with query (id: ${req.params.discountId}): a ${model} resource`});
});

/* PUT discounts/ data. */
router.put('/', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with update: a ${model} resource`});
});

/* POST discounts/:discountId data. */
router.post('/:discountId', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with update (id: ${req.params.discountId}): a ${model} resource`});
});

/* DELETE discounts/:discountId data. */
router.delete('/:discountId', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with delete (id: ${req.params.discountId}): a ${model} resource`});
});

module.exports = router;
