document.addEventListener('DOMContentLoaded', () => {
    
    // --- ACCESIBILIDAD: MODAL CON FOCO ---
    // (Cumplimos el punto de gestionar el foco al abrir/cerrar modales)
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
    
    // --- 1. BASE DE DATOS DE PROYECTOS ---
    const proyectosData = [
        { id: 1, nombre: "Movimiento de Tierra A", precio: 500000, categoria: "Industrial", desc: "Preparación básica de terreno industrial.", img: "assets/imgs/tierra.png" },
        { id: 2, nombre: "Radier Industrial B", precio: 800000, categoria: "Industrial", desc: "Losa de hormigón de alta resistencia.", img: "assets/imgs/radier.png" },
        { id: 3, nombre: "Galpón Acero Standard", precio: 3500000, categoria: "Industrial", desc: "Estructura metálica 10x20m sin cerramiento.", img: "assets/imgs/galpon.png" },
        { id: 4, nombre: "Cobertizo Modular", precio: 1200000, categoria: "Modular", desc: "Estructura prefabricada de ensamblaje rápido.", img: "assets/imgs/cobertizo.png" },
        { id: 5, nombre: "Cierre Tipo Bulldog", precio: 350000, categoria: "Perimetral", desc: "Placas de hormigón vibrado (precio por tramo).", img: "assets/imgs/cierre.png" },
        { id: 6, nombre: "Malla Acuenta", precio: 150000, categoria: "Perimetral", desc: "Cierre económico con malla galvanizada.", img: "assets/imgs/malla.png" }
    ];

    // --- 2. LÓGICA DE RENDERIZADO Y FILTROS ---
    const contenedorProyectos = document.getElementById('contenedor-proyectos');
    const botonesFiltro = document.querySelectorAll('.btn-filter');

    function renderizarProyectos(filtro) {
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

    renderizarProyectos('Todos');

    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', (e) => {
            botonesFiltro.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderizarProyectos(e.target.getAttribute('data-filter'));
        });
    });

    // --- 3. LÓGICA DEL CARRITO (Limpia de estilos en línea y JS incrustado) ---
    let carrito = JSON.parse(localStorage.getItem('cotizacion')) || [];
    const contador = document.getElementById('contador-carrito-nav');
    const lista = document.getElementById('lista-carrito');

    function actualizar() {
        if(contador) contador.textContent = carrito.length;
        localStorage.setItem('cotizacion', JSON.stringify(carrito));
        
        let total = 0;
        if(lista) {
            lista.innerHTML = carrito.length === 0 ? '<li class="collection-item empty-cart-msg">Tu lista de obras está vacía</li>' : '';

            carrito.forEach((item, i) => {
                total += parseInt(item.precio);
                const li = document.createElement('li');
                li.className = 'collection-item';
                // Cambio clave: Usamos una clase "btn-eliminar" y un atributo "data-index" en vez de "onclick"
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

    // Delegación de eventos: Escucha clicks en todo el documento pero solo actúa si coinciden las clases
    document.addEventListener('click', (e) => {
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
    });

    actualizar();
});