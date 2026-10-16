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

// Carrusel comercial de cuatro diapositivas
(() => {
    const hero = document.getElementById("inicio");
    const slides = Array.from(hero.querySelectorAll(".commercial-slide"));
    const dots = Array.from(hero.querySelectorAll(".commercial-dot"));
    const video = document.getElementById("oilVideo");
    const pauseButton = document.getElementById("commercialPause");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let current = 0;
    let timer;
    let startedAt = 0;
    let remaining = 6000;
    let userPaused = reducedMotion.matches;
    let focused = false;
    let visible = true;

    hero.classList.add("is-enhanced");
    video.muted = true;

    function syncPlayback() {
        if (startedAt) remaining = Math.max(0, remaining - (performance.now() - startedAt));
        clearTimeout(timer);
        startedAt = 0;
        const paused = userPaused || focused || document.hidden || !visible;
        hero.classList.toggle("is-paused", paused);
        pauseButton.setAttribute("aria-pressed", String(userPaused));
        pauseButton.setAttribute("aria-label", userPaused ? "Continuar presentación automática" : "Pausar presentación automática");
        if (paused) {
            video.pause();
            return;
        }
        if (slides[current].contains(video)) {
            const attempt = video.play();
            if (attempt) attempt.catch(() => {});
        } else {
            video.pause();
        }
        startedAt = performance.now();
        timer = setTimeout(() => show(current + 1), remaining);
    }

    function show(index) {
        clearTimeout(timer);
        startedAt = 0;
        video.pause();
        current = (index + slides.length) % slides.length;
        remaining = Number(slides[current].dataset.dur || 6) * 1000;
        slides.forEach((slide, i) => {
            slide.classList.toggle("is-active", i === current);
            slide.inert = i !== current;
            slide.setAttribute("aria-hidden", String(i !== current));
            slide.id = `commercialSlide${i}`;
        });
        dots.forEach((dot, i) => {
            dot.classList.remove("is-active");
            dot.style.setProperty("--dur", `${slides[i].dataset.dur || 6}s`);
            dot.setAttribute("aria-pressed", String(i === current));
            dot.setAttribute("aria-controls", `commercialSlide${i}`);
        });
        // Reinicia la barra visual también al volver a la misma diapositiva.
        void dots[current].offsetWidth;
        dots[current].classList.add("is-active");
        if (slides[current].contains(video)) video.currentTime = 0;
        syncPlayback();
    }

    dots.forEach((dot, i) => dot.addEventListener("click", () => show(i)));
    document.getElementById("commercialPrevious").addEventListener("click", () => show(current - 1));
    document.getElementById("commercialNext").addEventListener("click", () => show(current + 1));
    pauseButton.addEventListener("click", () => {
        userPaused = !userPaused;
        syncPlayback();
    });
    hero.addEventListener("focusin", event => {
        focused = event.target.matches(":focus-visible");
        syncPlayback();
    });
    hero.addEventListener("focusout", event => {
        if (!hero.contains(event.relatedTarget)) { focused = false; syncPlayback(); }
    });
    document.addEventListener("visibilitychange", syncPlayback);
    reducedMotion.addEventListener("change", event => {
        userPaused = event.matches;
        syncPlayback();
    });
    if ("IntersectionObserver" in window) {
        new IntersectionObserver(entries => {
            visible = entries[0].isIntersecting;
            syncPlayback();
        }).observe(hero);
    }
    // Ajusta la altura mínima en móviles para que precio, botones y controles no se superpongan.
    function fitMobileContent() {
        if (window.innerWidth > 640) { hero.style.removeProperty("--commercial-mobile-height"); return; }
        let required = 600;
        slides.forEach(slide => {
            const copy = slide.querySelector(".commercial-copy");
            const children = Array.from(copy.children);
            const height = children.reduce((total, child) => {
                const style = getComputedStyle(child);
                return total + child.offsetHeight + parseFloat(style.marginTop || 0) + parseFloat(style.marginBottom || 0);
            }, 0);
            required = Math.max(required, height + 130);
        });
        hero.style.setProperty("--commercial-mobile-height", `${Math.ceil(required)}px`);
    }
    window.addEventListener("resize", fitMobileContent);
    if (document.fonts) document.fonts.ready.then(fitMobileContent);
    fitMobileContent();
    show(0);
})();
