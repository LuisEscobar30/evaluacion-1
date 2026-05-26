// Asignamos el evento de carga a una función nombrada, sin usar funciones anónimas
window.onload = cargarContactosGuardados;

/**
 * Propósito: Extrae los contactos almacenados en el localStorage y los renderiza dinámicamente en el DOM como tarjetas.
 * Parámetros: Ninguno.
 */
function cargarContactosGuardados() {
  
  // STORAGE
  const miStorage = window.localStorage;

  // OBTENER DATOS
  let contactos = JSON.parse(miStorage.getItem("contactos"));

  // CONTENEDOR
  const contenedor = document.getElementById("contenedor-datos");

  // SI NO HAY CONTACTOS GUARDADOS
  if (contactos == null || contactos.length === 0) {
    contenedor.innerHTML = `
      <div class="card blue-grey darken-4">
        <div class="card-content white-text">
          <span class="card-title">
            No hay contactos guardados
          </span>
        </div>
      </div>
    `;
    return;
  }

  // LIMPIAR EL CONTENEDOR ANTES DE PINTAR
  contenedor.innerHTML = "";

  // RECORRER TODOS LOS CONTACTOS Y CREAR LAS TARJETAS HTML
  for (let i = 0; i < contactos.length; i++) {
    contenedor.innerHTML += `
      <div class="card blue-grey darken-4">
        <div class="card-content white-text">
          <span class="card-title">
            ${contactos[i].nombre}
          </span>
          <p>
            <strong>Email:</strong>
            ${contactos[i].email}
          </p>
          <br>
          <p>
            <strong>Mensaje:</strong>
            ${contactos[i].mensaje}
          </p>
        </div>
      </div>
    `;
  }
  
  // Nota: para borrar datos poner en consola localStorage.clear();
}