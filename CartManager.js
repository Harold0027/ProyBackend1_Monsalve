const fs = require('fs').promises

class CartManager{
    constructor(path){
        this.path = path
    }
    async getCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }
    async addCart() {
        const carts = await this.getCarts();
        const newCart = { id: carts.length + 1, products: [] };
        carts.push(newCart);
        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return newCart;
    }
    async getCartById(cid) {
        const carts = await this.getCarts();
        return carts.find(cart => cart.id === parseInt(cid));
    }
    async addProductToCart(cid, pid) {
        const carts = await this.getCarts();
        const cart = carts.find(c => c.id === parseInt(cid));
        if (!cart) return null;

        const productIndex = cart.products.findIndex(p => p.product === parseInt(pid));
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: parseInt(pid), quantity: 1 });
        }

        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        return cart;
    }
}

module.exports = CartManager