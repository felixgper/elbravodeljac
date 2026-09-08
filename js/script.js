// Menú para celulares
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

navToggle.addEventListener("click", function () {
    navMenu.classList.toggle("is-open");
    navToggle.classList.toggle("is-open");

    const abierto = navMenu.classList.contains("is-open");
    navToggle.setAttribute("aria-expanded", abierto);
});

// Cerrar menú al tocar una opción
const enlacesMenu = document.querySelectorAll(".navbar__link");

enlacesMenu.forEach(function (enlace) {
    enlace.addEventListener("click", function () {
        navMenu.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
    });
});

// Preguntas frecuentes
const preguntas = document.querySelectorAll(".accordion__trigger");

preguntas.forEach(function (pregunta) {
    pregunta.addEventListener("click", function () {
        const panel = pregunta.nextElementSibling;
        const abierto = pregunta.getAttribute("aria-expanded") === "true";

        pregunta.setAttribute("aria-expanded", String(!abierto));

        if (abierto) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
});

// Galería
const imagenesGaleria = document.querySelectorAll(".gallery__item");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

imagenesGaleria.forEach(function (imagen) {
    imagen.addEventListener("click", function () {
        const rutaImagen = imagen.getAttribute("data-full");
        const img = imagen.querySelector("img");

        lightboxImg.src = rutaImagen;

        if (img) {
            lightboxImg.alt = img.alt;
        }

        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
    });
});

lightboxClose.addEventListener("click", function () {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
});

lightbox.addEventListener("click", function (evento) {
    if (evento.target === lightbox) {
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
    }
});

// Cerrar galería con Escape
document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape" && lightbox.classList.contains("is-open")) {
        lightbox.classList.remove("is-open");
        lightbox.setAttribute("aria-hidden", "true");
    }
});

// Año automático del footer
const year = document.getElementById("year");

if (year) {
    year.textContent = new Date().getFullYear();
}

// Formulario de diagnóstico
const formulario = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const submitButton = document.getElementById("submitButton");

formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    if (nombre === "" || telefono === "") {
        formStatus.textContent = "Completa tu nombre y teléfono.";
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";
    formStatus.textContent = "Enviando solicitud...";

    const datos = new FormData(formulario);

    try {
        const respuesta = await fetch(
            "https://formspree.io/f/mdeopppo",
            {
                method: "POST",
                body: datos,
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        if (respuesta.ok) {
            formStatus.textContent =
                "Solicitud enviada correctamente. Nos comunicaremos contigo pronto.";

            formulario.reset();
        } else {
            formStatus.textContent =
                "No se pudo enviar la solicitud. Inténtalo nuevamente.";
        }

    } catch (error) {
        formStatus.textContent =
            "Ocurrió un problema al enviar la solicitud. Inténtalo nuevamente.";
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Solicitar diagnóstico";
    }
});