// app.js - Lógica completa de "ALEXIS TE BREGA" 🦇

// Firebase Config (REEMPLAZA CON TUS CREDENCIALES)
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:xxxxxxxxxxxxxxxx"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Estado global de la app
let cart = [];
let currentSection = 'home';
let isAdminLogged = false;
const ADMIN_PASSWORD = "alexis123"; // Cambia esta contraseña

// Datos estáticos
const streamingServices = [
    { id: 1, name: 'Netflix Premium', price: 12.99, image: 'https://via.placeholder.com/280x180/8b5cf6/ffffff?text=NETFLIX', type: 'streaming' },
    { id: 2, name: 'YouTube Music Premium', price: 9.99, image: 'https://via.placeholder.com/280x180/ff0000/ffffff?text=YOUTUBE+MUSIC', type: 'streaming' },
    { id: 3, name: 'HBO Max', price: 14.99, image: 'https://via.placeholder.com/280x180/002d73/ffffff?text=HBO+MAX', type: 'streaming' },
    { id: 4, name: 'Combo Completo (Todo)', price: 29.99, image: 'https://via.placeholder.com/280x180/8b5cf6/000000?text=COMBO+COMPLETO', type: 'streaming' }
];

const temuProducts = [
    { id: 5, name: 'Auriculares TWS Pro', price: 19.99, image: 'https://via.placeholder.com/280x180/10b981/ffffff?text=AURICULARES', link: 'https://temu.com/search?query=auriculares', type: 'temu' },
    { id: 6, name: 'Reloj Smart Watch', price: 29.99, image: 'https://via.placeholder.com/280x180/f59e0b/000000?text=RELOJ+SMART', link: 'https://temu.com/search?query=smartwatch', type: 'temu' },
    { id: 7, name: 'Camiseta Gaming RGB', price: 14.99, image: 'https://via.placeholder.com/280x180/ef4444/ffffff?text=CAMISETA', link: 'https://temu.com/search?query=camisetas', type: 'temu' },
    { id: 8, name: 'Power Bank 20000mAh', price: 24.99, image: 'https://via.placeholder.com/280x180/06b6d4/ffffff?text=POWER+BANK', link: 'https://temu.com/search?query=powerbank', type: 'temu' }
];

const homeOffers = [
    ...streamingServices.slice(0, 3),
    ...temuProducts.slice(0, 3)
];

// 🚀 Inicialización
document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    loadHomeContent();
    loadStreamingContent();
    loadTemuContent();
    loadMotoresContent();
    updateCart();
    setupCarousels();
});

// 🔄 Navegación entre secciones
function setupNavigation() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const section = e.currentTarget.dataset.section;
            if (section !== 'undefined') {
                switchSection(section);
            }
        });
    });
}

function switchSection(section) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    
    // Mostrar sección seleccionada
    document.getElementById(section).classList.add('active');
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    currentSection = section;
}

// 📦 Carrito de compras
function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCart();
    showNotification(`✅ ${item.name} agregado al carrito!`);
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCart();
}

function clearCart() {
    cart = [];
    updateCart();
}

function updateCart() {
    const cartElement = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cart.length === 0) {
        cartElement.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">🛒 Carrito vacío</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    cartElement.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
            <div style="flex: 1;">
                <div>${item.name}</div>
                <div style="color: var(--accent-neon); font-weight: bold;">$${item.price}</div>
                <div>Cantidad: <span style="color: var(--accent-glow);">${item.quantity}</span></div>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background: #ef4444; border: none; color: white; padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer;">❌</button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    cartTotal.textContent = total;
}

// 💳 Checkout WhatsApp
function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert('🛒 Carrito vacío!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    const itemsText = cart.map(item => `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}`).join('\n');
    
    const message = `🛒 *NUEVO PEDIDO*\n\n${itemsText}\n\n💰 *TOTAL: $${total}*\n📱 Envíame los datos de pago`;
    
    const whatsappUrl = `https://wa.me/18291234567?text=${encodeURIComponent(message)}`; // CAMBIA EL NÚMERO
    window.open(whatsappUrl, '_blank');
}

// 🔔 Notificaciones
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 100px; right: 20px; background: var(--accent-neon); 
        color: white; padding: 1rem 2rem; border-radius: 25px; z-index: 1002;
        box-shadow: var(--border-glow); font-weight: bold; transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// 🎠 Carousels con scroll
function setupCarousels() {
    document.querySelectorAll('.carousel-container').forEach(container => {
        container.addEventListener('wheel', (e) => {
            e.preventDefault();
            container.scrollLeft += e.deltaY;
        });
    });
}

// 📱 Contenido dinámico
function loadHomeContent() {
    const container = document.getElementById('home-top-offers');
    container.innerHTML = createCarouselItems(homeOffers);
    
    const bestSellers = document.getElementById('home-best-sellers');
    bestSellers.innerHTML = createCarouselItems([...streamingServices.slice(1, 3), ...temuProducts.slice(1, 3)]);
}

function loadStreamingContent() {
    const container = document.getElementById('streaming-carousel');
    container.innerHTML = createCarouselItems(streamingServices);
}

function loadTemuContent() {
    const container = document.getElementById('pedidos-carousel');
    container.innerHTML = createCarouselItems(temuProducts, true);
}

function loadMotoresContent() {
    loadMotoresFromFirebase();
}

// 🏍️ Firebase - Repuestos de Motores
async function loadMotoresFromFirebase() {
    try {
        const snapshot = await db.collection('motores').get();
        const container = document.getElementById('motores-carousel');
        
        if (snapshot.empty) {
            container.innerHTML = createDemoMotores();
            return;
        }
        
        container.innerHTML = snapshot.docs.map(doc => {
            const data = doc.data();
            return createMotorItem({
                id: doc.id,
                name: data.name,
                price: data.price,
                image: data.image || 'https://via.placeholder.com/280x180/6366f1/ffffff?text=MOTOR',
                type: 'motor'
            });
        }).join('');
    } catch (error) {
        console.error('Error loading motores:', error);
        document.getElementById('motores-carousel').innerHTML = createDemoMotores();
    }
}

function createDemoMotores() {
    return createCarouselItems([
        { id: 100, name: 'Filtro de Aire Yamaha', price: 15.99, image: 'https://via.placeholder.com/280x180/059669/ffffff?text=FILTRO+AIRE', type: 'motor' },
        { id: 101, name: 'Bujía NGK', price: 8.99, image: 'https://via.placeholder.com/280x180/ef4444/ffffff?text=BUJÍA', type: 'motor' },
        { id: 102, name: 'Cadena Motocicleta', price: 45.99, image: 'https://via.placeholder.com/280x180/f59e0b/000000?text=CADENA', type: 'motor' }
    ]);
}

// 🛠️ Generador de items del carousel
function createCarouselItems(items, isTemu = false) {
    return items.map(item => isTemu ? createTemuItem(item) : createItem(item)).join('');
}

function createItem(item) {
    return `
        <div class="carousel-item" onclick="handleItemClick('${item.type}', ${item.id})">
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-title">${item.name}</div>
            <div class="item-price">$${item.price}</div>
            <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${JSON.stringify(item).replace(/"/g, '&quot;')})">
                ➕ Agregar
            </button>
        </div>
    `;
}

function createTemuItem(item) {
    return `
        <div class="carousel-item">
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-title">${item.name}</div>
            <div class="item-price">$${item.price}</div>
            <a href="${item.link}" target="_blank" class="add-to-cart" style="text-decoration: none;">
                👀 Ver en Temu
            </a>
        </div>
    `;
}

function createMotorItem(item) {
    return createItem(item);
}

// 🔐 Panel Admin
function toggleAdmin() {
    document.getElementById('admin-panel').classList.toggle('active');
}

function loginAdmin() {
    const password = document.getElementById('admin-password').value;
    if (password === ADMIN_PASSWORD) {
        isAdminLogged = true;
        document.getElementById('admin-dashboard').style.display = 'block';
        document.querySelector('.admin-form').style.display = 'none';
        loadAdminStats();
        showNotification('✅ Admin logueado!');
    } else {
        showNotification('❌ Contraseña incorrecta!');
    }
}

async function loadAdminStats() {
    try {
        const ventasSnapshot = await db.collection('ventas').get();
        const clientesSnapshot = await db.collection('clientes').get();
        
        document.getElementById('admin-stats').innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;">
                <div style="background: rgba(139,92,246,0.2); padding: 1rem; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2rem; color: var(--accent-neon);">${ventasSnapshot.size}</div>
                    <div>Total Ventas</div>
                </div>
                <div style="background: rgba(139,92,246,0.2); padding: 1rem; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2rem; color: var(--accent-neon);">${clientesSnapshot.size}</div>
                    <div>Total Clientes</div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading admin stats:', error);
    }
}

async function addPart() {
    const name = document.getElementById('new-part-name').value;
    const price = parseFloat(document.getElementById('new-part-price').value);
    const image = document.getElementById('new-part-image').value;
    
    if (!name || !price || !image) {
        showNotification('❌ Completa todos los campos');
        return;
    }
    
    try {
        await db.collection('motores').add({
            name,
            price,
            image,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        showNotification('✅ Repuesto agregado!');
        loadMotoresContent();
        clearAdminForm();
    } catch (error) {
        console.error('Error adding part:', error);
        showNotification('❌ Error al agregar repuesto');
    }
}

function clearAdminForm() {
    document.getElementById('new-part-name').value = '';
    document.getElementById('new-part-price').value = '';
    document.getElementById('new-part-image').value = '';
}

// 🎯 Handlers
function handleItemClick(type, id) {
    if (type === 'streaming') {
        // Aquí puedes agregar modal con preview
        showNotification(`🎬 Preview de ${streamingServices.find(s => s.id == id)?.name}`);
    }
}

function toggleCart() {
    document.getElementById('cart').classList.toggle('open');
}

// 📱 PWA Ready
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}
