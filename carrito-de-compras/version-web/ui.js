/* ==========================================================================
 * ui.js — Carrito de compras
 *
 * [IA] ARCHIVO GENERADO CON INTELIGENCIA ARTIFICIAL.
 * Todo este archivo es parte de la interfaz web creada con IA; la lógica
 * original del equipo está en la sección [EQUIPO] de classes.js.
 *
 * Utilidades de interfaz compartidas: creación de elementos, avisos flotantes,
 * diálogo de confirmación y pausas para las animaciones.
 * ========================================================================== */

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

/** Duración que permanece visible un aviso, en milisegundos. */
const TOAST_DURATION = 3200;

/** Cantidad máxima de avisos visibles al mismo tiempo. */
const MAX_TOASTS = 3;

/** Verdadero si el usuario pidió reducir el movimiento en su sistema. */
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Crea un elemento HTML con propiedades e hijos. El texto se agrega como nodo
 * de texto, por lo que nunca se interpreta como HTML.
 * @param {string} tag Etiqueta del elemento.
 * @param {object} [properties] Propiedades a asignar (className, type, value...).
 * @param {...(Node|string|number)} children Hijos del elemento.
 * @returns {HTMLElement}
 */
function createElement(tag, properties = {}, ...children) {
  const element = document.createElement(tag);
  Object.assign(element, properties);
  for (const child of children) {
    element.append(child instanceof window.Node ? child : String(child));
  }
  return element;
}

/**
 * Crea un elemento SVG con los atributos indicados.
 * @param {string} tag Etiqueta SVG.
 * @param {object} [attributes] Atributos SVG.
 * @returns {SVGElement}
 */
function createSvgElement(tag, attributes = {}) {
  const element = document.createElementNS(SVG_NAMESPACE, tag);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
  return element;
}

/**
 * Muestra un aviso flotante en la parte inferior que desaparece solo.
 * @param {string} text Texto del aviso.
 * @param {"exito"|"error"|"info"} [type="info"] Tipo de aviso (define el color del punto).
 */
function showToast(text, type = "info") {
  let container = document.querySelector(".avisos");

  if (container === null) {
    container = createElement("div", { className: "avisos" });
    container.setAttribute("role", "status");
    container.setAttribute("aria-live", "polite");
    document.body.append(container);
  }

  while (container.children.length >= MAX_TOASTS) {
    container.firstElementChild.remove();
  }

  const toast = createElement("div", { className: `aviso ${type}` }, text);
  container.append(toast);

  setTimeout(() => {
    toast.classList.add("sale");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  }, TOAST_DURATION);
}

/**
 * Pide confirmación con el diálogo #dialogo-confirmar de la página.
 * @param {string} title Título de la pregunta.
 * @param {string} detail Texto explicativo.
 * @param {string} [confirmLabel="Sí, continuar"] Texto del botón de confirmación.
 * @returns {Promise<boolean>} Verdadero si el usuario confirma.
 */
function askConfirmation(title, detail, confirmLabel = "Sí, continuar") {
  const dialog = document.getElementById("dialogo-confirmar");

  dialog.querySelector("h3").textContent = title;
  dialog.querySelector("p").textContent = detail;
  dialog.querySelector('button[value="si"]').textContent = confirmLabel;
  dialog.showModal();

  // Se responde al clic en un botón o a la tecla Esc ("cancel") en lugar de
  // esperar el evento "close", para que cada pregunta reciba su propia respuesta.
  return new Promise((resolve) => {
    const buttons = dialog.querySelectorAll("button[value]");

    /** Quita los escuchadores y entrega la respuesta. */
    const answer = (accepted) => {
      for (const button of buttons) button.removeEventListener("click", onClick);
      dialog.removeEventListener("cancel", onCancel);
      resolve(accepted);
    };
    const onClick = (event) => answer(event.currentTarget.value === "si");
    const onCancel = () => answer(false);

    for (const button of buttons) button.addEventListener("click", onClick);
    dialog.addEventListener("cancel", onCancel);
  });
}

/**
 * Espera el tiempo indicado (no espera si el usuario pidió reducir el movimiento).
 * @param {number} milliseconds Tiempo de espera.
 * @returns {Promise<void>}
 */
function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, reducedMotion ? 0 : milliseconds));
}

/**
 * Reinicia una animación CSS quitando y volviendo a poner una clase.
 * @param {Element} element Elemento a animar.
 * @param {string} className Clase que dispara la animación.
 */
function replayAnimation(element, className) {
  element.classList.remove(className);
  void element.getBoundingClientRect(); // Fuerza al navegador a recalcular estilos.
  element.classList.add(className);
}
