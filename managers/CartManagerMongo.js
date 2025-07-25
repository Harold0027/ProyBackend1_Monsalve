const Cart = require('../models/Cart');

class CartManagerMongo {
    async createCart() {
        return await Cart.create({ products: [] });
    }

    async getCartById(id) {
        return await Cart.findById(id).populate('products.product');
    }

    async addProductToCart(cartId, productId) {
        const cart = await Cart.findById(cartId);
        const index = cart.products.findIndex(p => p.product.toString() === productId);

        if (index !== -1) {
            cart.products[index].quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        return await cart.save();
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await Cart.findById(cartId);
        cart.products = cart.products.filter(p => p.product.toString() !== productId);
        return await cart.save();
    }

    async updateCart(cartId, newProducts) {
        return await Cart.findByIdAndUpdate(cartId, { products: newProducts }, { new: true });
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId);
        const product = cart.products.find(p => p.product.toString() === productId);
        if (product) product.quantity = quantity;
        return await cart.save();
    }

    async clearCart(cartId) {
        const cart = await Cart.findById(cartId);
        cart.products = [];
        return await cart.save();
    }
}

module.exports = new CartManagerMongo();
