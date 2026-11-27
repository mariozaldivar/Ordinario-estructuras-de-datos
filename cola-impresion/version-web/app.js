/* ==========================================================================
 * app.js — Cola de impresión (versión estática)
 *
 * [IA] ARCHIVO GENERADO CON INTELIGENCIA ARTIFICIAL.
 * Traducción a JavaScript sin React de frontend/src/App.jsx y sus
 * componentes (Queue, QueueFile, Upload). Usa ApiSimulada de cola.js en
 * lugar de la API real.
 * ========================================================================== */

/** Debe coincidir con --salida en styles.css. */
const DURACION_SALIDA = 380;

const api = new ApiSimulada();

const estado = {
  files: [],
  pending: [],
  printing: false,
  error: null,
  notice: null,
};

let contadorPendientes = 0;

const $queue = document.getElementById("queue");
const $message = document.getElementById("message");
const $upload = document.getElementById("upload");
const $browse = document.getElementById("browse");
const $input = document.getElementById("file-input");

/* ---------- Utilidades (frontend/src/format.js) ---------- */

/** Extensión del archivo para la insignia redonda; máximo 4 caracteres. */
function fileExtension(name) {
  const punto = name.lastIndexOf(".");
  if (punto === -1 || punto === name.length - 1) return "?";
  return name.slice(punto + 1, punto + 5).toUpperCase();
}

function crear(etiqueta, clase, texto) {
  const elemento = document.createElement(etiqueta);
  if (clase) elemento.className = clase;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

function porcentaje(progreso) {
  return Math.round((progreso.loaded / Math.max(progreso.total, 1)) * 100);
}

/* ---------- Dibujo (Queue.jsx y QueueFile.jsx) ---------- */

function crearTarjeta({ name, position, isFront = false, progress = null }) {
  const li = crear("li", "queue-card");
  if (isFront) li.classList.add("is-front");
  if (progress) {
    li.classList.add("is-uploading");
    li.dataset.pendiente = progress.id;
  }

  const interior = crear("div", "card-inner");
  const insignia = crear("span", "card-badge", fileExtension(name));
  insignia.setAttribute("aria-hidden", "true");
  const nombre = crear("span", "card-name", name);
  nombre.title = name;
  interior.append(insignia, nombre);

  if (progress) {
    const valor = porcentaje(progress);
    const barra = crear("span", "card-bar");
    const relleno = crear("span", "card-bar-fill");
    relleno.style.width = `${valor}%`;
    barra.append(relleno);
    interior.append(crear("span", "card-detail", `${valor}%`), barra);
  } else if (isFront) {
    const boton = crear(
      "button",
      "print-button",
      estado.printing ? "Imprimiendo" : "Imprimir",
    );
    boton.type = "button";
    boton.disabled = estado.printing;
    boton.addEventListener("click", handlePrint);
    interior.append(boton);
  } else {
    interior.append(crear("span", "card-detail", `Posición ${position}`));
  }

  li.append(interior);
  return li;
}

function renderQueue() {
  const { files, pending } = estado;
  $queue.replaceChildren();

  if (files.length === 0 && pending.length === 0) {
    $queue.append(
      crear("p", "queue-empty", "La cola está vacía. Sube un archivo para encolarlo."),
    );
    return;
  }

  const pista = crear("ol", "queue-track");
  files.forEach((name, indice) => {
    pista.append(crearTarjeta({ name, position: indice + 1, isFront: indice === 0 }));
  });
  pending.forEach((archivo) => {
    pista.append(
      crearTarjeta({ name: archivo.name, position: files.length + 1, progress: archivo }),
    );
  });

  const eje = crear("div", "queue-axis");
  eje.append(crear("span", "", "← sale por el frente"), crear("span", "", "entra por el final →"));
  $queue.append(pista, eje);
}

function renderMessage() {
  const enEspera = estado.files.length;
  $message.classList.toggle("is-error", Boolean(estado.error));
  if (estado.error) {
    $message.textContent = estado.error;
  } else if (estado.notice) {
    $message.textContent = estado.notice;
  } else if (enEspera === 0) {
    $message.textContent = "Sin trabajos en espera";
  } else if (enEspera === 1) {
    $message.textContent = "1 trabajo en espera";
  } else {
    $message.textContent = `${enEspera} trabajos en espera`;
  }
}

function render() {
  // Mientras sale el trabajo impreso no se redibuja, para no cortar la animación.
  if (!estado.printing) renderQueue();
  $browse.disabled = estado.printing;
  renderMessage();
}

/** Actualiza solo la barra de una subida, sin redibujar toda la cola. */
function renderProgreso(archivo) {
  const tarjeta = $queue.querySelector(`[data-pendiente="${archivo.id}"]`);
  if (!tarjeta) return;
  const valor = porcentaje(archivo);
  tarjeta.querySelector(".card-detail").textContent = `${valor}%`;
  tarjeta.querySelector(".card-bar-fill").style.width = `${valor}%`;
}

/* ---------- Acciones (App.jsx) ---------- */

async function refresh() {
  try {
    estado.files = await api.fetchQueue();
    estado.error = null;
  } catch (problema) {
    estado.error = problema.message;
  }
  render();
}

async function handleFiles(archivos) {
  estado.notice = null;

  for (const archivo of archivos) {
    const pendiente = {
      id: ++contadorPendientes,
      name: archivo.name,
      loaded: 0,
      total: archivo.size,
    };
    estado.pending.push(pendiente);
    render();

    try {
      await api.uploadFile(archivo, (loaded, total) => {
        pendiente.loaded = loaded;
        pendiente.total = total;
        renderProgreso(pendiente);
      });
      estado.error = null;
      estado.notice = `Encolaste ${archivo.name}`;
    } catch (problema) {
      estado.error = problema.message;
    } finally {
      estado.pending = estado.pending.filter((item) => item.id !== pendiente.id);
    }

    await refresh();
  }
}

async function handlePrint() {
  if (estado.files.length === 0 || estado.printing) return;

  estado.notice = null;
  const frente = $queue.querySelector(".queue-card.is-front");
  const boton = frente?.querySelector(".print-button");
  if (boton) {
    boton.textContent = "Imprimiendo";
    boton.disabled = true;
  }
  frente?.classList.add("is-leaving");
  frente?.setAttribute("aria-hidden", "true");
  estado.printing = true;
  render();

  try {
    const resultado = await api.printFile();
    await new Promise((listo) => setTimeout(listo, DURACION_SALIDA));
    estado.error = null;
    estado.notice = `Imprimiste ${resultado.name}`;
  } catch (problema) {
    estado.error = problema.message;
  } finally {
    estado.printing = false;
    await refresh();
  }
}

/* ---------- Subida (Upload.jsx) ---------- */

function entregarArchivos(fileList) {
  const archivos = Array.from(fileList ?? []);
  if (archivos.length > 0) handleFiles(archivos);
}

$browse.addEventListener("click", () => $input.click());

$input.addEventListener("change", () => {
  entregarArchivos($input.files);
  $input.value = "";
});

$upload.addEventListener("dragover", (event) => {
  event.preventDefault();
  if (!estado.printing) $upload.classList.add("is-dragging");
});

$upload.addEventListener("dragleave", () => $upload.classList.remove("is-dragging"));

$upload.addEventListener("drop", (event) => {
  event.preventDefault();
  $upload.classList.remove("is-dragging");
  if (!estado.printing) entregarArchivos(event.dataTransfer.files);
});

refresh();
