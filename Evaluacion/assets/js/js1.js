document.addEventListener('DOMContentLoaded', function () {

  // --- 1. MODO OSCURO / CLARO ---
  const themeToggleDesk = document.getElementById('theme-toggle');
  const themeToggleMob = document.getElementById('theme-toggle-mobile');
  const body = document.body;

  // Como tu CSS por defecto es oscuro, revisamos si el usuario guardó el "modo claro"
  if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
  }

  // Función para alternar el tema
  function toggleTheme(e) {
    e.preventDefault();
    body.classList.toggle('light-mode');
    
    // Guardar estado en localStorage
    if (body.classList.contains('light-mode')) {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.setItem('theme', 'dark');
    }
  }

  if (themeToggleDesk) themeToggleDesk.addEventListener('click', toggleTheme);
  if (themeToggleMob) themeToggleMob.addEventListener('click', toggleTheme);


  // --- 2. MENÚ DE NAVEGACIÓN DINÁMICO Y ACCESIBILIDAD ---
  // (Reemplazamos la librería de Materialize por código JS puro)
  const menuTrigger = document.getElementById('menu-trigger');
  const mobileMenu = document.getElementById('mobile-menu');
  let menuOpen = false;

  if (menuTrigger && mobileMenu) {
    menuTrigger.addEventListener('click', function(e) {
      e.preventDefault();
      menuOpen = !menuOpen;
      
      if (menuOpen) {
        // Abrir menú
        mobileMenu.classList.add('open');
        menuTrigger.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
        
        // Accesibilidad: Enviar el foco al primer enlace del menú
        const primerEnlace = mobileMenu.querySelector('a');
        if (primerEnlace) primerEnlace.focus();
      } else {
        // Cerrar menú
        mobileMenu.classList.remove('open');
        menuTrigger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        
        // Accesibilidad: Devolver el foco al botón que lo abrió
        menuTrigger.focus();
      }
    });
  }


  // --- 3. FORMULARIO: VALIDACIÓN Y SANITIZACIÓN XSS ---
  const form = document.getElementById('contact-form');

  // Función para prevenir inyección de código (XSS)
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, function(tag) {
      const charsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      };
      return charsToReplace[tag] || tag;
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // Evitar envío por defecto
      let esValido = true;

      // Inputs
      const nombreInput = document.getElementById('nombre');
      const emailInput = document.getElementById('email');
      const msjInput = document.getElementById('mensaje');

      // Contenedores de Error
      const errNombre = document.getElementById('error-nombre');
      const errEmail = document.getElementById('error-email');
      const errMsj = document.getElementById('error-mensaje');

      // Limpiar errores previos
      errNombre.textContent = '';
      errEmail.textContent = '';
      errMsj.textContent = '';

      // Validación Nombre
      if (nombreInput.value.trim().length < 3) {
        errNombre.textContent = 'El nombre debe tener al menos 3 caracteres.';
        esValido = false;
      }

      // Validación Correo
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        errEmail.textContent = 'Por favor, ingresa un correo electrónico válido.';
        esValido = false;
      }

      // Validación Mensaje
      if (msjInput.value.trim().length < 10) {
        errMsj.textContent = 'El mensaje debe tener al menos 10 caracteres.';
        esValido = false;
      }

      if (esValido) {
        // Sanitizar entradas para prevenir XSS
        const nombreSeguro = escapeHTML(nombreInput.value.trim());
        const emailSeguro = escapeHTML(emailInput.value.trim());
        const msjSeguro = escapeHTML(msjInput.value.trim());

        // Aquí normalmente lo enviarías a un servidor. Por ahora mostramos éxito.
        M.toast({ html: '✓ Mensaje enviado correctamente.', classes: 'toast-cyan' });
        form.reset();
      } else {
        // Accesibilidad: Enfocar el primer campo con error
        if (nombreInput.value.trim().length < 3) {
          nombreInput.focus();
        } else if (!emailRegex.test(emailInput.value.trim())) {
          emailInput.focus();
        } else {
          msjInput.focus();
        }
      }
    });
  }


  // --- 4. CÓDIGO EXISTENTE (Scroll Reveal y Acordeón) ---
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { 
          e.target.classList.add('visible'); 
          io.unobserve(e.target); 
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const answer = q.nextElementSibling;
      const isOpen = answer.classList.contains('open');
      document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
      document.querySelectorAll('.faq-question').forEach(qq => qq.classList.remove('open'));
      if (!isOpen) { 
        answer.classList.add('open'); 
        q.classList.add('open'); 
      }
    });
  });
});