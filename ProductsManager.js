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
        const {title, description, code, price, status, stock, category, thumbnails} = product 
        if(!title || !description || !code || !price || !status || !stock || !category || !thumbnails){
            throw new Error("Todos los campos son obligatorios")
        }
        const products = await this.getProducts()
        const newProduct = {
            id: products.length + 1,
            title,
            description,
            code,
            price,
            status,
            stock, 
            category,
            thumbnails
        }
        products.push(newProduct)
        await fs.writeFile(this.path, JSON.stringify(products, null, 2))

        return newProduct
    }
    async updateProduct(id, update){
        const products = await this.getProducts()
        const index = products.findIndex(p => p.id === parseInt(id))
        products[index] = {...products[index], ...update}
        await fs.writeFile(this.path, JSON.stringify(products))
        return products[index]
    }
    async deleteProduct(id){
        const products = await this.getProducts()
        const filtered = products.filter(p => p.id !== parseInt(id))
        await fs.writeFile(this.path, JSON.stringify(filtered))
    }
}
module.exports = ProductsManager