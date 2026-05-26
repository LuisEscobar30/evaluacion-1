document.addEventListener('DOMContentLoaded', inicializarTodosLosCarruseles);

/**
 * Propósito: Busca todos los contenedores de carrusel en el HTML y los prepara para su inicialización.
 * Parámetros: Ninguno.
 */
function inicializarTodosLosCarruseles() {
  var elems = document.querySelectorAll('.carousel.carousel-slider');
  
  // Recorremos cada carrusel encontrado y llamamos a una función nombrada
  elems.forEach(activarCarruselIndividual);
}

/**
 * Propósito: Aplica la configuración de la librería Materialize a un carrusel específico.
 * Parámetros: el (Nodo HTML que representa un carrusel individual dentro del bucle).
 */
function activarCarruselIndividual(el) {
  M.Carousel.init(el, {
    fullWidth: true,
    indicators: true
  });
}