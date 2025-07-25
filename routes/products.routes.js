const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManagerMongo');

router.get('/', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;
    const filter = query ? { $or: [{ category: query }, { status: query === 'true' }] } : {};
    const options = {
        limit: parseInt(limit),
        page: parseInt(page),
        sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined
    };

    const products = await ProductManager.getAll();
    res.json({ status: 'success', payload: products });
});

router.get('/:pid', async (req, res) => {
    const product = await ProductManager.getById(req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
});

router.post('/', async (req, res) => {
    const newProduct = await ProductManager.create(req.body);
    res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {
    const updatedProduct = await ProductManager.update(req.params.pid, req.body);
    if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(updatedProduct);
});

router.delete('/:pid', async (req, res) => {
    const deleted = await ProductManager.delete(req.params.pid);
    if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
});

module.exports = router;
