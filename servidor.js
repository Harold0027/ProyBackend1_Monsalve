const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');
const productsRouter = require('./routes/products.routes');
const cartsRouter = require('./routes/carts.routes');


const ProductsManager = require('./managers/ProductsManager');
const productManager = new ProductsManager('./data/products.json');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const PORT = 8080;

// Handlebars config
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const viewsRouter = require('./routes/views.routes');
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


// WebSockets
io.on('connection', async (socket) => {
    console.log('🟢 Cliente conectado');

    socket.emit('products', await productManager.getProducts());

    socket.on('newProduct', async (product) => {
        await productManager.addProduct(product);
        io.emit('products', await productManager.getProducts());
    });

    socket.on('deleteProduct', async (id) => {
        await productManager.deleteProduct(id);
        io.emit('products', await productManager.getProducts());
    });
});

httpServer.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
