// =========================================
// SABORES DE CAÑAS - JAVASCRIPT
// Funcionalidad 1: Formulario de contacto (validación y envío)
// Funcionalidad 2: Botón para volver al inicio de la página
// =========================================


// =========================================
// FUNCIONALIDAD 1: FORMULARIO DE CONTACTO
// Solo se ejecuta en contacto.html
// =========================================

const formulario = document.getElementById("formulario-contacto");

if (formulario) {

    const campoNombre = document.getElementById("nombre");
    const campoCorreo = document.getElementById("correo");
    const campoMensaje = document.getElementById("mensaje");
    const botonEnviar = formulario.querySelector("button[type='submit']");
    const estado = document.getElementById("estado-formulario");

    // Muestra un mensaje de error debajo del campo
    function mostrarError(campo, texto) {
        let aviso = campo.parentElement.querySelector(".error-campo");

        if (!aviso) {
            aviso = document.createElement("small");
            aviso.className = "error-campo";
            campo.parentElement.appendChild(aviso);
        }

        aviso.textContent = texto;
        campo.classList.add("invalido");
    }

    // Quita el mensaje de error de un campo
    function limpiarError(campo) {
        const aviso = campo.parentElement.querySelector(".error-campo");

        if (aviso) {
            aviso.remove();
        }

        campo.classList.remove("invalido");
    }

    // Revisa que los datos escritos sean correctos
    function validarFormulario() {
        let correcto = true;

        const nombre = campoNombre.value.trim();
        const correo = campoCorreo.value.trim();
        const mensaje = campoMensaje.value.trim();

        // Nombre: mínimo 3 caracteres
        if (nombre.length < 3) {
            mostrarError(campoNombre, "Escribe tu nombre (mínimo 3 caracteres).");
            correcto = false;
        } else {
            limpiarError(campoNombre);
        }

        // Correo: debe tener formato texto@dominio.algo
        const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoCorreo.test(correo)) {
            mostrarError(campoCorreo, "Escribe un correo válido, por ejemplo: nombre@correo.com");
            correcto = false;
        } else {
            limpiarError(campoCorreo);
        }

        // Mensaje: mínimo 10 caracteres
        if (mensaje.length < 10) {
            mostrarError(campoMensaje, "El mensaje debe tener al menos 10 caracteres.");
            correcto = false;
        } else {
            limpiarError(campoMensaje);
        }

        return correcto;
    }

    // Muestra un mensaje general debajo del botón
    function mostrarEstado(texto, tipo) {
        estado.textContent = texto;
        estado.className = "estado-formulario " + tipo;
    }

    // Cuando la persona escribe, se quita el error de ese campo
    [campoNombre, campoCorreo, campoMensaje].forEach(function (campo) {
        campo.addEventListener("input", function () {
            limpiarError(campo);
        });
    });

    // Cuando la persona presiona "ENVIAR MENSAJE"
    formulario.addEventListener("submit", async function (evento) {

        // Evita que la página se recargue o salga hacia Google
        evento.preventDefault();

        mostrarEstado("", "");

        if (!validarFormulario()) {
            mostrarEstado("Por favor corrige los campos marcados.", "error");
            return;
        }

        // Mientras se envía, se bloquea el botón
        botonEnviar.disabled = true;
        botonEnviar.textContent = "ENVIANDO...";

        try {
            // Se envían los datos a la misma dirección (action) del formulario
            await fetch(formulario.action, {
                method: "POST",
                mode: "no-cors",
                body: new URLSearchParams(new FormData(formulario))
            });

            mostrarEstado("¡Gracias! Tu mensaje fue enviado correctamente.", "exito");
            formulario.reset();

        } catch (error) {
            mostrarEstado("No se pudo enviar el mensaje. Revisa tu conexión e inténtalo de nuevo.", "error");

        } finally {
            botonEnviar.disabled = false;
            botonEnviar.textContent = "ENVIAR MENSAJE";
        }
    });
}


// =========================================
// FUNCIONALIDAD 2: BOTÓN PARA VOLVER ARRIBA
// Funciona en todas las páginas
// =========================================

const botonArriba = document.createElement("button");
botonArriba.className = "boton-arriba";
botonArriba.type = "button";
botonArriba.textContent = "↑";
botonArriba.setAttribute("aria-label", "Volver al inicio de la página");
document.body.appendChild(botonArriba);

// Aparece solo cuando la persona baja en la página
window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
        botonArriba.classList.add("visible");
    } else {
        botonArriba.classList.remove("visible");
    }
});

// Al hacer clic, sube suavemente al inicio
botonArriba.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
});
