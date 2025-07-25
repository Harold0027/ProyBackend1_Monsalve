const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');
const path = require('path');

const connectDB = require('./config/db');
const productsRouter = require('./routes/products.routes');
const cartsRouter = require('./routes/carts.routes');
const viewsRouter = require('./routes/views.routes');
const Product = require('./models/Product');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 8080;

// Conectar a MongoDB
connectDB();

// Handlebars config
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// WebSockets
io.on('connection', async (socket) => {
    console.log('🟢 Cliente conectado');

    const products = await Product.find();
    socket.emit('products', products);

    socket.on('newProduct', async (data) => {
        await Product.create(data);
        const updatedProducts = await Product.find();
        io.emit('products', updatedProducts);
    });

    socket.on('deleteProduct', async (id) => {
        await Product.findByIdAndDelete(id);
        const updatedProducts = await Product.find();
        io.emit('products', updatedProducts);
    });
});

httpServer.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
