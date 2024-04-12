const express = require('express');
const {saveProducts, getProducts, updateProduct, getProductById, deleteProduct} = require('../controllers/productController');


const router = express.Router();

// adding products
router.post('/', saveProducts)

// get all products
router.get('/', getProducts)

// update product by id
router.put('/:id', updateProduct)

// get products by id
router.get('/:id', getProductById)

// delete product by id
router.delete('/:id',deleteProduct)

//exporting modules
module.exports = router;
