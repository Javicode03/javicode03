document.addEventListener('DOMContentLoaded', function() {
    setupProductControls();
});

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
                    existingProduct.quantity += product.quantity;
                } else {
                    cart.push(product);
                }
                
                localStorage.setItem('cart', JSON.stringify(cart));
                showNotification('Producto añadido al carrito');
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
