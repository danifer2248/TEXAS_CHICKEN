// ESPERAR A QUE EL DOM ESTÉ COMPLETAMENTE CARGADO
document.addEventListener('DOMContentLoaded', () => {

  let cartCount = 0;

  // ELEMENTOS DEL DOM
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.page-section');
  const logoBtn = document.getElementById('logo-btn');
  const heroOrderBtn = document.getElementById('btn-hero-order');
  const cartBtn = document.getElementById('cart-btn');
  const cartCounter = document.getElementById('cart-counter');
  const addButtons = document.querySelectorAll('.btn-add');
  const formLogin = document.getElementById('form-login');
  const formRegistro = document.getElementById('form-registro');

  // NAVEGACIÓN ENTRE VENTANAS
  function navigateTo(targetId) {
    // Ocultar todas las secciones
    sections.forEach(sec => sec.classList.remove('active'));

    // Quitar la clase active de los links
    navItems.forEach(item => item.classList.remove('active'));

    // Mostrar la ventana seleccionada
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.add('active');
    }

    // Marcar el menú activo
    const activeNav = document.getElementById(`nav-${targetId}`);
    if (activeNav) {
      activeNav.classList.add('active');
    }

    // Scroll arriba
    window.scrollTo(0, 0);
  }

  // EVENTOS PARA LOS LINKS DE LA BARRA DE NAVEGACIÓN
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const target = e.target.getAttribute('data-target');
      navigateTo(target);
    });
  });

  // LOGO REDIRIGE A INICIO
  logoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('inicio');
  });

  // BOTÓN DEL HERO
  heroOrderBtn.addEventListener('click', () => {
    navigateTo('menu');
  });

  // AGREGAR PRODUCTOS AL CARRITO
  addButtons.forEach(button => {
    button.addEventListener('click', () => {
      cartCount++;
      cartCounter.innerText = cartCount;
    });
  });

  // CLICK EN EL BOTÓN DEL CARRITO
  cartBtn.addEventListener('click', () => {
    alert(`Tienes ${cartCount} producto(s) en tu carrito de compras.`);
  });

  // MANEJO DE INICIO DE SESIÓN
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('¡Inicio de sesión exitoso! Bienvenido a Texas Chicken.');
    formLogin.reset();
    navigateTo('menu');
  });

  // MANEJO DE REGISTRO
  formRegistro.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('¡Cuenta creada con éxito! Ya puedes realizar tu pedido.');
    formRegistro.reset();
    navigateTo('menu');
  });

});