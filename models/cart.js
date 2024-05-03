const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productPrice) {
        // Fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = {products: [], totalPrice: 0};
        if(! err) {
            cart = JSON.parse(fileContent);
        }
        // Analyze the cart => Find the existing product
        const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
        const existingProduct = cart.products[existingProductIndex];
        let updateProduct;
        // Add new product / Increase quantity
        if(existingProduct) {
            updateProduct = {...existingProduct};
            updateProduct.qty = updateProduct.qty + 1;
            cart.products = [...cart.products];
            cart.products[existingProductIndex] = updateProduct;
        } else {
            updateProduct = {id: id, qty: 1};
            cart.products = [...cart.products, updateProduct];
        }
        cart.totalPrice = cart.totalPrice + +productPrice;

        fs.writeFile(p, JSON.stringify(cart), err => {
            console.log(err);
        }) 
        });
    }
}