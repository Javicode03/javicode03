document.addEventListener('DOMContentLoaded', function() {
    loadProductsFromStorage();
    setupProductControls();
});

window.addEventListener('productsUpdated', loadProductsFromStorage);

function loadProductsFromStorage() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const categories = ['confituras', 'comidas', 'bebidas'];
    
    categories.forEach(category => {
        const categoryProducts = products.filter(p => p.category === category);
        const container = document.querySelector(`#${category} .product-grid`);
        if (container) {
            container.innerHTML = categoryProducts.map(product => `
                <div class="product-card">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <span class="price">$${product.price}</span>
                    <div class="quantity-controls">
                        <button class="quantity-btn minus">-</button>
                        <input type="number" value="1" min="1" class="quantity-input">
                        <button class="quantity-btn plus">+</button>
                    </div>
                    <button class="add-to-cart" onclick="addToCart(${product.id}, '${product.name}', ${product.price})">
                        Añadir al carrito
                    </button>
                </div>
            `).join('');
        }
    });
    
    setupProductControls();
}

function setupProductControls() {
    // Configurar controles de cantidad
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            const currentValue = parseInt(input.value) || 1;
            
            if (this.classList.contains('plus')) {
                input.value = Math.min(currentValue + 1, 99);
            } else if (this.classList.contains('minus')) {
                input.value = Math.max(currentValue - 1, 1);
            }
        });
    });

    // Configurar botones de añadir al carrito
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const product = {
                name: card.querySelector('h3').textContent,
                price: parseFloat(card.querySelector('.price').textContent.replace('$', '')),
                quantity: parseInt(card.querySelector('.quantity-input').value)
            };
            
            try {
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingProduct = cart.find(p => p.name === product.name);
                
                if (existingProduct) {
                    existingProduct.quantity = product.quantity;
                } else {
                    cart.push(product);
                }
                
                localStorage.setItem('cart', JSON.stringify(cart));
                showNotification('Producto añadido');
            } catch (error) {
                console.error('Error al añadir al carrito:', error);
                showNotification('Error al añadir al carrito', 'error');
            }
        });
    });
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
