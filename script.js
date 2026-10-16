// =========================================
// SABORES DE CAÑAS - JAVASCRIPT
// Funcionalidad 1: Formulario de contacto (validación y mensaje de envío)
// Funcionalidad 2: Botón para volver al inicio de la página
// =========================================


// =========================================
// FUNCIONALIDAD 1: FORMULARIO DE CONTACTO
// Solo se ejecuta en contacto.html
//
// Cómo funciona:
// 1. El formulario se envía de forma normal (method="POST") a Google Apps Script.
// 2. Pero el HTML tiene target="envio-oculto", así que la respuesta de Google
//    se carga dentro de un iframe oculto y la persona no sale de la página.
// 3. Cuando el iframe termina de cargar, mostramos el mensaje de éxito.
// =========================================

const formulario = document.getElementById("formulario-contacto");

if (formulario) {

    const campoNombre = document.getElementById("nombre");
    const campoCorreo = document.getElementById("correo");
    const campoMensaje = document.getElementById("mensaje");
    const botonEnviar = formulario.querySelector("button[type='submit']");
    const estado = document.getElementById("estado-formulario");
    const marcoOculto = document.getElementById("envio-oculto");

    let enviando = false;    // true mientras esperamos la respuesta de Google
    let temporizador = null; // se usa para avisar si Google tarda demasiado

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

    // Deja el botón listo para enviar otro mensaje
    function terminarEnvio() {
        enviando = false;
        clearTimeout(temporizador);
        botonEnviar.disabled = false;
        botonEnviar.textContent = "ENVIAR MENSAJE";
    }

    // Cuando la persona escribe, se quita el error de ese campo
    [campoNombre, campoCorreo, campoMensaje].forEach(function (campo) {
        campo.addEventListener("input", function () {
            limpiarError(campo);
        });
    });

    // Cuando la persona presiona "ENVIAR MENSAJE"
    formulario.addEventListener("submit", function (evento) {

        mostrarEstado("", "");

        // Si hay datos incorrectos, se cancela el envío
        if (!validarFormulario()) {
            evento.preventDefault();
            mostrarEstado("Por favor corrige los campos marcados.", "error");
            return;
        }

        // Si no hay internet, se cancela el envío y se avisa
        if (!navigator.onLine) {
            evento.preventDefault();
            mostrarEstado("No hay conexión a internet. Inténtalo de nuevo cuando vuelva.", "error");
            return;
        }

        // Los datos están bien: NO se cancela el envío.
        // El navegador manda el formulario a Google (hacia el iframe oculto).
        enviando = true;
        botonEnviar.disabled = true;
        botonEnviar.textContent = "ENVIANDO...";

        // Si Google no responde en 20 segundos, se muestra un error
        temporizador = setTimeout(function () {
            if (enviando) {
                terminarEnvio();
                mostrarEstado("El envío tardó demasiado. Inténtalo de nuevo.", "error");
            }
        }, 20000);
    });

    // Cuando Google responde, el iframe oculto termina de cargar
    marcoOculto.addEventListener("load", function () {

        // El iframe también "carga" vacío al abrir la página; se ignora ese caso
        if (!enviando) {
            return;
        }

        terminarEnvio();
        mostrarEstado("¡Gracias! Tu mensaje fue enviado correctamente.", "exito");
        formulario.reset();
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
