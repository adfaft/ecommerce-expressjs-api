var express = require('express');
var router = express.Router();

const model = 'posts'; 


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


/* GET posts listing. */
router.get('/', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with query: ${model} list resource`});
});

/* POST posts/ create data. */
router.post('/', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with created: a ${model} resource`});
});

/* GET posts/:postId data. */
router.get('/:postId', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with query (id: ${req.params.postId}): a ${model} resource`});
});

/* PUT posts/ data. */
router.put('/', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with update: a ${model} resource`});
});

/* POST posts/:postId data. */
router.post('/:postId', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with update (id: ${req.params.postId}): a ${model} resource`});
});

/* POST posts/update/:postId data. */
router.post('/update/:postId', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with update (id: ${req.params.postId}): a ${model} resource`});
});

/* DELETE posts/:postId data. */
router.delete('/:postId', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with delete (id: ${req.params.postId}): a ${model} resource`});
});

/* POST posts/delete/:postId data. */
router.post('/delete/:postId', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with delete (id: ${req.params.postId}): a ${model} resource`});
});

module.exports = router;
