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
// Presentación del taller y promoción de cambio de aceite
(() => {
    const hero = document.getElementById("inicio");
    const track = document.getElementById("heroTrack");
    const slides = Array.from(hero.querySelectorAll(".hero__slide"));
    const tabs = Array.from(hero.querySelectorAll("[data-hero-slide]"));
    const video = document.getElementById("oilVideo");
    const pause = document.getElementById("heroPause");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let current = 0;
    let timer;
    let userPaused = reducedMotion.matches;
    let focused = false;
    let visible = true;

    hero.classList.add("is-enhanced");
    video.muted = true;

    function stopped() {
        return userPaused || focused || document.hidden || !visible;
    }

    function updatePlayback() {
        clearTimeout(timer);
        pause.textContent = userPaused ? "Continuar" : "Pausar";
        pause.setAttribute("aria-pressed", String(userPaused));
        pause.setAttribute("aria-label", userPaused ? "Continuar presentación automática" : "Pausar presentación automática");
        if (stopped()) {
            video.pause();
            return;
        }
        if (current === 1) {
            if (video.ended) video.currentTime = 0;
            const attempt = video.play();
            if (attempt) attempt.catch(() => {});
            // También funciona si el navegador bloquea el video o la conexión falla.
            const remaining = Number.isFinite(video.duration) ? Math.max(1, video.duration - video.currentTime) : 10;
            timer = setTimeout(() => show(0), (remaining + 1) * 1000);
        } else {
            video.pause();
            timer = setTimeout(() => show(1), 6000);
        }
    }

    function show(index) {
        const next = (index + slides.length) % slides.length;
        if (current !== next) video.currentTime = 0;
        current = next;
        track.style.transform = `translateX(${current * 100}%)`;
        slides.forEach((slide, i) => {
            slide.inert = i !== current;
            slide.setAttribute("aria-hidden", String(i !== current));
        });
        tabs.forEach((tab, i) => {
            tab.classList.toggle("is-active", i === current);
            tab.setAttribute("aria-pressed", String(i === current));
        });
        updatePlayback();
    }

    tabs.forEach(tab => tab.addEventListener("click", () => show(Number(tab.dataset.heroSlide))));
    document.getElementById("heroPrevious").addEventListener("click", () => show(current - 1));
    document.getElementById("heroNext").addEventListener("click", () => show(current + 1));
    pause.addEventListener("click", () => {
        userPaused = !userPaused;
        updatePlayback();
    });
    // La navegación con teclado detiene los cambios para no mover el foco.
    hero.addEventListener("focusin", event => {
        focused = event.target.matches(":focus-visible");
        updatePlayback();
    });
    hero.addEventListener("focusout", event => {
        if (!hero.contains(event.relatedTarget)) { focused = false; updatePlayback(); }
    });
    video.addEventListener("ended", () => { if (current === 1 && !stopped()) show(0); });
    document.addEventListener("visibilitychange", updatePlayback);
    reducedMotion.addEventListener("change", event => {
        userPaused = event.matches;
        updatePlayback();
    });
    if ("IntersectionObserver" in window) {
        new IntersectionObserver(entries => {
            visible = entries[0].isIntersecting;
            updatePlayback();
        }).observe(hero);
    }
    show(0);
})();
