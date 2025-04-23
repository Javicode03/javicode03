document.addEventListener('DOMContentLoaded', function() {
    const footer = document.createElement('footer');
    footer.innerHTML = `
        <p>&copy; 2023 Tienda de Alimentos</p>
        <div class="contact-info">
            <p>WhatsApp: <a href="https://wa.me/5355543577">+53 5554 3577</a></p>
        </div>
    `;
    document.body.appendChild(footer);
});
