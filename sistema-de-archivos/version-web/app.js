/* ==========================================================================
 * app.js — Sistema de archivos
 *
 * [IA] ARCHIVO GENERADO CON INTELIGENCIA ARTIFICIAL.
 * Todo este archivo es parte de la interfaz web creada con IA; la lógica
 * original del equipo está en la sección [EQUIPO] de classes.js.
 *
 * Interfaz gráfica del sistema de archivos.
 *
 * Conecta la clase BinaryTree de classes.js con la página: inserción,
 * búsqueda y eliminación con animaciones sobre el árbol dibujado en SVG,
 * recorridos paso a paso, ficha del nodo seleccionado y bitácora.
 * ========================================================================== */

/* ---------- Medidas del dibujo ---------- */

const NODE_WIDTH = 136;
const NODE_HEIGHT = 44;
const HORIZONTAL_GAP = 18;
const LEVEL_HEIGHT = 90;
const PADDING = 24;
const MAX_LABEL_LENGTH = 11;

/* ---------- Tiempos de animación (ms) ---------- */

const SEARCH_STEP_DELAY = 380;
const INSERT_STEP_DELAY = 160;
const TRAVERSAL_STEP_DELAY = 420;
const EXIT_DURATION = 320;

const TYPE_NAMES = { directory: "Directorio", file: "Archivo" };
const TYPE_ICONS = { directory: "📁", file: "📄" };
const TRAVERSAL_NAMES = { in: "Inorden", pre: "Preorden", post: "Postorden" };
const STATE_CLASSES = ["visitando", "visitado", "encontrado", "no-encontrado", "seleccionado", "en-recorrido"];

const tree = new BinaryTree();

/** Elementos SVG de cada nodo, indexados por nombre (los nombres son únicos). */
const nodeElements = new Map();

/** Trazos SVG de cada arista, indexados por "padre>hijo". */
const edgeElements = new Map();

/** Contador para cancelar una animación cuando empieza otra. */
let animationRun = 0;

const elementForm = document.getElementById("form-elemento");
const nameField = document.getElementById("campo-nombre");
const extensionField = document.getElementById("campo-extension");
const sizeField = document.getElementById("campo-tamano");
const searchForm = document.getElementById("form-buscar");
const searchField = document.getElementById("campo-buscar");
const treeSvg = document.getElementById("arbol");
const statsElement = document.getElementById("estadisticas");
const infoCard = document.getElementById("ficha");
const sequenceElement = document.getElementById("secuencia");
const traversalTable = document.getElementById("tabla-recorrido");
const logElement = document.getElementById("bitacora");

const edgeLayer = createSvgElement("g", { class: "aristas" });
const nodeLayer = createSvgElement("g", { class: "nodos" });
treeSvg.append(edgeLayer, nodeLayer);

/* ---------- Mensajes ---------- */

/**
 * Muestra un aviso y lo registra en la bitácora.
 * @param {string} text Texto del mensaje.
 * @param {"exito"|"error"|"info"} type Tipo de mensaje.
 */
function report(text, type) {
  showToast(text, type);
  logElement.append(createElement("li", {}, text));
  logElement.scrollTop = logElement.scrollHeight;
}

/* ---------- Dibujo del árbol ---------- */

/**
 * Calcula la posición de cada nodo: la columna es su lugar en el recorrido
 * inorden y la fila es su profundidad.
 * @returns {{positions: Map<FileNode, {x: number, y: number}>, width: number, height: number}}
 */
function computeLayout() {
  const positions = new Map();
  let column = 0;
  let maxDepth = 0;

  /** Recorre el árbol en inorden asignando coordenadas. */
  function place(node, depth) {
    if (node === null) return;
    place(node.left, depth + 1);
    positions.set(node, {
      x: PADDING + column * (NODE_WIDTH + HORIZONTAL_GAP) + NODE_WIDTH / 2,
      y: PADDING + depth * LEVEL_HEIGHT + NODE_HEIGHT / 2,
    });
    maxDepth = Math.max(maxDepth, depth);
    column += 1;
    place(node.right, depth + 1);
  }

  place(tree.root, 0);

  return {
    positions,
    width: PADDING * 2 + column * NODE_WIDTH + (column - 1) * HORIZONTAL_GAP,
    height: PADDING * 2 + maxDepth * LEVEL_HEIGHT + NODE_HEIGHT,
  };
}

/**
 * Recorta un texto largo para que quepa en la caja del nodo.
 * @param {string} text Texto completo.
 * @returns {string}
 */
function shortenLabel(text) {
  return text.length > MAX_LABEL_LENGTH ? `${text.slice(0, MAX_LABEL_LENGTH - 1)}…` : text;
}

/**
 * Crea el grupo SVG que representa un nodo (caja, ícono, nombre y número de orden).
 * @param {FileNode} node Nodo a dibujar.
 * @returns {SVGGElement}
 */
function createNodeElement(node) {
  const group = createSvgElement("g", { class: `nodo ${node.fileType}`, tabindex: 0 });
  const body = createSvgElement("g", { class: "cuerpo" });
  const title = createSvgElement("title");
  const icon = createSvgElement("text", { class: "icono-nodo", x: -NODE_WIDTH / 2 + 20, y: 0 });
  const label = createSvgElement("text", { class: "nombre", x: -NODE_WIDTH / 2 + 36, y: 0 });
  const order = createSvgElement("g", { class: "orden", transform: `translate(${NODE_WIDTH / 2 - 4}, ${-NODE_HEIGHT / 2 + 2})` });
  const orderText = createSvgElement("text");

  title.textContent = `${TYPE_NAMES[node.fileType]}: ${node.fullName()} (${node.size} bytes)`;
  icon.textContent = TYPE_ICONS[node.fileType];
  label.textContent = shortenLabel(node.fullName());

  order.append(createSvgElement("circle", { r: 11 }), orderText);
  body.append(
    title,
    createSvgElement("rect", {
      class: "caja",
      x: -NODE_WIDTH / 2,
      y: -NODE_HEIGHT / 2,
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      rx: 12,
    }),
    icon,
    label,
    order,
  );
  group.append(body);

  group.addEventListener("click", () => selectNode(node.name));
  group.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectNode(node.name);
    }
  });

  return group;
}

/**
 * Trazo de una arista desde la parte inferior del padre hasta la superior del hijo.
 * @param {{x: number, y: number}} from Posición del padre.
 * @param {{x: number, y: number}} to Posición del hijo.
 * @returns {string} Definición del trazo SVG.
 */
function edgePath(from, to) {
  const startY = from.y + NODE_HEIGHT / 2;
  const endY = to.y - NODE_HEIGHT / 2;
  const middleY = (startY + endY) / 2;
  return `M ${from.x} ${startY} C ${from.x} ${middleY}, ${to.x} ${middleY}, ${to.x} ${endY}`;
}

/**
 * Sincroniza el dibujo con el árbol: los nodos existentes se deslizan a su
 * nueva posición, los nuevos aparecen y los que ya no existen se quitan.
 */
function renderTree() {
  const { positions, width, height } = computeLayout();

  // El dibujo se reduce si no cabe en el ancho disponible, pero nunca se amplía.
  treeSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  treeSvg.style.maxWidth = `${width}px`;

  // Aristas.
  const currentEdges = new Set();
  for (const [node, position] of positions) {
    for (const child of [node.left, node.right]) {
      if (child === null) continue;

      const key = `${node.name}>${child.name}`;
      const definition = edgePath(position, positions.get(child));
      let edge = edgeElements.get(key);

      if (edge === undefined) {
        edge = createSvgElement("path", { class: "arista" });
        edgeElements.set(key, edge);
        edgeLayer.append(edge);
      }
      // Una arista nueva o que cambió de lugar reaparece cuando los nodos terminan de moverse.
      if (edge.getAttribute("d") !== definition) {
        edge.setAttribute("d", definition);
        replayAnimation(edge, "entra");
      }
      currentEdges.add(key);
    }
  }
  for (const [key, edge] of edgeElements) {
    if (!currentEdges.has(key)) {
      edge.remove();
      edgeElements.delete(key);
    }
  }

  // Nodos.
  const currentNodes = new Set();
  for (const [node, position] of positions) {
    let group = nodeElements.get(node.name);

    if (group === undefined) {
      group = createNodeElement(node);
      group.classList.add("entra");
      group.addEventListener("animationend", () => group.classList.remove("entra"), { once: true });
      nodeElements.set(node.name, group);
      nodeLayer.append(group);
    }
    group.style.transform = `translate(${position.x}px, ${position.y}px)`;
    currentNodes.add(node.name);
  }
  for (const [name, group] of nodeElements) {
    if (!currentNodes.has(name)) {
      group.remove();
      nodeElements.delete(name);
    }
  }

  statsElement.textContent = `${tree.size()} nodos · altura ${tree.height()}`;
}

/** Quita los resaltados de búsqueda, selección y recorrido de todos los nodos. */
function clearHighlights() {
  for (const group of nodeElements.values()) {
    group.classList.remove(...STATE_CLASSES);
  }
}

/* ---------- Animaciones sobre el árbol ---------- */

/**
 * Anima el descenso por el árbol buscando un nombre: cada nodo visitado se
 * ilumina y al final el nodo se marca como encontrado o el último se sacude.
 * @param {string} name Nombre buscado.
 * @param {number} stepDelay Pausa entre nodos.
 * @returns {Promise<boolean>} Verdadero si el nombre existe (falso también si se canceló).
 */
async function animateSearchPath(name, stepDelay) {
  const run = ++animationRun;
  const { visited, found } = tree.searchPath(name);

  clearHighlights();

  for (const node of visited) {
    const group = nodeElements.get(node.name);
    group.classList.add("visitando");
    await wait(stepDelay);
    if (run !== animationRun) return false;
    group.classList.replace("visitando", "visitado");
  }

  const lastGroup = nodeElements.get(visited[visited.length - 1].name);
  if (found) {
    replayAnimation(lastGroup, "encontrado");
  } else {
    replayAnimation(lastGroup, "no-encontrado");
  }
  return found;
}

/**
 * Ilumina los nodos en el orden de un recorrido y los agrega a la secuencia.
 * @param {"in"|"pre"|"post"} algorithm Tipo de recorrido.
 */
async function animateTraversal(algorithm) {
  const run = ++animationRun;
  const trajectory = tree.trajectorizeTraversal(algorithm);

  clearHighlights();
  sequenceElement.replaceChildren();
  traversalTable.replaceChildren(createNodeTable(trajectory));

  for (const [index, node] of trajectory.entries()) {
    const group = nodeElements.get(node.name);
    group.querySelector(".orden text").textContent = index + 1;
    group.classList.add("en-recorrido");
    sequenceElement.append(createElement("li", {}, createElement("small", {}, index + 1), node.fullName()));

    await wait(TRAVERSAL_STEP_DELAY);
    if (run !== animationRun) return;
  }

  report(`Recorrido ${TRAVERSAL_NAMES[algorithm].toLowerCase()}: ${trajectory.map((node) => node.fullName()).join(" → ")}`, "info");
}

/* ---------- Ficha y tabla ---------- */

/**
 * Muestra la ficha con la información de un nodo y su camino desde la raíz.
 * @param {FileNode} node Nodo a describir.
 */
function showInfoCard(node) {
  const path = tree.searchPath(node.name).visited.map((visitedNode) => visitedNode.name).join(" → ");

  /** Crea un par término/valor de la ficha. */
  const entry = (term, value) => createElement("div", {}, createElement("dt", {}, term), createElement("dd", {}, value));

  infoCard.replaceChildren(
    createElement("div", { className: "ficha-icono" }, TYPE_ICONS[node.fileType]),
    createElement(
      "div",
      { className: "ficha-titulo" },
      createElement("strong", {}, node.fullName()),
      createElement("span", {}, TYPE_NAMES[node.fileType]),
    ),
    createElement(
      "dl",
      {},
      entry("Extensión", node.extension ?? "—"),
      entry("Tamaño", `${node.size} bytes`),
      entry("Camino en el árbol", path),
    ),
  );
  infoCard.classList.remove("oculto");
  replayAnimation(infoCard, "ficha");
}

/** Oculta la ficha de información. */
function hideInfoCard() {
  infoCard.classList.add("oculto");
}

/**
 * Crea la tabla de un recorrido (nombre, extensión, tamaño y tipo).
 * @param {FileNode[]} nodes Nodos en el orden del recorrido.
 * @returns {HTMLTableElement}
 */
function createNodeTable(nodes) {
  const header = createElement(
    "tr",
    {},
    createElement("th", { className: "numero" }, "#"),
    createElement("th", {}, "Nombre"),
    createElement("th", {}, "Extensión"),
    createElement("th", { className: "numero" }, "Tamaño (bytes)"),
    createElement("th", {}, "Tipo"),
  );
  const rows = nodes.map((node, index) =>
    createElement(
      "tr",
      {},
      createElement("td", { className: "numero" }, index + 1),
      createElement("td", {}, node.name),
      createElement("td", {}, node.extension ?? "—"),
      createElement("td", { className: "numero" }, node.size),
      createElement("td", {}, TYPE_NAMES[node.fileType]),
    ),
  );
  return createElement("table", {}, header, ...rows);
}

/* ---------- Operaciones ---------- */

/** @returns {"file"|"directory"} Tipo elegido en el interruptor. */
function selectedType() {
  return elementForm.elements.tipo.value;
}

/** Muestra los campos de extensión y tamaño solo cuando se crea un archivo. */
function updateFieldsForType() {
  for (const field of elementForm.querySelectorAll(".solo-archivo")) {
    field.classList.toggle("oculto", selectedType() !== "file");
  }
}

/** Crea el nodo con los datos del formulario y lo inserta con animación. */
async function insertElement() {
  const fileType = selectedType();
  let newNode;

  try {
    if (fileType === "file") {
      const sizeText = sizeField.value.trim();
      newNode = new FileNode(nameField.value.trim(), "file", sizeText === "" ? NaN : Number(sizeText), extensionField.value.trim());
    } else {
      newNode = new FileNode(nameField.value.trim(), "directory");
    }
  } catch (error) {
    report(error.message, "error");
    return;
  }

  try {
    tree.insert(newNode);
  } catch (error) {
    // Se muestra hasta dónde llegó el descenso antes de fallar.
    report(error.message, "error");
    await animateSearchPath(newNode.name, INSERT_STEP_DELAY);
    return;
  }

  renderTree();
  hideInfoCard();
  report(
    newNode.isFile()
      ? `Archivo '${newNode.fullName()}' (${newNode.size} bytes) insertado correctamente.`
      : `Directorio '${newNode.name}' insertado correctamente.`,
    "exito",
  );

  elementForm.reset();
  updateFieldsForType();
  nameField.focus();

  await animateSearchPath(newNode.name, INSERT_STEP_DELAY);
}

/**
 * Selecciona un nodo con un clic: lo resalta, muestra su ficha y llena el
 * campo de búsqueda para poder eliminarlo.
 * @param {string} name Nombre del nodo.
 */
function selectNode(name) {
  animationRun += 1;
  clearHighlights();
  nodeElements.get(name).classList.add("seleccionado");
  searchField.value = name;
  showInfoCard(tree.search(name));
}

/** Busca el nombre escrito animando el camino recorrido. */
async function searchElement() {
  const name = searchField.value.trim();

  if (name === "") {
    report("Escribe el nombre del elemento a buscar.", "error");
    return;
  }

  hideInfoCard();
  const found = await animateSearchPath(name, SEARCH_STEP_DELAY);

  if (found) {
    const node = tree.search(name);
    showInfoCard(node);
    report(`Elemento '${node.fullName()}' encontrado.`, "exito");
  } else if (!tree.searchPath(name).found) {
    report("El elemento no existe en el sistema de archivos.", "error");
  }
}

/** Elimina el elemento escrito, previa confirmación, con animación de salida. */
async function deleteElement() {
  const name = searchField.value.trim();
  let node;

  try {
    node = tree.search(name);
  } catch (error) {
    report(name === "" ? "Escribe el nombre del elemento a eliminar." : error.message, "error");
    return;
  }

  selectNode(name);
  const fullName = node.fullName();
  const confirmed = await askConfirmation(
    `¿Eliminar '${fullName}'?`,
    `Se quitará este ${TYPE_NAMES[node.fileType].toLowerCase()} del árbol. Esta acción no se puede deshacer.`,
    "Sí, eliminar",
  );

  if (!confirmed) {
    report("Eliminación cancelada.", "info");
    return;
  }

  try {
    tree.delete(name);
  } catch (error) {
    replayAnimation(nodeElements.get(name), "no-encontrado");
    report(error.message, "error");
    return;
  }

  hideInfoCard();
  searchField.value = "";
  nodeElements.get(name).classList.add("sale");
  await wait(EXIT_DURATION);
  renderTree();
  report(`Elemento '${fullName}' eliminado correctamente.`, "exito");
}

/* ---------- Eventos ---------- */

for (const radio of elementForm.elements.tipo) {
  radio.addEventListener("change", updateFieldsForType);
}

elementForm.addEventListener("submit", (event) => {
  event.preventDefault();
  insertElement();
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchElement();
});

document.getElementById("boton-eliminar").addEventListener("click", deleteElement);

for (const button of document.querySelectorAll("[data-recorrido]")) {
  button.addEventListener("click", () => animateTraversal(button.dataset.recorrido));
}

updateFieldsForType();
renderTree();
logElement.append(createElement("li", {}, `Sistema de archivos iniciado con el directorio raíz '${ROOT_DIRECTORY_NAME}'.`));
