async function loadTemplate(id, path) {
    const response = await fetch(path);
    const text = await response.text();
    document.getElementById(id).innerHTML = text;

    // After the template is loaded, initialize the menu toggle functionality
    if (id === 'header-placeholder') {
        initializeMenuToggle(); // Call the function to set up the menu
    }
}

function initializeMenuToggle() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('show');
            console.log('Menu toggled');
        });
    } else {
        console.error('Menu toggle or navigation element is missing');
    }
}

// Load templates
loadTemplate('header-placeholder', 'templates/header.html');
loadTemplate('footer-placeholder', 'templates/footer.html');
