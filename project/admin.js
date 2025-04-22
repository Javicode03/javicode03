const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

document.addEventListener('DOMContentLoaded', function() {
    const adminForm = document.querySelector('.admin-form');
    if (adminForm) {
        adminForm.addEventListener('submit', handleAdminLogin);
    }

    if (isAdminAuthenticated()) {
        showProductManagement();
    }
});

function handleAdminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem('adminAuthenticated', 'true');
        showProductManagement();
    } else {
        alert('Credenciales incorrectas');
    }
}

function isAdminAuthenticated() {
    return localStorage.getItem('adminAuthenticated') === 'true';
}

function showProductManagement() {
    const mainContent = document.querySelector('main');
    mainContent.innerHTML = `
        <div class="admin-panel">
            <div class="admin-header">
                <h2>Panel de Administración de Productos</h2>
                <button class="add-product-btn" onclick="showAddProductForm()">
                    <span>+</span> Agregar Nuevo Producto
                </button>
            </div>
            <div id="productForm" class="product-form-container"></div>
            <div id="productsList" class="products-admin-grid"></div>
        </div>
    `;
    loadProducts();
}

function showAddProductForm(productData = null) {
    const formContainer = document.getElementById('productForm');
    formContainer.innerHTML = `
        <form class="product-edit-form" onsubmit="handleProductSubmit(event, ${productData ? productData.id : null})">
            <div class="form-header">
                <h3>${productData ? 'Editar' : 'Agregar'} Producto</h3>
                <button type="button" onclick="closeForm()" class="close-btn">×</button>
            </div>
            <div class="form-grid">
                <div class="form-group">
                    <label>Nombre del Producto</label>
                    <input type="text" name="name" value="${productData ? productData.name : ''}" required>
                </div>
                <div class="form-group">
                    <label>Precio</label>
                    <input type="number" step="0.01" name="price" value="${productData ? productData.price : ''}" required>
                </div>
                <div class="form-group">
                    <label>Imagen URL</label>
                    <input type="text" name="image" value="${productData ? productData.image : ''}" required 
                           onchange="previewImage(this.value)">
                </div>
                <div class="form-group">
                    <label>Descripción</label>
                    <textarea name="description" required>${productData ? productData.description : ''}</textarea>
                </div>
                <div class="form-group">
                    <label>Categoría</label>
                    <select name="category" required>
                        <option value="confituras">Confituras</option>
                        <option value="comidas">Comidas</option>
                        <option value="bebidas">Bebidas</option>
                    </select>
                </div>
            </div>
            <div class="image-preview" id="imagePreview"></div>
            <button type="submit" class="submit-btn">${productData ? 'Actualizar' : 'Agregar'} Producto</button>
        </form>
    `;
}

function handleProductSubmit(e, productId) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
        id: productId || Date.now(),
        name: formData.get('name'),
        price: parseFloat(formData.get('price')),
        image: formData.get('image'),
        description: formData.get('description'),
        category: formData.get('category')
    };

    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    if (productId) {
        products = products.map(p => p.id === productId ? productData : p);
    } else {
        products.push(productData);
    }

    localStorage.setItem('products', JSON.stringify(products));
    loadProducts();
    closeForm();
    updateProductsPage();
}

function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productsContainer = document.getElementById('productsList');
    
    let html = '<div class="products-grid">';
    products.forEach(product => {
        html += `
            <div class="admin-product-card">
                <img src="${product.image}" alt="${product.name}">
                <h4>${product.name}</h4>
                <p>$${product.price}</p>
                <p>Categoría: ${product.category}</p>
                <div class="admin-actions">
                    <button onclick="editProduct(${product.id})">Editar</button>
                    <button onclick="deleteProduct(${product.id})">Eliminar</button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    productsContainer.innerHTML = html;
}

function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    if (product) {
        showAddProductForm(product);
    }
}

function deleteProduct(productId) {
    if (confirm('¿Está seguro de eliminar este producto?')) {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products = products.filter(p => p.id !== productId);
        localStorage.setItem('products', JSON.stringify(products));
        loadProducts();
    }
}

function updateProductsPage() {
    // Dispatch event to notify products page of changes
    window.dispatchEvent(new CustomEvent('productsUpdated'));
}

function closeForm() {
    document.getElementById('productForm').innerHTML = '';
}

function previewImage(url) {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = url ? `<img src="${url}" alt="Preview">` : '';
}
