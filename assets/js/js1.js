document.addEventListener('DOMContentLoaded', inicializarSitio);

/**
 * Propósito: Función principal que arranca todos los módulos del sitio al cargar el DOM.
 * Parámetros: Ninguno.
 */
function inicializarSitio() {
  // --- 1. MODO OSCURO / CLARO ---
  const themeToggleDesk = document.getElementById('theme-toggle');
  const themeToggleMob = document.getElementById('theme-toggle-mobile');
  
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
  }
  
  if (themeToggleDesk) themeToggleDesk.addEventListener('click', alternarTema);
  if (themeToggleMob) themeToggleMob.addEventListener('click', alternarTema);

  // --- 2. MENÚ DE NAVEGACIÓN DINÁMICO Y ACCESIBILIDAD ---
  const menuTrigger = document.getElementById('menu-trigger');
  if (menuTrigger) {
    menuTrigger.addEventListener('click', alternarMenuMovil);
  }

  // --- 3. FORMULARIO: VALIDACIÓN, XSS Y GUARDADO EN LOCALSTORAGE ---
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', procesarFormulario);
  }

  // --- 4. EFECTOS VISUALES ---
  inicializarScrollReveal();
  inicializarAcordeon();
}

/**
 * Propósito: Cambia entre modo claro y oscuro, guardando la preferencia en localStorage.
 * Parámetros: e (Evento de click)
 */
function alternarTema(e) {
  e.preventDefault();
  document.body.classList.toggle('light-mode'); 
  
  if (document.body.classList.contains('light-mode')) {
    localStorage.setItem('theme', 'light');
  } else {
    localStorage.setItem('theme', 'dark');
  }
}

/**
 * Propósito: Abre y cierra el menú lateral en móviles, gestionando el foco y ARIA.
 * Parámetros: e (Evento de click)
 */
function alternarMenuMovil(e) {
  e.preventDefault();
  const mobileMenu = document.getElementById('mobile-menu');
  const menuTrigger = document.getElementById('menu-trigger');
  
  // Determinamos el estado actual basándonos en la clase
  const menuOpen = mobileMenu.classList.contains('open');
  
  if (!menuOpen) {
    // Abrir menú
    mobileMenu.classList.add('open');
    menuTrigger.setAttribute('aria-expanded', 'true');
    mobileMenu.setAttribute('aria-hidden', 'false');
    
    const primerEnlace = mobileMenu.querySelector('a');
    if (primerEnlace) primerEnlace.focus();
  } else {
    // Cerrar menú
    mobileMenu.classList.remove('open');
    menuTrigger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    
    menuTrigger.focus();
  }
}

/**
 * Propósito: Sanitiza cadenas de texto para evitar ataques XSS.
 * Parámetros: str (String a sanitizar)
 * Retorna: String sanitizado.
 */
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

/**
 * Propósito: Valida los campos, muestra errores usando textContent y guarda en localStorage si es válido.
 * Parámetros: e (Evento submit del formulario)
 */
function procesarFormulario(e) {
  e.preventDefault(); 
  let esValido = true; 
  const miStorage = window.localStorage; 

  const nombreInput = document.getElementById('nombre');
  const emailInput = document.getElementById('email');
  const msjInput = document.getElementById('mensaje');

  const errNombre = document.getElementById('error-nombre');
  const errEmail = document.getElementById('error-email');
  const errMsj = document.getElementById('error-mensaje');

  errNombre.textContent = '';
  errEmail.textContent = '';
  errMsj.textContent = '';

  if (nombreInput.value.trim().length < 3) {
    errNombre.textContent = 'El nombre debe tener al menos 3 caracteres.';
    esValido = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value.trim())) {
    errEmail.textContent = 'Por favor, ingresa un correo electrónico válido.';
    esValido = false;
  }

  if (msjInput.value.trim().length < 10) {
    errMsj.textContent = 'El mensaje debe tener al menos 10 caracteres.';
    esValido = false;
  }

  if (esValido) {
    const nombreSeguro = escapeHTML(nombreInput.value.trim());
    const emailSeguro = escapeHTML(emailInput.value.trim());
    const msjSeguro = escapeHTML(msjInput.value.trim());

    const nuevoContacto = {
      nombre: nombreSeguro,
      email: emailSeguro,
      mensaje: msjSeguro
    };

    let contactos = JSON.parse(miStorage.getItem("contactos"));
    if (contactos == null) {
      contactos = []; 
    }

    contactos.push(nuevoContacto);
    miStorage.setItem("contactos", JSON.stringify(contactos));
    
    M.toast({ html: '✓ Contacto guardado correctamente.', classes: 'toast-cyan' });
    
    document.getElementById('contact-form').reset();
    
  } else {
    if (nombreInput.value.trim().length < 3) {
      nombreInput.focus();
    } else if (!emailRegex.test(emailInput.value.trim())) {
      emailInput.focus();
    } else {
      msjInput.focus();
    }
  }
}

/**
 * Propósito: Activa la animación de los elementos al hacer scroll en la página.
 * Parámetros: Ninguno.
 */
function inicializarScrollReveal() {
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
}

/**
 * Propósito: Gestiona la apertura y cierre del acordeón de Preguntas Frecuentes.
 * Parámetros: Ninguno.
 */
function inicializarAcordeon() {
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', function() {
      const answer = this.nextElementSibling; 
      const isOpen = answer.classList.contains('open');
      
      document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
      document.querySelectorAll('.faq-question').forEach(qq => qq.classList.remove('open'));
      
      if (!isOpen) { 
        answer.classList.add('open'); 
        this.classList.add('open'); 
      }
    });
  });
}