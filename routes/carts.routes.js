    const express = require('express');
    const router = express.Router();
    const CartManager = require('../managers/CartManagerMongo');

    router.post('/', async (req, res) => {
        const newCart = await CartManager.createCart();
        res.status(201).json(newCart);
    });

    router.get('/:cid', async (req, res) => {
        const cart = await CartManager.getCartById(req.params.cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
        res.json(cart);
    });

    router.post('/:cid/products/:pid', async (req, res) => {
        const cart = await CartManager.addProductToCart(req.params.cid, req.params.pid);
        res.json(cart);
    });

    router.delete('/:cid/products/:pid', async (req, res) => {
        const cart = await CartManager.removeProductFromCart(req.params.cid, req.params.pid);
        res.json(cart);
    });

    router.put('/:cid', async (req, res) => {
        const cart = await CartManager.updateCart(req.params.cid, req.body.products);
        res.json(cart);
    });

    router.put('/:cid/products/:pid', async (req, res) => {
        const cart = await CartManager.updateProductQuantity(
            req.params.cid,
            req.params.pid,
            req.body.quantity
        );
        res.json(cart);
    });

    router.delete('/:cid', async (req, res) => {
        const cart = await CartManager.clearCart(req.params.cid);
        res.json(cart);
    });

    module.exports = router;
