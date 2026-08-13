document.addEventListener('DOMContentLoaded', () => {

  // Mantiene la cantidad del carrito entre navegación con localStorage
  let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;

  const cartCounter = document.getElementById('cart-counter');
  const cartBtn = document.getElementById('cart-btn');
  const addButtons = document.querySelectorAll('.btn-add');
  const formLogin = document.getElementById('form-login');
  const formRegistro = document.getElementById('form-registro');

  if (cartCounter) {
    cartCounter.innerText = cartCount;
  }

  // AGREGAR AL CARRITO
  addButtons.forEach(button => {
    button.addEventListener('click', () => {
      cartCount++;
      localStorage.setItem('cartCount', cartCount);
      if (cartCounter) cartCounter.innerText = cartCount;
    });
  });

  // BOTÓN DEL CARRITO
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      alert(`Tienes ${cartCount} producto(s) en tu carrito de compras.`);
    });
  }

  // ENVÍO DE FORMULARIO DE INICIO DE SESIÓN
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('¡Inicio de sesión exitoso! Bienvenido a Texas Chicken.');
      formLogin.reset();
      window.location.href = 'menu.html';
    });
  }

  // ENVÍO DE FORMULARIO DE REGISTRO
  if (formRegistro) {
    formRegistro.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('¡Cuenta creada con éxito! Ya puedes realizar tu pedido.');
      formRegistro.reset();
      window.location.href = 'menu.html';
    });
  }

});