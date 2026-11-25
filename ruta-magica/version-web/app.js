/* ==========================================================================
 * app.js — Ruta mágica
 *
 * Construye el grafo de Pueblos Mágicos de Yucatán, lo dibuja sobre un mapa
 * aproximado y calcula con Dijkstra la ruta más corta entre el origen y el
 * destino elegidos, animando cada tramo. También muestra la matriz de
 * adyacencia y los grados de los vértices.
 *
 * Origen del código:
 *   [EQUIPO] Datos originales del equipo (pueblos, ciudad de conexión y
 *            distancias investigadas), tomados de version-cli/main.py.
 *   [IA]     Todo lo demás: la interfaz web generada con inteligencia artificial.
 * ========================================================================== */

/* ##########################################################################
 * [EQUIPO] DATOS ORIGINALES DEL GRAFO
 * ########################################################################## */

/** Lugar que no es Pueblo Mágico y se incluye como punto de conexión. */
const CONNECTION_CITY = "Mérida";

/**
 * Crea el grafo con los Pueblos Mágicos y las distancias investigadas.
 *
 * El peso de cada arista se expresa en kilómetros y representa el recorrido de
 * un lugar a uno vecino por una o más carreteras.
 *
 * Fuentes:
 *  - Sisal–Mérida: https://ca.drivebestway.com/distance/sisal-mx/m%C3%A9rida-mx
 *  - Espita–Valladolid: https://www.rome2rio.com/map/Espita-Municipality/Valladolid-Yucat%C3%A1n-Mexico
 *  - Izamal–Espita: https://www.rome2rio.com/es/map/Municipio-de-Izamal/Municipio-de-Espita
 *  - Mérida–Maní: https://ca.drivebestway.com/distance/m%C3%A9rida-mx/man%C3%AD-mx
 *  - Maní–Tekax: https://www.rome2rio.com/map/Man%C3%AD-Municipality/Tekax-Municipality
 *  - Resto de aristas: https://www.drivebestway.com/mileage-chart-with-distances-between-cities/mx-yucatan
 *
 * @returns {Graph}
 */
function createGraph() {
  const graph = new Graph("Pueblos", new Vertex(CONNECTION_CITY));

  for (const name of ["Maní", "Espita", "Izamal", "Motul", "Sisal", "Tekax", "Valladolid"]) {
    graph.insertVertex(new Vertex(name));
  }

  graph.insertEdge("Sisal", "Mérida", 54);
  graph.insertEdge("Mérida", "Motul", 43);
  graph.insertEdge("Motul", "Izamal", 38);
  graph.insertEdge("Mérida", "Izamal", 71);
  graph.insertEdge("Izamal", "Espita", 76);
  graph.insertEdge("Espita", "Valladolid", 51);
  graph.insertEdge("Mérida", "Maní", 95);
  graph.insertEdge("Maní", "Tekax", 39);

  return graph;
}

/* ##########################################################################
 * [IA] GENERADO CON INTELIGENCIA ARTIFICIAL: interfaz web
 * ########################################################################## */

/**
 * Coordenadas geográficas aproximadas (latitud, longitud) de cada lugar.
 * Solo se usan para dibujar el mapa; no intervienen en el cálculo de rutas.
 */
const COORDINATES = {
  Mérida: [20.97, -89.62],
  Sisal: [21.17, -90.03],
  Motul: [21.1, -89.28],
  Izamal: [20.93, -89.02],
  Espita: [21.01, -88.31],
  Valladolid: [20.69, -88.2],
  Maní: [20.39, -89.39],
  Tekax: [20.2, -89.29],
};

/**
 * Posición de la etiqueta de algunos pueblos respecto a su punto, para que no
 * se encime con las carreteras ni con las distancias. Por defecto va arriba.
 */
const LABEL_POSITIONS = {
  Mérida: { dx: -16, dy: 26, anchor: "end" },
  Izamal: { dx: 0, dy: 34, anchor: "middle" },
  Tekax: { dx: 0, dy: 36, anchor: "middle" },
  Valladolid: { dx: 0, dy: 36, anchor: "middle" },
};
const DEFAULT_LABEL_POSITION = { dx: 0, dy: -20, anchor: "middle" };

/** Duración del dibujo de cada tramo de la ruta, en milisegundos. */
const LEG_DURATION = 520;

const graph = createGraph();
const adjacencyMatrix = graph.createAdjacencyMatrix();
const vertexNames = graph.vertexNames();

/** Elementos SVG de cada pueblo, indexados por nombre. */
const townElements = new Map();

/** Qué se elige con el siguiente clic en el mapa: "origen" o "destino". */
let nextPick = "origen";

/** Contador para cancelar la animación de una ruta cuando empieza otra. */
let animationRun = 0;

const routeForm = document.getElementById("form-ruta");
const originField = document.getElementById("campo-origen");
const destinationField = document.getElementById("campo-destino");
const mapSvg = document.getElementById("mapa");
const hintElement = document.getElementById("indicacion");
const resultElement = document.getElementById("resultado");

const roadLayer = createSvgElement("g");
const routeLayer = createSvgElement("g");
const weightLayer = createSvgElement("g");
const townLayer = createSvgElement("g");
mapSvg.append(roadLayer, routeLayer, weightLayer, townLayer);

/* ---------- Mapa ---------- */

/**
 * Convierte latitud y longitud a coordenadas del dibujo (800 × 470).
 * @param {string} name Nombre del lugar.
 * @returns {{x: number, y: number}}
 */
function toMapPoint(name) {
  const [latitude, longitude] = COORDINATES[name];
  return {
    x: 70 + ((longitude + 90.1) / 2.0) * 640,
    y: 70 + ((21.25 - latitude) / 1.15) * 360,
  };
}

/** Dibuja las carreteras (aristas), sus distancias y los pueblos (vértices). */
function renderMap() {
  // Cada arista aparece en la lista de sus dos extremos; se dibuja una sola vez.
  const drawnEdges = new Set();

  for (const vertex of graph.vertices.values()) {
    for (const edge of vertex.incidentEdges) {
      if (drawnEdges.has(edge)) continue;
      drawnEdges.add(edge);

      const start = toMapPoint(edge.end1.name);
      const end = toMapPoint(edge.end2.name);
      const middle = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 };
      const weightText = createSvgElement("text", { class: "peso", x: middle.x, y: middle.y });

      weightText.textContent = `${edge.weight} km`;

      roadLayer.append(createSvgElement("line", { class: "carretera", x1: start.x, y1: start.y, x2: end.x, y2: end.y }));
      weightLayer.append(
        createSvgElement("rect", { class: "peso-fondo", x: middle.x - 29, y: middle.y - 12, width: 58, height: 24, rx: 12 }),
        weightText,
      );
    }
  }

  for (const name of vertexNames) {
    const point = toMapPoint(name);
    const group = createSvgElement("g", { class: name === CONNECTION_CITY ? "pueblo ciudad" : "pueblo", tabindex: 0 });
    const labelPosition = LABEL_POSITIONS[name] ?? DEFAULT_LABEL_POSITION;
    const label = createSvgElement("text", {
      x: point.x + labelPosition.dx,
      y: point.y + labelPosition.dy,
      "text-anchor": labelPosition.anchor,
    });
    const title = createSvgElement("title");

    label.textContent = name;
    title.textContent = name === CONNECTION_CITY ? `${name} (punto de conexión)` : `${name} (Pueblo Mágico)`;

    group.append(title, createSvgElement("circle", { class: "punto", cx: point.x, cy: point.y, r: 11 }), label);
    group.addEventListener("click", () => pickTown(name));
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        pickTown(name);
      }
    });

    townElements.set(name, group);
    townLayer.append(group);
  }
}

/** Marca en el mapa el origen (verde) y el destino (rojo) elegidos. */
function updateMarkers() {
  for (const [name, group] of townElements) {
    group.classList.toggle("origen", name === originField.value);
    group.classList.toggle("destino", name === destinationField.value);
  }
}

/** Borra la ruta dibujada y oculta el resultado. */
function clearRoute() {
  animationRun += 1;
  routeLayer.replaceChildren();
  for (const group of townElements.values()) {
    group.classList.remove("en-ruta", "llega");
  }
  resultElement.classList.add("oculto");
}

/**
 * Dibuja la ruta tramo por tramo, iluminando cada pueblo al llegar.
 * @param {string[]} route Pueblos de la ruta, en orden.
 */
async function animateRoute(route) {
  clearRoute();
  const run = animationRun;

  townElements.get(route[0]).classList.add("en-ruta");

  for (let i = 0; i < route.length - 1; i++) {
    const start = toMapPoint(route[i]);
    const end = toMapPoint(route[i + 1]);

    routeLayer.append(
      createSvgElement("line", { class: "tramo", x1: start.x, y1: start.y, x2: end.x, y2: end.y, pathLength: 1 }),
    );
    await wait(LEG_DURATION);
    if (run !== animationRun) return;

    const town = townElements.get(route[i + 1]);
    town.classList.add("en-ruta");
    replayAnimation(town, "llega");
  }
}

/**
 * Elige un pueblo con un clic: el primer clic fija el origen y el segundo el
 * destino (y calcula la ruta).
 * @param {string} name Nombre del pueblo.
 */
function pickTown(name) {
  if (nextPick === "origen") {
    originField.value = name;
    nextPick = "destino";
    clearRoute();
    setHint("Ahora haz clic en el pueblo de ", "destino", ".");
  } else {
    destinationField.value = name;
    nextPick = "origen";
    setHint("Haz clic en un pueblo para elegir un nuevo ", "origen", ".");
    showRoute();
  }
  updateMarkers();
}

/**
 * Cambia el texto de ayuda bajo el mapa resaltando una palabra.
 * @param {string} before Texto antes de la palabra.
 * @param {string} emphasis Palabra resaltada.
 * @param {string} after Texto después de la palabra.
 */
function setHint(before, emphasis, after) {
  hintElement.replaceChildren(before, createElement("strong", {}, emphasis), after);
}

/* ---------- Resultado ---------- */

/**
 * Calcula la ruta más corta entre los lugares elegidos y la muestra como línea
 * de tiempo: cada parada con la distancia del tramo y la acumulada.
 */
function showRoute() {
  const originName = originField.value;
  const destinationName = destinationField.value;

  updateMarkers();

  if (originName === destinationName) {
    clearRoute();
    showToast("El origen y el destino son el mismo lugar: la distancia es 0 km.", "info");
    return;
  }

  let result;
  try {
    result = findShortestPath(adjacencyMatrix, vertexNames, originName, destinationName);
  } catch (error) {
    clearRoute();
    showToast(error.message, "error");
    return;
  }

  const { route, distance } = result;
  const legs = routeLegs(adjacencyMatrix, vertexNames, route);
  let accumulated = 0;

  const stops = route.map((name, index) => {
    let detail = "Origen";
    if (index > 0) {
      accumulated += legs[index - 1].distance;
      detail = `+${legs[index - 1].distance} km · ${accumulated} km recorridos`;
    }
    const stop = createElement("li", { className: "parada" }, createElement("strong", {}, name), createElement("span", {}, detail));
    stop.style.animationDelay = `${index * (reducedMotion ? 0 : LEG_DURATION)}ms`;
    return stop;
  });

  resultElement.replaceChildren(
    createElement(
      "div",
      { className: "resultado-encabezado" },
      createElement(
        "div",
        {},
        createElement("div", { className: "resultado-estado" }, "✓ Ruta encontrada"),
        createElement("div", { className: "resultado-algoritmo" }, `${originName} → ${destinationName} · algoritmo de Dijkstra`),
      ),
      createElement("div", { className: "resultado-total" }, distance, createElement("small", {}, "km")),
    ),
    createElement("ol", { className: "linea-tiempo" }, ...stops),
  );

  animateRoute(route);
  resultElement.classList.remove("oculto");
  replayAnimation(resultElement, "resultado");
}

/* ---------- Tablas ---------- */

/** Muestra la matriz de adyacencia (∞ cuando no hay conexión directa). */
function renderAdjacencyMatrix() {
  const header = createElement(
    "tr",
    {},
    createElement("th", {}, ""),
    ...vertexNames.map((name) => createElement("th", { className: "numero" }, name)),
  );

  const rows = vertexNames.map((name, row) =>
    createElement(
      "tr",
      {},
      createElement("th", {}, name),
      ...adjacencyMatrix[row].map((weight) => createElement("td", { className: "numero" }, weight === Infinity ? "∞" : weight)),
    ),
  );

  document.getElementById("matriz").replaceChildren(createElement("table", {}, header, ...rows));
}

/** Muestra el grado (número de carreteras directas) de cada vértice. */
function renderVertexDegrees() {
  const rows = [...graph.vertices.values()].map((vertex) =>
    createElement("tr", {}, createElement("td", {}, vertex.name), createElement("td", { className: "numero" }, vertex.degree())),
  );

  document
    .getElementById("grados")
    .replaceChildren(
      createElement(
        "table",
        {},
        createElement("tr", {}, createElement("th", {}, "Vértice"), createElement("th", { className: "numero" }, "Grado")),
        ...rows,
      ),
    );
}

/* ---------- Eventos ---------- */

/** Llena las listas de origen y destino con los lugares numerados. */
function fillSelectors() {
  vertexNames.forEach((name, index) => {
    originField.append(createElement("option", { value: name }, `${index + 1}. ${name}`));
    destinationField.append(createElement("option", { value: name }, `${index + 1}. ${name}`));
  });
  originField.value = "Sisal";
  destinationField.value = "Valladolid";
}

routeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showRoute();
});

for (const field of [originField, destinationField]) {
  field.addEventListener("change", () => {
    clearRoute();
    updateMarkers();
  });
}

document.getElementById("boton-intercambiar").addEventListener("click", () => {
  [originField.value, destinationField.value] = [destinationField.value, originField.value];
  const routeWasVisible = !resultElement.classList.contains("oculto");
  updateMarkers();
  if (routeWasVisible) {
    showRoute();
  }
});

fillSelectors();
renderMap();
updateMarkers();
renderAdjacencyMatrix();
renderVertexDegrees();
