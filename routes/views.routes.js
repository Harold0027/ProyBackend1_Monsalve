const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManagerMongo');
const CartManager = require('../managers/CartManagerMongo');

router.get('/products', async (req, res) => {
    const products = await ProductManager.getAll();
    res.render('home', { products });
});

router.get('/products/:pid', async (req, res) => {
    const product = await ProductManager.getById(req.params.pid);
    if (!product) return res.status(404).send('Producto no encontrado');
    res.render('productDetails', { product });
});

router.get('/carts/:cid', async (req, res) => {
    const cart = await CartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.render('cart', { cart });
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});

module.exports = router;
