(function () {
  "use strict";

  const nav = document.getElementById("nav");
  const navToggle = document.getElementById("nav-toggle");
  const modal = document.getElementById("course-modal");
  const modalEyebrow = document.getElementById("modal-eyebrow");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const modalList = document.getElementById("modal-list");
  const toTop = document.getElementById("to-top");
  let lastFocused = null;

  const courses = {
    violin: {
      eyebrow: "Clase 01 · Violín",
      title: "Violín desde la primera nota",
      desc: "Un recorrido suave para conocer el instrumento y empezar a producir sonido con confianza.",
      items: [
        "Postura, agarre del arco y cuidado del instrumento",
        "Afinación y primeras notas en las cuatro cuerdas",
        "Ritmos simples y melodías cortas",
        "Lectura de partituras para principiantes",
        "Ejercicios de oído y interpretación en grupo"
      ]
    },
    canto: {
      eyebrow: "Clase 02 · Canto",
      title: "Encuentra tu propia voz",
      desc: "Técnica vocal accesible, sin exigencias previas y con mucho espacio para la expresión personal.",
      items: [
        "Respiración y relajación del cuerpo",
        "Calentamiento vocal y afinación",
        "Registros, tesituras y cuidado de la voz",
        "Fraseo, dinámica y expresión",
        "Repertorio de canciones para cantar juntos"
      ]
    },
    solfeo: {
      eyebrow: "Clase 03 · Solfeo",
      title: "Aprende a leer la música",
      desc: "Las herramientas básicas para entender lo que escuchas y representarlo en el papel.",
      items: [
        "Notas, figuras rítmicas y compás",
        "Escalas, intervalos y armaduras",
        "Dictados rítmicos y entrenamiento auditivo",
        "Lectura a primera vista progresiva",
        "Análisis sencillo de piezas conocidas"
      ]
    }
  };

  /* --- Menú móvil --- */
  function closeNav() {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
  }

  navToggle.addEventListener("click", function () {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeNav);
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 980) closeNav();
  });

  /* --- Modal de temarios --- */
  function openModal(key) {
    const course = courses[key];
    if (!course) return;

    lastFocused = document.activeElement;
    modalEyebrow.textContent = course.eyebrow;
    modalTitle.textContent = course.title;
    modalDesc.textContent = course.desc;
    modalList.replaceChildren();

    course.items.forEach(function (item) {
      const li = document.createElement("li");
      li.textContent = item;
      modalList.appendChild(li);
    });

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-close").focus();
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
  }

  document.querySelectorAll("[data-course]").forEach(function (button) {
    button.addEventListener("click", function () {
      openModal(button.dataset.course);
    });
  });

  modal.querySelectorAll("[data-close]").forEach(function (element) {
    element.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    closeNav();
    closeModal();
  });

  /* --- Accesible: atrapar el foco dentro del modal --- */
  modal.addEventListener("keydown", function (event) {
    if (event.key !== "Tab") return;
    const focusable = modal.querySelectorAll("button, a[href]");
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  /* --- Preguntas frecuentes --- */
  document.querySelectorAll(".faq-q").forEach(function (button) {
    button.addEventListener("click", function () {
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      if (!panel) return;
      const willOpen = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(willOpen));
      panel.hidden = !willOpen;
    });
  });

  /* --- Animación de entrada --- */
  const revealItems = document.querySelectorAll(".reveal");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) { item.classList.add("is-visible"); });
  } else {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(function (item) { revealObserver.observe(item); });
  }

  /* --- Enlace activo del menú según la sección visible --- */
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-35% 0px -60% 0px" });
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* --- Formulario de contacto (demostración) --- */
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) {
      formStatus.textContent = "Revisa los campos marcados antes de continuar.";
      formStatus.classList.add("error");
      return;
    }
    formStatus.classList.remove("error");
    formStatus.textContent = "¡Gracias! Te avisaremos cuando abramos las próximas clases.";
    form.reset();
  });

  /* --- Registro de alumnos (envío automático a morahoreb@gmail.com) --- */
  const studentForm = document.getElementById("student-form");
  const studentStatus = document.getElementById("student-status");
  const studentSubmit = document.getElementById("student-submit");
  const formEndpoint = "https://formsubmit.co/ajax/morahoreb@gmail.com";

  function buildMailto(fields) {
    const lines = [
      "Registro de alumno - QUARTET OP34",
      "",
      "Nombre completo: " + (fields.get("nombre") || ""),
      "Correo: " + (fields.get("email") || ""),
      "Teléfono: " + (fields.get("telefono") || ""),
      "Origen: " + (fields.get("origen") || ""),
      "Ciudad o estado: " + (fields.get("ciudad") || ""),
      "Nivel: " + (fields.get("nivel") || ""),
      "Qué sabe de música: " + (fields.get("que_sabes_de_musica") || ""),
      "Prefiere contacto: " + (fields.get("medio_contacto") || "")
    ];
    return "mailto:morahoreb@gmail.com?subject=" +
      encodeURIComponent("Registro de alumno - QUARTET OP34") +
      "&body=" + encodeURIComponent(lines.join("\n"));
  }

  studentForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    studentStatus.textContent = "";
    studentStatus.classList.remove("error");

    if (!studentForm.reportValidity()) {
      studentStatus.textContent = "Revisa los campos marcados antes de continuar.";
      studentStatus.classList.add("error");
      return;
    }

    const fields = new FormData(studentForm);
    const originalLabel = studentSubmit.innerHTML;
    studentSubmit.disabled = true;
    studentSubmit.textContent = "Enviando...";

    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fields
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      studentStatus.textContent = "¡Listo! Tus datos llegaron a morahoreb@gmail.com. Te contactaremos pronto.";
      studentForm.reset();
    } catch (error) {
      studentStatus.textContent = "No se pudo completar el envío automático. ";
      const fallback = document.createElement("a");
      fallback.href = buildMailto(fields);
      fallback.textContent = "Envía el registro desde tu correo aquí.";
      studentStatus.appendChild(fallback);
      studentStatus.classList.add("error");
    } finally {
      studentSubmit.disabled = false;
      studentSubmit.innerHTML = originalLabel;
    }
  });

  /* --- Botón volver arriba --- */
  window.addEventListener("scroll", function () {
    toTop.classList.toggle("is-visible", window.scrollY > 500);
  }, { passive: true });

  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  });

  /* --- Año del pie de página --- */
  document.getElementById("year").textContent = String(new Date().getFullYear());
})();
