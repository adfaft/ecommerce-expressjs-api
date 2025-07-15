var express = require('express');
var router = express.Router();

const model = require('../database/models/post.schema'); 


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

  const alldata = model.find();

  res.json({data : alldata});
});

/* POST posts/ create data. */
router.post('/', async function(req, res, next) {
  await beforeRenderHook(req, res, next);

  const data = new model(req.body);
  await data.save();
  
  res.json({data : data});
});

/* GET posts/:postId data. */
router.get('/:postId', async function(req, res, next) {
  await beforeRenderHook(req, res, next);

  const data = model.findById(req.params.postId)

  res.json({data : data});
});

/* PUT posts/ data. */
router.put('/:postId', async function(req, res, next) {
  await beforeRenderHook(req, res, next);
  res.json({data : `respond with update: a ${model} resource`});
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
