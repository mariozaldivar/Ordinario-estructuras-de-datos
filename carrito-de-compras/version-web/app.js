/* ==========================================================================
 * app.js — Carrito de compras
 *
 * [IA] ARCHIVO GENERADO CON INTELIGENCIA ARTIFICIAL.
 * Todo este archivo es parte de la interfaz web creada con IA; la lógica
 * original del equipo está en la sección [EQUIPO] de classes.js.
 *
 * Interfaz gráfica del carrito de compras.
 *
 * Conecta las clases de classes.js (Catalogue, Cart) con la página: dibuja el
 * catálogo en tarjetas y el carrito como lista animada, valida las cantidades
 * y muestra el ticket al finalizar la compra.
 * ========================================================================== */

/** Ícono de cada producto del catálogo, por identificador. */
const PRODUCT_ICONS = { 1: "⌨️", 2: "🖱️", 3: "🖥️", 4: "🎧", 5: "💾" };
const DEFAULT_ICON = "📦";

/** Duración de la animación de salida de un renglón, en milisegundos. */
const ROW_EXIT_DURATION = 280;

/** Tiempo que permanece resaltado un producto encontrado, en milisegundos. */
const HIGHLIGHT_DURATION = 2500;

const catalogue = new Catalogue();
const cart = new Cart();

const currencyFormat = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" });

const catalogueElement = document.getElementById("catalogo");
const cartList = document.getElementById("lista-carrito");
const itemCountElement = document.getElementById("total-articulos");
const totalElement = document.getElementById("total-carrito");
const searchForm = document.getElementById("form-buscar");
const searchInput = document.getElementById("buscar-id");
const ticketDialog = document.getElementById("dialogo-ticket");
const ticketElement = document.getElementById("ticket");

/**
 * @param {number} id Identificador del producto.
 * @returns {string} Ícono del producto.
 */
function productIcon(id) {
  return PRODUCT_ICONS[id] ?? DEFAULT_ICON;
}

/**
 * Convierte el texto de un campo a una cantidad válida.
 * @param {string} text Texto ingresado.
 * @returns {number} Entero positivo.
 * @throws {Error} Si el texto no es un entero positivo.
 */
function parseQuantity(text) {
  const quantity = Number(text);

  if (text.trim() === "" || !Number.isInteger(quantity)) {
    throw new Error("La cantidad del producto debe ser un número entero.");
  }
  if (quantity <= 0) {
    throw new Error("La cantidad del producto debe ser un entero positivo.");
  }
  return quantity;
}

/**
 * Crea un selector de cantidad con botones − y +.
 * @param {number} initialValue Cantidad inicial.
 * @param {(value: string) => void} [onChange] Se llama cuando el usuario cambia la cantidad.
 * @returns {{element: HTMLElement, input: HTMLInputElement}}
 */
function createQuantityStepper(initialValue, onChange) {
  const input = createElement("input", { type: "number", min: 1, step: 1, value: initialValue });
  const minus = createElement("button", { type: "button", title: "Quitar uno" }, "−");
  const plus = createElement("button", { type: "button", title: "Agregar uno" }, "+");

  input.setAttribute("aria-label", "Cantidad");

  /** Suma o resta una unidad sin bajar de 1. */
  const step = (delta) => {
    const current = Number.parseInt(input.value, 10) || 1;
    input.value = Math.max(1, current + delta);
    onChange?.(input.value);
  };

  minus.addEventListener("click", () => step(-1));
  plus.addEventListener("click", () => step(1));
  input.addEventListener("change", () => onChange?.(input.value));

  return { element: createElement("div", { className: "cantidad" }, minus, input, plus), input };
}

/* ---------- Dibujo ---------- */

/** Dibuja el catálogo como tarjetas con selector de cantidad y botón Agregar. */
function renderCatalogue() {
  catalogueElement.replaceChildren();

  for (const product of catalogue.products) {
    const stepper = createQuantityStepper(1);
    const addButton = createElement("button", { type: "button" }, "Agregar");

    addButton.addEventListener("click", () => addToCart(product.id, stepper.input));

    const card = createElement(
      "article",
      { className: "producto" },
      createElement("span", { className: "producto-icono" }, productIcon(product.id)),
      createElement("span", { className: "producto-id" }, `ID ${product.id}`),
      createElement("span", { className: "producto-nombre" }, product.name),
      createElement("span", { className: "producto-categoria" }, product.category),
      createElement("span", { className: "producto-precio" }, currencyFormat.format(product.price)),
      stepper.element,
      addButton,
    );
    card.dataset.id = product.id;
    catalogueElement.append(card);
  }
}

/**
 * Dibuja el carrito y los totales.
 * @param {{addedId?: number, changedId?: number}} [highlight] Renglón recién agregado o modificado.
 */
function renderCart(highlight = {}) {
  cartList.replaceChildren();

  if (cart.isEmpty()) {
    cartList.append(
      createElement(
        "li",
        { className: "vacio-estado" },
        createElement("span", { className: "grande" }, "🛒"),
        "Tu carrito está vacío. Agrega productos desde el catálogo.",
      ),
    );
  }

  for (const entry of cart.entries) {
    const stepper = createQuantityStepper(entry.quantity, (value) => changeQuantity(entry.id, value));
    const removeButton = createElement("button", { type: "button", className: "icono quitar", title: "Quitar del carrito" }, "✕");
    const subtotal = createElement("span", { className: "renglon-subtotal" }, currencyFormat.format(entry.subtotal));

    removeButton.setAttribute("aria-label", `Quitar ${entry.name}`);
    removeButton.addEventListener("click", () => removeFromCart(entry.id));

    const row = createElement(
      "li",
      { className: "renglon" },
      createElement("span", { className: "renglon-icono" }, productIcon(entry.id)),
      createElement(
        "div",
        {},
        createElement("div", { className: "renglon-nombre" }, entry.name),
        createElement("div", { className: "renglon-precio" }, `${currencyFormat.format(entry.price)} c/u`),
      ),
      stepper.element,
      subtotal,
      removeButton,
    );
    row.dataset.id = entry.id;

    if (entry.id === highlight.addedId) row.classList.add("entra");
    if (entry.id === highlight.changedId) subtotal.classList.add("cambia");

    cartList.append(row);
  }

  updateTotals();
}

/** Actualiza el número de artículos y el total, animándolos si cambiaron. */
function updateTotals() {
  const itemCount = String(cart.getItemCount());
  const total = currencyFormat.format(cart.getTotal());

  if (itemCountElement.textContent !== itemCount) {
    itemCountElement.textContent = itemCount;
    replayAnimation(itemCountElement, "cambia");
  }
  if (totalElement.textContent !== total) {
    totalElement.textContent = total;
    replayAnimation(totalElement, "cambia");
  }
}

/**
 * Anima la salida de renglones del carrito antes de quitarlos.
 * @param {Element[]} rows Renglones a animar.
 */
async function animateRowsOut(rows) {
  for (const row of rows) {
    row.classList.add("sale");
  }
  await wait(ROW_EXIT_DURATION);
}

/* ---------- Operaciones ---------- */

/**
 * Agrega un producto del catálogo al carrito.
 * @param {number} id Identificador del producto.
 * @param {HTMLInputElement} quantityInput Campo con la cantidad elegida.
 */
function addToCart(id, quantityInput) {
  try {
    const product = catalogue.searchProduct(id);
    const quantity = parseQuantity(quantityInput.value);
    const alreadyInCart = cart.contains(id);

    cart.addOrIncrease(product, quantity);
    renderCart(alreadyInCart ? { changedId: id } : { addedId: id });
    quantityInput.value = 1;
    showToast(`${product.name} ×${quantity} agregado al carrito.`, "exito");
  } catch (error) {
    showToast(error.message, "error");
  }
}

/**
 * Modifica la cantidad de un producto del carrito.
 * @param {number} id Identificador del producto.
 * @param {string} quantityText Nueva cantidad escrita por el usuario.
 */
function changeQuantity(id, quantityText) {
  try {
    cart.updateQuantity(id, parseQuantity(quantityText));
  } catch (error) {
    showToast(error.message, "error");
  }
  renderCart({ changedId: id });
}

/**
 * Elimina un producto del carrito después de pedir confirmación.
 * @param {number} id Identificador del producto.
 */
async function removeFromCart(id) {
  const entry = cart.searchEntries(id);
  const confirmed = await askConfirmation(`¿Quitar ${entry.name}?`, "El producto se eliminará del carrito.", "Sí, quitar");

  if (!confirmed) return;

  await animateRowsOut([cartList.querySelector(`[data-id="${id}"]`)]);
  cart.removeProduct(id);
  renderCart();
  showToast("Producto eliminado del carrito.", "exito");
}

/** Vacía el carrito después de pedir confirmación. */
async function emptyCart() {
  if (cart.isEmpty()) {
    showToast("El carrito ya está vacío.", "info");
    return;
  }

  const confirmed = await askConfirmation("¿Vaciar el carrito?", "Se quitarán todos los productos.", "Sí, vaciar");
  if (!confirmed) return;

  await animateRowsOut([...cartList.querySelectorAll(".renglon")]);
  cart.empty();
  renderCart();
  showToast("Carrito vaciado.", "exito");
}

/** Muestra el ticket de la compra (productos, artículos y total) y reinicia el carrito. */
function finishPurchase() {
  if (cart.isEmpty()) {
    showToast("No se puede finalizar la compra: el carrito está vacío.", "error");
    return;
  }

  /** Crea una línea del ticket con texto a la izquierda y valor a la derecha. */
  const line = (label, value, className = "ticket-linea") =>
    createElement("div", { className }, createElement("span", {}, label), createElement("span", {}, value));

  ticketElement.replaceChildren(
    ...cart.entries.map((entry) => line(`${entry.name} ×${entry.quantity}`, currencyFormat.format(entry.subtotal))),
    line("Productos distintos", cart.entries.length, "ticket-linea ticket-total"),
    line("Artículos", cart.getItemCount()),
    line("Monto total", currencyFormat.format(cart.getTotal()), "ticket-linea ticket-total"),
  );

  ticketDialog.showModal();
  cart.empty();
  renderCart();
}

/**
 * Busca un producto por ID y lo resalta en el catálogo.
 * @param {string} idText ID escrito por el usuario.
 */
function searchProduct(idText) {
  const id = Number(idText);

  try {
    if (idText.trim() === "" || !Number.isInteger(id) || id <= 0) {
      throw new Error("El ID del producto debe ser un entero positivo.");
    }

    const product = catalogue.searchProduct(id);
    const card = catalogueElement.querySelector(`[data-id="${id}"]`);

    card.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
    replayAnimation(card, "destacado");
    setTimeout(() => card.classList.remove("destacado"), HIGHLIGHT_DURATION);
    showToast(`Encontrado: ${product.name} (${product.category}) — ${currencyFormat.format(product.price)}`, "exito");
  } catch (error) {
    showToast(error.message, "error");
  }
}

/* ---------- Eventos ---------- */

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchProduct(searchInput.value);
});

document.getElementById("boton-vaciar").addEventListener("click", emptyCart);
document.getElementById("boton-finalizar").addEventListener("click", finishPurchase);

renderCatalogue();
renderCart();
