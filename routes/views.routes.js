const express = require('express');
const router = express.Router();
const ProductsManager = require('../managers/ProductsManager');
const productManager = new ProductsManager('./data/products.json');

router.get('/', async (req, res) => {
    const products = await product
    
    Manager.getProducts();
    res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

module.exports = router;
