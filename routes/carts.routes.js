const express = require('express');
const router = express.Router();
const CartManager = require('../managers/CartManager');
const cartManager = new CartManager('./data/cart.json');

router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.json(carts);
    } catch (error) {
        console.error('Error al obtener carritos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error al crear carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
        res.json(cart.products);
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
        if (!updatedCart) return res.status(404).json({ error: 'Carrito no encontrado' });
        res.json({ message: 'Producto agregado al carrito', cart: updatedCart });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
