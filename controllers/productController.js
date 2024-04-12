const Product =  require('../models/productModel');
const asyncHandler = require('express-async-handler')

// adding products
const saveProducts = asyncHandler (async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (error) {
        res.status(500);
        throw new Error(error.message)
    }
})

// get all products
const getProducts = asyncHandler (async(req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        // console.log(error.message);
        // res.status(500).json({message: error.message});
        res.status(500);
        throw new Error(error.message)
    }
})

// update product by id
const updateProduct = asyncHandler (async (req, res)=> {
    try {
        const {id} = req.params;
        const product  = await Product.findByIdAndUpdate(id, req.body);
        if(!product){
            //return res.status(404).json({message: `Product not found with id ${id}`})
            res.status(404);
            throw new Error(`Product not found with id ${id}`)
        }
        const updatedProduct = await Product.findById(id)
        res.status(200).json(updatedProduct);
    } catch (error) {
        // res.status(500).json({message: error.message});
        res.status(500);
        throw new Error(error.message)
    }
})

// get products by id
const getProductById = asyncHandler (async (req, res)=> {
    try {
        const {id} = req.params; // look this topic
        const product = await Product.findById(id)
        res.status(200).json(product);
    } catch (error) {
        res.status(500);
        throw new Error(error.message)
        // console.log(error.message);
        // res.status(500).json({message: error.message});
    }
})

// delete product by id
const deleteProduct =  asyncHandler (async (req, res)=> {
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            res.status(404);
            throw new Error(`product not found with id ${id}`)
            //return res.status(404).json({message: `product not found with id ${id}`})
        }
        return res.status(200).json(product);
    } catch (error) {
        res.status(500);
        throw new Error(error.message)
    }
})


module.exports = {
    saveProducts,
    getProducts,
    updateProduct,
    getProductById,
    deleteProduct
}

