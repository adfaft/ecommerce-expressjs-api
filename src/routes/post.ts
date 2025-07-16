import express from 'express';
import PostController from '@app/modules/posts/posts.controller.js';

var router = express.Router();

/* GET posts listing. */
router.get('/', PostController.find);

/* POST posts/ create data. */
router.post('/',PostController.create);

/* GET posts/:id data. */
router.get('/:id', PostController.findByIdValidation, PostController.findById);

/* PUT posts/ data. */
router.put('/:id', PostController.updateById);

/* POST posts/update/:id data. */
router.post('/update/:id', PostController.updateById);

/* DELETE posts/:id data. */
router.delete('/:id', PostController.deleteById);

/* POST posts/delete/:id data. */
router.post('/delete/:id', PostController.deleteById);

export default router;
