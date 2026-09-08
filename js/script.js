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

    });

});


// Preguntas frecuentes
const preguntas = document.querySelectorAll(".accordion__trigger");

preguntas.forEach(function (pregunta) {

    pregunta.addEventListener("click", function () {

        const panel = pregunta.nextElementSibling;

        const abierto =
            pregunta.getAttribute("aria-expanded") === "true";

        pregunta.setAttribute(
            "aria-expanded",
            !abierto
        );

        if (abierto) {

            panel.style.maxHeight = null;

        } else {

            panel.style.maxHeight =
                panel.scrollHeight + "px";

        }

    });

});


// Galería
const imagenesGaleria =
    document.querySelectorAll(".gallery__item");

const lightbox =
    document.getElementById("lightbox");

const lightboxImg =
    document.getElementById("lightboxImg");

const lightboxClose =
    document.getElementById("lightboxClose");


imagenesGaleria.forEach(function (imagen) {

    imagen.addEventListener("click", function () {

        const rutaImagen =
            imagen.getAttribute("data-full");

        lightboxImg.src = rutaImagen;

        lightbox.classList.add("is-open");

    });

});


lightboxClose.addEventListener("click", function () {

    lightbox.classList.remove("is-open");

});


lightbox.addEventListener("click", function (evento) {

    if (evento.target === lightbox) {

        lightbox.classList.remove("is-open");

    }

});


// Año automático del footer
const year = document.getElementById("year");

year.textContent =
    new Date().getFullYear();


// Formulario
const formulario =
    document.getElementById("contactForm");

const formStatus =
    document.getElementById("formStatus");

formulario.addEventListener(
    "submit",
    function (evento) {

        evento.preventDefault();

        const nombre =
            document.getElementById("nombre").value;

        const telefono =
            document.getElementById("telefono").value;

        if (nombre === "" || telefono === "") {

            formStatus.textContent =
                "Completa tu nombre y teléfono.";

            return;

        }

        formStatus.textContent =
            "Gracias. Hemos recibido tus datos.";

    }
);