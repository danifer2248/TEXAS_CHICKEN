document.addEventListener('DOMContentLoaded', () => {

  // 1. CARGAR Y GUARDAR CARRITO
  let cart = JSON.parse(localStorage.getItem('texasCart')) || [];

  // Elementos DOM
  const cartCounter = document.getElementById('cart-counter');
  const cartBtn = document.getElementById('cart-btn');
  const cartDropdown = document.getElementById('cartDropdown');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartTotal = document.getElementById('cartTotal');
  const addButtons = document.querySelectorAll('.btn-add');
  const formLogin = document.getElementById('form-login');
  const formRegistro = document.getElementById('form-registro');
  const authLinks = document.querySelectorAll('[data-auth-link]');
  const logoutBtn = document.getElementById('logout-btn');
  
  // Elementos Responsive
  const mobileMenuBtn = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');

  // --- INYECCIÓN DE COMPONENTES UI (TOAST Y MODAL) ---
  injectUIComponents();

  // Funciones de Autenticación
  function isLoggedIn() { return localStorage.getItem('texasLoggedIn') === 'true'; }

  function toggleAuthNav() {
    const logged = isLoggedIn();
    authLinks.forEach(link => {
      const shouldHide = logged && (link.dataset.authLink === 'login' || link.dataset.authLink === 'register');
      link.classList.toggle('hidden', shouldHide);
    });
    if (logoutBtn) logoutBtn.classList.toggle('hidden', !logged);
  }

  // Menú Hamburguesa Móvil
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // 2. ACTUALIZAR VISTA DEL CARRITO
  function updateCartUI() {
    if (cartCounter) cartCounter.innerText = cart.length;

    if (cartItemsList && cartTotal) {
      cartItemsList.innerHTML = '';
      if (cart.length === 0) {
        cartItemsList.innerHTML = '<li style="padding: 10px 0; color: #888;">El carrito está vacío.</li>';
      } else {
        cart.forEach((item) => {
          const li = document.createElement('li');
          li.className = 'cart-item';
          li.innerHTML = `
            <span>${item.name} - <strong>Bs.${item.price.toFixed(2)}</strong></span>
            <button class="btn-remove" data-id="${item.id}" title="Quitar producto">&times;</button>
          `;
          cartItemsList.appendChild(li);
        });
      }

      const total = cart.reduce((sum, item) => sum + item.price, 0);
      cartTotal.innerText = total.toFixed(2);

      // Botón "Realizar pedido"
      let checkoutBtn = document.getElementById('btn-checkout');
      if (cart.length > 0) {
        if (!checkoutBtn) {
          checkoutBtn = document.createElement('button');
          checkoutBtn.id = 'btn-checkout';
          checkoutBtn.className = 'btn-submit';
          checkoutBtn.style.marginTop = '12px';
          checkoutBtn.innerText = 'Realizar pedido';

          // --- LOGICA MEJORADA DE CIERRE DE PEDIDO ---
          checkoutBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Generar número de orden aleatorio
            const orderNum = Math.floor(Math.random() * 90000) + 10000;
            const finalTotal = cartTotal.innerText;
            const itemsCount = cart.length;

            // Rellenar datos del Modal
            document.getElementById('order-number').innerText = `#TX-${orderNum}`;
            document.getElementById('order-summary-content').innerHTML = `
                <p><strong>Productos:</strong> ${itemsCount} items</p>
                <p><strong>Total a pagar:</strong> Bs. ${finalTotal}</p>
            `;

            // Mostrar Modal persistente
            document.getElementById('checkout-modal').classList.add('active');

            // Vaciar carrito
            cart = [];
            updateCartUI();
            if (cartDropdown) cartDropdown.classList.remove('active');
          });

          cartDropdown.appendChild(checkoutBtn);
        }
      } else if (checkoutBtn) {
        checkoutBtn.remove();
      }
    }
    localStorage.setItem('texasCart', JSON.stringify(cart));
  }

  // 3. AGREGAR PRODUCTOS CON ALERTA TOAST
  addButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (!isLoggedIn()) {
        alert('Debes iniciar sesión para agregar productos.');
        window.location.href = 'login.html';
        return;
      }

      const card = button.closest('.card-product');
      let name = card ? card.querySelector('.card-title').innerText : 'Producto';
      let priceText = card ? card.querySelector('.price').innerText : 'Bs.0';
      let price = parseFloat(priceText.replace('Bs.', '')) || 0;

      cart.push({ id: Date.now() + Math.random(), name, price });
      updateCartUI();

      // Mostrar Notificación Inmediata en lugar de abrir el carrito directamente
      showToast(`<strong>${name}</strong> agregada al pedido · <a href="#" id="open-cart-link" style="color:var(--secondary-yellow);">Ver carrito</a>`);
      
      // Permitir abrir el carrito desde el toast
      setTimeout(() => {
          const openLink = document.getElementById('open-cart-link');
          if(openLink) openLink.addEventListener('click', (e) => {
              e.preventDefault();
              cartDropdown.classList.add('active');
          });
      }, 50);
    });
  });

  // 4. QUITAR PRODUCTOS DEL CARRITO
  if (cartItemsList) {
    cartItemsList.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-remove')) {
        e.stopPropagation();
        const idToRemove = parseFloat(e.target.getAttribute('data-id'));
        cart = cart.filter(item => item.id !== idToRemove);
        updateCartUI();
      }
    });
  }

  // 5. EVENTOS DEL CARRITO
  if (cartBtn && cartDropdown) {
    cartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cartDropdown.classList.toggle('active');
    });
    cartDropdown.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', () => cartDropdown.classList.remove('active'));
  }

  // 6. FORMULARIOS LOGIN/REGISTRO
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      localStorage.setItem('texasLoggedIn', 'true');
      alert('¡Inicio de sesión exitoso!');
      window.location.href = 'menu.html';
    });
  }

  if (formRegistro) {
    formRegistro.addEventListener('submit', (e) => {
      e.preventDefault();
      localStorage.setItem('texasLoggedIn', 'true');
      alert('¡Cuenta creada con éxito!');
      window.location.href = 'menu.html';
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('texasLoggedIn');
      alert('Has cerrado sesión.');
      window.location.href = 'index.html';
    });
  }

  // INICIALIZACIÓN
  toggleAuthNav();
  updateCartUI();

  // --- FUNCIONES DE AYUDA (MODAL Y TOAST) ---
  function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `✅ <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s forwards';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function injectUIComponents() {
    // Inyectar contenedor Toast
    if (!document.getElementById('toast-container')) {
      const toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }

    // Inyectar Modal de Checkout
    if (!document.getElementById('checkout-modal')) {
      const modal = document.createElement('div');
      modal.id = 'checkout-modal';
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-content">
          <span class="modal-close" id="modal-close">&times;</span>
          <h2>¡Pedido Confirmado! 🎉</h2>
          <p>Tu orden <strong id="order-number" style="color:var(--primary-red);"></strong> ha sido registrada.</p>
          
          <div class="order-summary-box" id="order-summary-content"></div>
          
          <p class="modal-next-steps">
            <strong>Siguiente paso:</strong><br>
            Estamos preparando tu comida. El tiempo estimado de entrega es de <strong>30 a 45 minutos</strong>.<br><br>
            Nos contactaremos a tu número para coordinar la entrega.
          </p>
          <button class="btn-submit" id="btn-close-modal">Entendido</button>
        </div>
      `;
      document.body.appendChild(modal);

      // Eventos para cerrar el modal
      const closeModal = () => modal.classList.remove('active');
      document.getElementById('modal-close').addEventListener('click', closeModal);
      document.getElementById('btn-close-modal').addEventListener('click', closeModal);
    }
  }
});