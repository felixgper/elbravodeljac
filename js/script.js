// Menú para celulares y tabletas
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const compactNavigation = window.matchMedia("(max-width: 1240px)");
function closeNavigation() {
    navMenu.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
    navMenu.inert = compactNavigation.matches;
}
navToggle.addEventListener("click", () => {
    const open = !navMenu.classList.contains("is-open");
    navMenu.classList.toggle("is-open", open);
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    navMenu.inert = !open && compactNavigation.matches;
});
navMenu.querySelectorAll("a, button").forEach(link => link.addEventListener("click", closeNavigation));
compactNavigation.addEventListener("change", closeNavigation);
document.addEventListener("keydown", event => {
    if (event.key === "Escape" && navMenu.classList.contains("is-open")) {
        closeNavigation(); navToggle.focus();
    }
});
closeNavigation();

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
    if (submitButton.disabled) return;

    const nombre = document.getElementById("nombre").value.trim();
    const telefono = document.getElementById("telefono").value.trim();

    if (nombre === "" || telefono === "") {
        formStatus.textContent = "Completa tu nombre y teléfono.";
        formStatus.dataset.state = "error";
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";
    formStatus.textContent = "Enviando solicitud...";
    formStatus.dataset.state = "sending";

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
                "Recibimos tu solicitud. Nos comunicaremos contigo para coordinar la revisión.";

            formStatus.dataset.state = "success";
            formulario.reset();
        } else {
            formStatus.textContent =
                "No se pudo enviar la solicitud. Inténtalo nuevamente.";
            formStatus.dataset.state = "error";
        }

    } catch (error) {
        formStatus.textContent =
            "Ocurrió un problema al enviar la solicitud. Inténtalo nuevamente.";
        formStatus.dataset.state = "error";
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Enviar solicitud";
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
        const paused = userPaused || focused || document.hidden || !visible || document.getElementById("diagnosticDialog").open;
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
    document.addEventListener("diagnosticvisibilitychange", syncPlayback);
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


// Todos los botones de diagnóstico comparten este formulario.
(() => {
    const dialog = document.getElementById("diagnosticDialog");
    let opener;
    document.querySelectorAll("[data-open-diagnostic]").forEach(button => {
        button.addEventListener("click", () => {
            opener = button;
            if (!dialog.open) dialog.showModal();
            document.body.classList.add("dialog-open");
            document.dispatchEvent(new Event("diagnosticvisibilitychange"));
            document.getElementById("nombre").focus({ preventScroll: true });
        });
    });
    document.getElementById("closeDiagnostic").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener("close", () => {
        document.body.classList.remove("dialog-open");
        document.dispatchEvent(new Event("diagnosticvisibilitychange"));
        if (opener && navMenu.contains(opener) && compactNavigation.matches && !navMenu.classList.contains("is-open")) navToggle.focus();
        else if (opener && opener.isConnected) opener.focus();
    });
    formulario.addEventListener("input", () => {
        if (formStatus.dataset.state === "success") {
            formStatus.textContent = "";
            delete formStatus.dataset.state;
        }
    });
})();

// Activa las redes cuando se completen sus direcciones oficiales en config.js.
document.querySelectorAll("[data-social]").forEach(placeholder => {
    const url = (window.TALLER_REDES || {})[placeholder.dataset.social];
    if (!url) return;
    try {
        const parsed = new URL(url);
        if (!["https:", "http:"].includes(parsed.protocol)) return;
        const link = document.createElement("a");
        link.href = parsed.href;
        link.target = "_blank";
        link.rel = "noopener";
        link.dataset.social = placeholder.dataset.social;
        link.setAttribute("aria-label", placeholder.getAttribute("aria-label"));
        link.innerHTML = placeholder.innerHTML;
        placeholder.replaceWith(link);
    } catch { /* Conserva el ícono cuando no se configuró una dirección válida. */ }
});


// Motivos para elegir el taller: navegación manual, sin avance automático.
(() => {
    const banner = document.getElementById("whyBanner");
    if (!banner) return;
    const slides = Array.from(banner.querySelectorAll(".why-banner__slide"));
    const dots = Array.from(banner.querySelectorAll("[data-why-index]"));
    const counter = document.getElementById("whyBannerCurrent");
    let current = 0;
    let touchStart = null;

    function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => {
            slide.classList.toggle("is-active", i === current);
            slide.inert = i !== current;
            slide.setAttribute("aria-hidden", String(i !== current));
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle("is-active", i === current);
            dot.setAttribute("aria-pressed", String(i === current));
        });
        counter.textContent = String(current + 1).padStart(2, "0");
    }

    document.getElementById("whyBannerPrevious").addEventListener("click", () => show(current - 1));
    document.getElementById("whyBannerNext").addEventListener("click", () => show(current + 1));
    dots.forEach((dot, i) => dot.addEventListener("click", () => show(i)));
    banner.addEventListener("keydown", event => {
        if (event.target.closest("a, input, textarea, select, [data-open-diagnostic]")) return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            show(current + (event.key === "ArrowRight" ? 1 : -1));
        }
    });
    banner.addEventListener("pointerdown", event => {
        touchStart = event.pointerType === "touch" && !event.target.closest("a, button")
            ? { x: event.clientX, y: event.clientY } : null;
    }, { passive: true });
    banner.addEventListener("pointerup", event => {
        if (!touchStart) return;
        const dx = event.clientX - touchStart.x;
        const dy = event.clientY - touchStart.y;
        touchStart = null;
        if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1));
    }, { passive: true });
    banner.addEventListener("pointercancel", () => { touchStart = null; });
    banner.classList.add("is-enhanced");
    show(0);
})();
