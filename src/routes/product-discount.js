var express = require('express');
var router = express.Router();

const model = 'products-discounts'; 


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


/* GET products/discount listing. */
router.get('/', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with query: ${model} list resource`});
});

/* POST products/discount/ create data. */
router.post('/', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with created: a ${model} resource`});
});

/* GET products/discount/:productDiscountId data. */
router.get('/:productDiscountId', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with query (id: ${req.params.productDiscountId}): a ${model} resource`});
});

/* PUT products/discount/ data. */
router.put('/', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with update: a ${model} resource`});
});

/* POST products/discount/:productDiscountId data. */
router.post('/:productDiscountId', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with update (id: ${req.params.productDiscountId}): a ${model} resource`});
});

/* DELETE products/discount/:productDiscountId data. */
router.delete('/:productDiscountId', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with delete (id: ${req.params.productDiscountId}): a ${model} resource`});
});

module.exports = router;
