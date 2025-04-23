document.addEventListener('DOMContentLoaded', function() {
    setupQuantityControls();
    setupAddToCartButtons();
    updateCartDisplay();
});

function setupQuantityControls() {
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const input = this.parentElement.querySelector('.quantity-input');
            let currentValue = parseInt(input.value) || 1;
            
            if (this.classList.contains('plus')) {
                currentValue = Math.min(currentValue + 1, 99);
            } else if (this.classList.contains('minus')) {
                currentValue = Math.max(currentValue - 1, 1);
            }
            
            input.value = currentValue;
            
            // Update cart if we're in the cart page
            if (this.closest('.cart-item')) {
                updateItemQuantity(this.closest('.cart-item').dataset.productName, currentValue);
            }
        });
    });

    // Validate manual input
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            let value = parseInt(this.value) || 1;
            this.value = Math.max(1, Math.min(value, 99));
        });
    });
}

function setupAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const product = {
                name: card.querySelector('h3').textContent,
                price: parseFloat(card.querySelector('.price').textContent.replace('$', '')),
                quantity: parseInt(card.querySelector('.quantity-input').value)
            };
            addToCart(product);
        });
    });
}

function addToCart(product) {
    try {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProduct = cart.find(p => p.name === product.name);
        
        if (existingProduct) {
            existingProduct.quantity = Math.min(existingProduct.quantity + product.quantity, 99);
        } else {
            cart.push(product);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        showNotification('Producto añadido al carrito');
        updateCartBadge();
    } catch (error) {
        console.error('Error al añadir al carrito:', error);
        showNotification('Error al añadir al carrito', 'error');
    }
}

function updateCartDisplay() {
    const cartSection = document.querySelector('.cart-items');
    if (!cartSection) return;

    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            cartSection.innerHTML = '<p>Tu carrito está vacío</p>';
            return;
        }

        let total = 0;
        let html = '<div class="cart-list">';
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            html += `
                <div class="cart-item" data-product-name="${item.name}">
                    <h3>${item.name}</h3>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn minus">-</button>
                            <input type="number" value="${item.quantity}" min="1" max="99" class="quantity-input">
                            <button class="quantity-btn plus">+</button>
                        </div>
                        <p class="item-price">$${item.price}</p>
                        <p class="item-subtotal">$${itemTotal.toFixed(2)}</p>
                        <button onclick="removeFromCart('${item.name}')" class="remove-item">×</button>
                    </div>
                </div>
            `;
        });

        html += `</div>
            <div class="cart-total">
                <h2>Total: $${total.toFixed(2)}</h2>
                <button onclick="clearCart()" class="clear-cart">Vaciar Carrito</button>
                <button onclick="checkout()" class="checkout-btn">Finalizar Compra</button>
            </div>`;
        
        cartSection.innerHTML = html;
        setupQuantityControls();
    } catch (error) {
        console.error('Error al mostrar el carrito:', error);
        cartSection.innerHTML = '<p>Error al cargar el carrito</p>';
    }
}

function updateItemQuantity(productName, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(p => p.name === productName);
    if (item) {
        item.quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

function removeFromCart(productName) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.name !== productName);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartDisplay();
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

function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    let badge = document.querySelector('.cart-badge');
    if (!badge) {
        badge = document.createElement('span');
        badge.className = 'cart-badge';
        document.querySelector('a[href="cart.html"]').appendChild(badge);
    }
    badge.textContent = totalItems || '';
    badge.style.display = totalItems ? 'block' : 'none';
}

function checkout() {
    // Implementar lógica de checkout aquí
    alert('Función de checkout en desarrollo');
}
