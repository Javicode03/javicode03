document.addEventListener('DOMContentLoaded', function() {
    setupQuantityControls();
    setupAddToCartButtons();
    updateCart();
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
        });
    });

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
        updateCartBadge();
    } catch (error) {
        console.error('Error al añadir al carrito:', error);
    }
}

function updateCart() {
    const cartSection = document.querySelector('.cart-items');
    if (!cartSection) return;

    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            cartSection.innerHTML = '<p>Tu carrito está vacío</p>';
            return;
        }

        let total = 0;
        let html = '<table class="cart-table"><thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Total</th><th>Acciones</th></tr></thead><tbody>';
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            html += `
                <tr>
                    <td>${item.name}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <div class="quantity-controls">
                            <button class="quantity-btn minus" onclick="updateQuantity(${index}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn plus" onclick="updateQuantity(${index}, 1)">+</button>
                        </div>
                    </td>
                    <td>$${itemTotal.toFixed(2)}</td>
                    <td><button onclick="removeItem(${index})" class="remove-item">×</button></td>
                </tr>
            `;
        });

        html += `</tbody></table>
            <div class="cart-total">
                <h2>Total: $${total.toFixed(2)}</h2>
                <button onclick="clearCart()" class="clear-cart">Vaciar Carrito</button>
                <button onclick="sendToWhatsApp()" class="submit-btn">Realizar Pedido</button>
            </div>`;
        
        cartSection.innerHTML = html;
    } catch (error) {
        console.error('Error al mostrar el carrito:', error);
        cartSection.innerHTML = '<p>Error al cargar el carrito</p>';
    }
}

function updateQuantity(index, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity = Math.max(1, cart[index].quantity + change);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCart();
    updateCartBadge();
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

function sendToWhatsApp() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    let message = '*Nuevo Pedido*%0A%0A';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `*${item.name}*%0A`;
        message += `Cantidad: ${item.quantity}%0A`;
        message += `Precio: $${item.price.toFixed(2)}%0A`;
        message += `Subtotal: $${itemTotal.toFixed(2)}%0A%0A`;
    });

    message += `*Total del Pedido: $${total.toFixed(2)}*`;
    window.open(`https://wa.me/5355543577?text=${message}`, '_blank');
}
