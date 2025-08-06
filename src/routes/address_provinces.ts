import express from 'express';
import Controller from '@app/modules/address_provinces/provinces.controller.js';

var router = express.Router();

/* GET products/categories listing. */
router.get('/', Controller.find);

/* POST products/categories/ create data. */
router.post('/', Controller.create);

/* GET products/categories/:productCategoryId data. */
router.get('/:id', Controller.findById);

/* PUT products/categories/ data. */
router.put('/:id', Controller.updateById);

/* POST products/categories/:productCategoryId data. */
router.post('/update/:id', Controller.updateById);

/* DELETE products/categories/:productCategoryId data. */
router.delete('/:id', Controller.deleteById);

/* POST products/categories/delete/:id data. */
router.post('/delete/:id', Controller.deleteById);

export default router;
