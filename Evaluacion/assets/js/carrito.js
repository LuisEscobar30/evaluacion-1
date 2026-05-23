document.addEventListener('DOMContentLoaded', () => {
    // Inicializar modales
    const elems = document.querySelectorAll('.modal');
    M.Modal.init(elems);
    
    let carrito = JSON.parse(localStorage.getItem('cotizacion')) || [];
    const contador = document.getElementById('contador-carrito');
    const lista = document.getElementById('lista-carrito');

    function actualizar() {
        contador.textContent = carrito.length;
        localStorage.setItem('cotizacion', JSON.stringify(carrito));
        
        let total = 0;
        lista.innerHTML = carrito.length === 0 ? '<li class="collection-item">Carrito vacío</li>' : '';

        carrito.forEach((item, i) => {
            total += parseInt(item.precio);
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.innerHTML = `<span>${item.nombre} - $${item.precio}</span> 
                            <a href="#!" class="secondary-content" onclick="eliminar(${i})"><i class="material-icons red-text">delete</i></a>`;
            lista.appendChild(li);
        });

        if (carrito.length > 0) {
            const totalLi = document.createElement('li');
            totalLi.className = 'collection-item total-row';
            totalLi.innerHTML = `<span>TOTAL</span> <span>$${total}</span>`;
            lista.appendChild(totalLi);
        }
    }

    window.eliminar = (i) => { 
        carrito.splice(i, 1); 
        actualizar(); 
    };

    document.querySelectorAll('.btn-anadir').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = {
                nombre: btn.getAttribute('data-nombre'),
                precio: btn.getAttribute('data-precio')
            };
            carrito.push(item);
            actualizar();
            M.toast({html: 'Añadido: ' + item.nombre});
        });
    });

    actualizar();
});