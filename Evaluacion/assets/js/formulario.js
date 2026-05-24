window.onload = function () {

  // STORAGE
  const miStorage = window.localStorage;

  // FORMULARIO
  const formulario =
  document.getElementById("contact-form");

  // SUBMIT
  formulario.addEventListener(
    "submit",
    function (e) {

      e.preventDefault();

      // DATOS
      const nombre =
      document.getElementById("nombre")
      .value
      .trim();

      const email =
      document.getElementById("email")
      .value
      .trim();

      const mensaje =
      document.getElementById("mensaje")
      .value
      .trim();

      // VALIDAR
      if(
        nombre === "" ||
        email === "" ||
        mensaje === ""
      ){

        M.toast({
          html:
          "Completa todos los campos"
        });

        return;

      }

      // NUEVO CONTACTO
      const nuevoContacto = {

        nombre: nombre,
        email: email,
        mensaje: mensaje

      };

      // OBTENER CONTACTOS YA GUARDADOS
      let contactos =
      JSON.parse(
        miStorage.getItem("contactos")
      );

      // SI NO EXISTEN
      if(contactos == null){

        contactos = [];

      }

      // AGREGAR NUEVO
      contactos.push(
        nuevoContacto
      );

      // GUARDAR OTRA VEZ
      miStorage.setItem(
        "contactos",
        JSON.stringify(contactos)
      );

      console.log(contactos);

      // MENSAJE
      M.toast({
        html:
        "Contacto guardado"
      });

      // LIMPIAR
      formulario.reset();

    }
  );

};