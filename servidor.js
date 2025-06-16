const express = require('express');
const ProductsManager = require('./ProductsManager');
const CartManager = require('./CartManager');

const app = express();
const PORT = 8080;

app.use(express.json());

const productManager = new ProductsManager('./products.json');
const cartManager = new CartManager('./cart.json');

//RUTAS PRODUCTS
app.get('/products', async(req, res)=>{
    try {
        const products = await productManager.getProducts()
        res.json({products})
    } catch (error) {
        res.status(500).json({error: 'Error interno del servidor'})
        console.error('Error al obtener producto:', error)
    }
})

app.get('/products/:pid', async(req,res)=>{
    try {
        const product = await productManager.getProductById(req.params.pid)
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product)
    } catch (error) {
        console.error('Error al obtener producto:', error)
        res.status(500).json({error: 'Error interno del servidor'})
    }
})

app.post('/products', async(req,res)=>{
    try {
        const product = await productManager.addProduct(req.body)
        res.status(201).json(product)
    } catch (error) {
        res.status(500).json({error: 'Error interno del servidor'})
        console.error("Error al añadir el producto")
    }
})

app.put('/products/:pid', async(req,res)=>{
    try {
        const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
if (!updatedProduct) {
    return res.status(500).json({ error: 'Producto no encontrado' });
}
res.json({ message: 'Producto actualizado', product: updatedProduct });
        
    } catch (error) {
        console.error('Error al actualizar el producto:', error)
        res.status(500).json({error: 'Error interno del servidor'})
    }
})
app.delete('/products/:pid', async(req,res)=>{
    try {
        const deleted = await productManager.deleteProduct(req.params.pid);
    if (!deleted) {
        return res.status(500).json({ error: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado con éxito' });  
    } catch (error) {
        console.error('Error al eliminar el producto:', error)
        res.status(500).json({error: 'Error interno del servidor'})
    }
})

//RUTAS CART
app.post('/api/carts', async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error al crear carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.get('/api/carts/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json(cart.products);
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
        if (!updatedCart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }
        res.json({ message: 'Producto agregado al carrito', cart: updatedCart });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});
app.listen(PORT, ()=>{
    console.log(`El servidor esta corriendo en: http://localhost:${PORT}`)
})