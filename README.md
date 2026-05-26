# OBE SPA - Plataforma Web de Obras

## Descripción del Proyecto
Este proyecto es una plataforma web desarrollada para **OBE SPA**, una empresa especializada en obras civiles, movimiento de tierras y soluciones prefabricadas.
El sitio está diseñado para servir como el canal digital principal de la empresa, permitiendo a los clientes conocer sus servicios, revisar su portafolio de trabajos anteriores y generar cotizaciones estimadas de manera rápida, interactiva y sin necesidad de recargar la página
## Funcionalidades Principales
* **Pagina principal:** Una pagina principal con información general de la empresa y botones intuitivos para incitar al cliente a explorar opciones de cotizacion 
* **Catálogo Interactivo:** La sección de proyectos genera sus tarjetas dinámicamente desde una base de datos local (arrays/objetos). Cuenta con un sistema de filtros por categoría que actualiza la vista en tiempo real.
* **Cotizador Dinámico (Carrito):** Los usuarios pueden ir añadiendo servicios a un presupuesto estimado. El sistema calcula el total de forma automática, permite eliminar ítems y mantiene la información guardada en la memoria del navegador (`localStorage`) para no perder la cotización si se cambia de página.
* **Formulario de Contacto Seguro:** Contiene una Interfaz de contacto protegida con validación estricta del lado del cliente (longitud de campos y formato de correo mediante expresiones regulares) y un sistema de sanitización que previene inyecciones de código (XSS).
* **Modo Oscuro / Claro:** Alternativa de visualización personalizable. El sitio recuerda la preferencia del usuario a través de almacenamiento local, aplicando el tema correspondiente en toda la navegación.
* **Navegación Adaptable:** Menú móvil interactivo desarrollado a medida para pantallas pequeñas, con control total del DOM.
* **Diseño Accesible:** Implementación de atributos ARIA dinámicos y gestión inteligente del "foco" (cursor de teclado) al abrir ventanas modales o menús, facilitando la navegación para usuarios con lectores de pantalla.
* **Base de Datos** Contiene una pagina solo disponible para los administradores, donde mediante la logica de localstorage se guardan los formularios para ser leidos cuando entras a ese html
* **Seccion Portafolio:** La pagina cuenta con un portafolio para ver las obras hechas por la empresa mediante tarjetas, las tarjetas contienen un carrusel de fotos donde puedes arrastrar para ver mas imagenes 

## Tecnologías Utilizadas
HTML5 
CSS
JavaScript

## Autores
* **Nombres:** Martin, Luis, Martina
* **Carrera:** Analista Programador
* **Institución:** INACAP
