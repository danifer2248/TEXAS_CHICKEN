document.addEventListener('DOMContentLoaded', () => {

  // 1. CARGAR Y GUARDAR CARRITO EN LOCALSTORAGE
  let cart = JSON.parse(localStorage.getItem('texasCart')) || [];

  // Elementos del DOM
  const cartCounter = document.getElementById('cart-counter');
  const cartBtn = document.getElementById('cart-btn');
  const cartDropdown = document.getElementById('cartDropdown');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartTotal = document.getElementById('cartTotal');
  const addButtons = document.querySelectorAll('.btn-add');

  const formLogin = document.getElementById('form-login');
  const formRegistro = document.getElementById('form-registro');

  // 2. FUNCIÓN PARA ACTUALIZAR LA VISTA DEL CARRITO
  function updateCartUI() {
    // Actualizar contador del Navbar
    if (cartCounter) {
      cartCounter.innerText = cart.length;
    }

    // Renderizar lista si existen los elementos del desplegable
    if (cartItemsList && cartTotal) {
      cartItemsList.innerHTML = '';

      if (cart.length === 0) {
        cartItemsList.innerHTML = '<li style="padding: 10px 0; color: #888;">El carrito está vacío.</li>';
      } else {
        cart.forEach((item) => {
          const li = document.createElement('li');
          li.className = 'cart-item';
          li.innerHTML = `
            <span>${item.name} - <strong>$${item.price.toFixed(2)}</strong></span>
            <button class="btn-remove" data-id="${item.id}" title="Quitar producto">&times;</button>
          `;
          cartItemsList.appendChild(li);
        });
      }

      // Calcular total
      const total = cart.reduce((sum, item) => sum + item.price, 0);
      cartTotal.innerText = total.toFixed(2);
    }

    // Guardar estado en localStorage
    localStorage.setItem('texasCart', JSON.stringify(cart));
  }

  // 3. AGREGAR PRODUCTOS AL CARRITO
  addButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Extrae la información desde el atributo onclick o directamente del HTML si no hay parámetros
      const card = button.closest('.card-product');
      let name = 'Producto';
      let price = 0;

      if (card) {
        name = card.querySelector('.card-title')?.innerText || 'Producto';
        const priceText = card.querySelector('.price')?.innerText || '$0';
        price = parseFloat(priceText.replace('$', '')) || 0;
      }

      // Crear ítem único
      const newItem = {
        id: Date.now() + Math.random(),
        name: name,
        price: price
      };

      cart.push(newItem);
      updateCartUI();

      // Desplegar menú del carrito para confirmar
      if (cartDropdown) {
        cartDropdown.classList.add('active');
      }
    });
  });

  // 4. QUITAR PRODUCTOS DEL CARRITO (Event Delegation)
  if (cartItemsList) {
    cartItemsList.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-remove')) {
        const idToRemove = parseFloat(e.target.getAttribute('data-id'));
        cart = cart.filter(item => item.id !== idToRemove);
        updateCartUI();
      }
    });
  }

  // 5. MOSTRAR / OCULTAR DESPLEGABLE DEL CARRITO
  if (cartBtn && cartDropdown) {
    cartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cartDropdown.classList.toggle('active');
    });

    // Cerrar el desplegable al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!cartDropdown.contains(e.target) && !cartBtn.contains(e.target)) {
        cartDropdown.classList.remove('active');
      }
    });
  }

  // 6. FORMULARIOS DE LOGIN Y REGISTRO
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('¡Inicio de sesión exitoso! Bienvenido a Texas Chicken.');
      formLogin.reset();
      window.location.href = 'menu.html';
    });
  }

  if (formRegistro) {
    formRegistro.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('¡Cuenta creada con éxito! Ya puedes realizar tu pedido.');
      formRegistro.reset();
      window.location.href = 'menu.html';
    });
  }

  // Carga inicial de la UI al abrir cualquier página
  updateCartUI();

});