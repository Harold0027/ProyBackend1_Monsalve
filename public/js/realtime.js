const socket = io();

const productList = document.getElementById('product-list');
const productForm = document.getElementById('product-form');
const deleteForm = document.getElementById('delete-form');

socket.on('products', (products) => {
    productList.innerHTML = '';
    products.forEach((product) => {
        const li = document.createElement('li');
        li.textContent = `${product.title} - $${product.price}`;
        productList.appendChild(li);
    });
});

productForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(productForm);
    const product = Object.fromEntries(formData.entries());
    product.price = parseFloat(product.price);
    socket.emit('newProduct', product);
    productForm.reset();
});

deleteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = deleteForm.id.value;
    socket.emit('deleteProduct', id);
    deleteForm.reset();
});
