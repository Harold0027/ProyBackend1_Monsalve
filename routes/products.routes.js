const express = require('express');
const router = express.Router();
const ProductsManager = require('../managers/ProductsManager');
const productManager = new ProductsManager('./data/products.json');

router.get('/', async (req, res) => {  // antes: /api/products
    const products = await productManager.getProducts();
    res.json({ products });
});

router.get('/:pid', async (req, res) => {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
});

router.post('/', async (req, res) => {
    const product = await productManager.addProduct(req.body);
    res.status(201).json(product);
});

router.put('/:pid', async (req, res) => {
    const updated = await productManager.updateProduct(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto actualizado', product: updated });
});

router.delete('/:pid', async (req, res) => {
    const deleted = await productManager.deleteProduct(req.params.pid);
    if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado con éxito' });
});

module.exports = router;
