const fs = require('fs').promises
class ProductsManager{
    constructor (path){
        this.path = path
    }

    async getProducts(){
        try {
            const data = await fs.readFile(this.path, 'utf-8')
            return(JSON.parse(data))
        } catch (error) {
            return[]
        }
    }
    async getProductById(id) { 
        try {
            const products = await this.getProducts()
            const productSearched = products.find(p=> p.id === parseInt(id))
            if(productSearched){return productSearched}
        } catch (error) {
            console.error(error)
        }
    }
   async addProduct(product){
    const {title, description, code, price, stock} = product;

    if(!title || !description || !code || !price || !stock){
        throw new Error("Faltan campos obligatorios");
    }

    const products = await this.getProducts();
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

    const newProduct = {
        id: newId,
        title,
        description,
        code,
        price,
        stock,
        status: product.status || "disponible",
        category: product.category || "general",
        thumbnails: product.thumbnails ? [product.thumbnails] : []
    };

    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));

    return newProduct;
    }

    async updateProduct(id, update){
        const products = await this.getProducts()
        const index = products.findIndex(p => p.id === parseInt(id))
        products[index] = {...products[index], ...update}
        await fs.writeFile(this.path, JSON.stringify(products))
        return products[index]
    }
    async deleteProduct(id) {
    const products = await this.getProducts();
    const index = products.findIndex(p => p.id === parseInt(id));

    if (index === -1) {
        return false; 
    }

    products.splice(index, 1); 
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return true; 
    }

}
module.exports = ProductsManager