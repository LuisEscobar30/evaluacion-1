// Esperamos a que cargue el DOM y llamamos a una función con nombre
document.addEventListener('DOMContentLoaded', inicializarCarritoYProyectos);

// --- VARIABLES GLOBALES ---
// Las sacamos al nivel principal para que todas las funciones puedan leerlas
const proyectosData = [
    { id: 1, nombre: "Movimiento de Tierra A", precio: 500000, categoria: "Industrial", desc: "Preparación básica de terreno industrial.", img: "assets/imgs/tierra.png" },
    { id: 2, nombre: "Radier Industrial B", precio: 800000, categoria: "Industrial", desc: "Losa de hormigón de alta resistencia.", img: "assets/imgs/radier.png" },
    { id: 3, nombre: "Galpón Acero Standard", precio: 3500000, categoria: "Industrial", desc: "Estructura metálica 10x20m sin cerramiento.", img: "assets/imgs/galpon.png" },
    { id: 4, nombre: "Cobertizo Modular", precio: 1200000, categoria: "Modular", desc: "Estructura prefabricada de ensamblaje rápido.", img: "assets/imgs/cobertizo.png" },
    { id: 5, nombre: "Cierre Tipo Bulldog", precio: 350000, categoria: "Perimetral", desc: "Placas de hormigón vibrado (precio por tramo).", img: "assets/imgs/cierre.png" },
    { id: 6, nombre: "Malla Acuenta", precio: 150000, categoria: "Perimetral", desc: "Cierre económico con malla galvanizada.", img: "assets/imgs/malla.png" }
];

let carrito = JSON.parse(localStorage.getItem('cotizacion')) || [];

/**
 * Propósito: Función principal que inicializa el modal, dibuja los proyectos y activa los escuchadores de eventos.
 * Parámetros: Ninguno.
 */
function inicializarCarritoYProyectos() {
    configurarModalAccesible();
    renderizarProyectos('Todos');
    actualizar(); // Dibuja el carrito inicial si hay algo guardado

    // Escuchadores de eventos para los filtros (llamando a función nombrada)
    const botonesFiltro = document.querySelectorAll('.btn-filter');
    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', manejarFiltroProyectos);
    });

    // Delegación de eventos maestra para botones dinámicos
    document.addEventListener('click', manejarAccionesCarrito);
}

/**
 * Propósito: Configura la ventana modal del carrito y gestiona el foco para accesibilidad (ARIA).
 * Parámetros: Ninguno.
 */
function configurarModalAccesible() {
    let elementoPrevioAlModal;
    const elems = document.querySelectorAll('.modal');
    M.Modal.init(elems, {
        onOpenStart: function(modal, trigger) {
            elementoPrevioAlModal = trigger; // Guardamos el botón que abrió el modal
        },
        onOpenEnd: function(modal) {
            // Enfocar el primer elemento interactivo dentro del modal
            const primerBoton = modal.querySelector('.btn-finalizar') || modal.querySelector('.modal-close');
            if(primerBoton) primerBoton.focus();
        },
        onCloseEnd: function() {
            // Devolver el foco al botón original
            if(elementoPrevioAlModal) elementoPrevioAlModal.focus();
        }
    });
}

/**
 * Propósito: Filtra la base de datos local y dibuja las tarjetas en el HTML dinámicamente.
 * Parámetros: filtro (String con el nombre de la categoría a mostrar, ej: "Todos" o "Industrial").
 */
function renderizarProyectos(filtro) {
    const contenedorProyectos = document.getElementById('contenedor-proyectos');
    if (!contenedorProyectos) return; 
    
    contenedorProyectos.innerHTML = ''; 
    const filtrados = filtro === 'Todos' ? proyectosData : proyectosData.filter(p => p.categoria === filtro);

    filtrados.forEach(proj => {
        const col = document.createElement('div');
        col.className = 'col s12 m4';
        col.innerHTML = `
          <div class="price-card reveal visible">
            <div class="card-image-box">
                <img src="${proj.img}" alt="${proj.nombre}">
            </div>
            <div class="price-name">${proj.nombre}</div>
            <div class="price-amount">$${proj.precio.toLocaleString('es-CL')}</div>
            <p class="card-desc">${proj.desc}</p>
            <button class="btn btn-anadir waves-effect" data-nombre="${proj.nombre}" data-precio="${proj.precio}">Añadir al Presupuesto</button>
          </div>
        `;
        contenedorProyectos.appendChild(col);
    });
}

/**
 * Propósito: Captura el click en los botones de filtro, cambia su estilo activo y manda a renderizar la categoría elegida.
 * Parámetros: e (Evento de click nativo del navegador).
 */
function manejarFiltroProyectos(e) {
    const botonesFiltro = document.querySelectorAll('.btn-filter');
    botonesFiltro.forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    renderizarProyectos(e.target.getAttribute('data-filter'));
}

/**
 * Propósito: Calcula el total del presupuesto, actualiza el icono numérico y dibuja la lista dentro del modal. Guarda en localStorage.
 * Parámetros: Ninguno.
 */
function actualizar() {
    const contador = document.getElementById('contador-carrito-nav');
    const lista = document.getElementById('lista-carrito');

    if(contador) contador.textContent = carrito.length;
    localStorage.setItem('cotizacion', JSON.stringify(carrito));
    
    let total = 0;
    if(lista) {
        lista.innerHTML = carrito.length === 0 ? '<li class="collection-item empty-cart-msg">Tu lista de obras está vacía</li>' : '';

        carrito.forEach((item, i) => {
            total += parseInt(item.precio);
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.innerHTML = `
                <span>${item.nombre}</span> 
                <span>$${parseInt(item.precio).toLocaleString('es-CL')}</span> 
                <a href="#!" class="secondary-content btn-eliminar" data-index="${i}" aria-label="Eliminar ${item.nombre} del presupuesto">
                    <i class="material-icons delete-icon-orange">delete</i>
                </a>
            `;
            lista.appendChild(li);
        });

        if (carrito.length > 0) {
            const totalLi = document.createElement('li');
            totalLi.className = 'collection-item total-row';
            totalLi.innerHTML = `<span>PRESUPUESTO ESTIMADO</span> <span>$${total.toLocaleString('es-CL')}</span>`;
            lista.appendChild(totalLi);
        }
    }
}

/**
 * Propósito: Utiliza delegación de eventos para procesar clics en botones creados dinámicamente (añadir o eliminar del carrito).
 * Parámetros: e (Evento de click nativo del navegador).
 */
function manejarAccionesCarrito(e) {
    // --- Evento: Añadir al Carrito ---
    if(e.target.classList.contains('btn-anadir')) {
        const item = {
            nombre: e.target.getAttribute('data-nombre'),
            precio: e.target.getAttribute('data-precio')
        };
        carrito.push(item);
        actualizar();
        M.toast({html: '✓ ' + item.nombre + ' añadido al presupuesto', classes: 'toast-cyan'});
    }

    // --- Evento: Eliminar del Carrito ---
    const btnEliminar = e.target.closest('.btn-eliminar');
    if(btnEliminar) {
        e.preventDefault();
        const index = btnEliminar.getAttribute('data-index');
        carrito.splice(index, 1);
        actualizar();
    }
}