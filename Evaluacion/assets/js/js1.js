document.addEventListener('DOMContentLoaded', function () {

  // --- 1. MODO OSCURO / CLARO ---
  // Seleccionamos los botones de escritorio y móvil
  const themeToggleDesk = document.getElementById('theme-toggle');
  const themeToggleMob = document.getElementById('theme-toggle-mobile');
  const body = document.body;

  // Como el CSS por defecto es oscuro, revisamos si el usuario guardó el "modo claro" previamente
  if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
  }

  // Función principal para alternar el tema al hacer clic
  function toggleTheme(e) {
    e.preventDefault();
    body.classList.toggle('light-mode'); // Pone o quita la clase al <body>
    
    // Guardar estado en localStorage para que recuerde la decisión al cambiar de página
    if (body.classList.contains('light-mode')) {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.setItem('theme', 'dark');
    }
  }

  // Asignamos el evento click a los botones (si existen en la página actual)
  if (themeToggleDesk) themeToggleDesk.addEventListener('click', toggleTheme);
  if (themeToggleMob) themeToggleMob.addEventListener('click', toggleTheme);


  // --- 2. MENÚ DE NAVEGACIÓN DINÁMICO Y ACCESIBILIDAD ---
  // Reemplazamos la inicialización de Materialize por código Vanilla puro (Requisito pauta)
  const menuTrigger = document.getElementById('menu-trigger');
  const mobileMenu = document.getElementById('mobile-menu');
  let menuOpen = false; // Estado del menú

  if (menuTrigger && mobileMenu) {
    menuTrigger.addEventListener('click', function(e) {
      e.preventDefault();
      menuOpen = !menuOpen;
      
      if (menuOpen) {
        // Abrir menú: agregamos la clase que lo desplaza
        mobileMenu.classList.add('open');
        // Actualizamos ARIA para accesibilidad
        menuTrigger.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
        
        // Accesibilidad: Forzar el foco al primer enlace del menú recién abierto
        const primerEnlace = mobileMenu.querySelector('a');
        if (primerEnlace) primerEnlace.focus();
      } else {
        // Cerrar menú: quitamos la clase
        mobileMenu.classList.remove('open');
        // Actualizamos ARIA
        menuTrigger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        
        // Accesibilidad: Devolver el foco al botón de hamburguesa que abrió el menú
        menuTrigger.focus();
      }
    });
  }


  // --- 3. FORMULARIO: VALIDACIÓN, XSS Y GUARDADO EN LOCALSTORAGE ---
  // (Integre la lógica de formulario.js aquí adentro para evitar conflictos)
  const form = document.getElementById('contact-form');
  const miStorage = window.localStorage; // Variable para usar localStorage

  // Función para prevenir inyección de código (XSS) reemplazando caracteres peligrosos
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
      e.preventDefault(); // Evitamos que el navegador recargue la página o mande datos a lo loco
      let esValido = true; // Bandera para saber si todo está bien

      // Atrapamos los valores de los Inputs
      const nombreInput = document.getElementById('nombre');
      const emailInput = document.getElementById('email');
      const msjInput = document.getElementById('mensaje');

      // Atrapamos los contenedores de Error (los span vacíos)
      const errNombre = document.getElementById('error-nombre');
      const errEmail = document.getElementById('error-email');
      const errMsj = document.getElementById('error-mensaje');

      // Limpiamos errores previos por si el usuario está corrigiendo un envío fallido
      errNombre.textContent = '';
      errEmail.textContent = '';
      errMsj.textContent = '';

      // 1. Validación de Nombre (mínimo 3 letras)
      if (nombreInput.value.trim().length < 3) {
        errNombre.textContent = 'El nombre debe tener al menos 3 caracteres.';
        esValido = false;
      }

      // 2. Validación de Correo (usando Expresión Regular/Regex)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        errEmail.textContent = 'Por favor, ingresa un correo electrónico válido.';
        esValido = false;
      }

      // 3. Validación de Mensaje (mínimo 10 letras)
      if (msjInput.value.trim().length < 10) {
        errMsj.textContent = 'El mensaje debe tener al menos 10 caracteres.';
        esValido = false;
      }

      // 4. Si todo pasó las pruebas, RECIÉN AHORA guardamos los datos
      if (esValido) {
        
        // Sanitizar las entradas para prevenir que nos inyecten scripts maliciosos (XSS)
        const nombreSeguro = escapeHTML(nombreInput.value.trim());
        const emailSeguro = escapeHTML(emailInput.value.trim());
        const msjSeguro = escapeHTML(msjInput.value.trim());

        // Creamos el objeto con los datos ya limpios
        const nuevoContacto = {
          nombre: nombreSeguro,
          email: emailSeguro,
          mensaje: msjSeguro
        };

        // Obtenemos los contactos viejos del storage (si existen)
        let contactos = JSON.parse(miStorage.getItem("contactos"));
        if (contactos == null) {
          contactos = []; // Si no hay nada, creamos el array vacío
        }

        // Agregamos el contacto nuevo a la lista
        contactos.push(nuevoContacto);

        // Guardamos la lista completa de vuelta en el localStorage (Base de Datos)
        miStorage.setItem("contactos", JSON.stringify(contactos));
        
        // Mensaje de éxito visible para el usuario
        M.toast({ html: '✓ Contacto guardado correctamente.', classes: 'toast-cyan' });
        
        // Limpiamos los campos del formulario para que quede en blanco
        form.reset();
        
      } else {
        // SI ALGO SALIÓ MAL (esValido == false)
        // Accesibilidad: Enfocamos automáticamente el primer campo que tenga error para que el usuario sepa dónde arreglarlo
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


  // --- 4. CÓDIGO EXISTENTE (Efectos visuales) ---
  
  // Lógica del Scroll Reveal (hacer que los elementos aparezcan de abajo hacia arriba al scrollear)
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) { // Comprobamos si el navegador moderno soporta IntersectionObserver
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { 
          e.target.classList.add('visible'); // Agrega clase para mostrar
          io.unobserve(e.target); // Deja de observar para que la animación solo ocurra 1 vez
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => io.observe(el));
  } else {
    // Fallback para navegadores ultra viejos: mostrar todo de golpe
    reveals.forEach(el => el.classList.add('visible'));
  }

  // Lógica del Acordeón para las Preguntas Frecuentes
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const answer = q.nextElementSibling; // Agarra la respuesta que está justo debajo de la pregunta clickeada
      const isOpen = answer.classList.contains('open');
      
      // Cerramos todas las demás respuestas primero (efecto acordeón cerrado)
      document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('open'));
      document.querySelectorAll('.faq-question').forEach(qq => qq.classList.remove('open'));
      
      // Si la que clickeamos estaba cerrada, la abrimos
      if (!isOpen) { 
        answer.classList.add('open'); 
        q.classList.add('open'); //para borrar todo de base de datos, localStorage.clear();
      }
    });
  });
});