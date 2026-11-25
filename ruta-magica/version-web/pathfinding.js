/* ==========================================================================
 * pathfinding.js — Ruta mágica
 *
 * Cálculo de la ruta más corta con el algoritmo de Dijkstra sobre una matriz
 * de adyacencia. Se eligió Dijkstra porque todas las distancias son positivas
 * y solo se necesita la ruta desde un origen.
 *
 * Origen del código:
 *   [EQUIPO] Implementación original del equipo, traducida de
 *            version-cli/pathfinding.py con la misma lógica y estructura.
 *   [IA]     Código generado con inteligencia artificial para la versión web.
 * ========================================================================== */

/* ##########################################################################
 * [EQUIPO] IMPLEMENTACIÓN ORIGINAL
 * ########################################################################## */

/**
 * Algoritmo de Dijkstra: distancias mínimas desde un origen hacia todos los vértices.
 * @param {number[][]} adjacencyMatrix Matriz cuadrada de pesos (Infinity = sin arista).
 * @param {number} originIndex Índice del vértice de origen.
 * @returns {{bestDistances: number[], predecessors: (number|null)[]}}
 * @throws {Error} Si la matriz está vacía, no es cuadrada o el índice es inválido.
 */
function dijkstra(adjacencyMatrix, originIndex) {
  const rowCount = adjacencyMatrix.length;

  if (rowCount === 0) {
    throw new Error("La matriz de adyacencia no puede estar vacía.");
  }

  for (let rowNumber = 0; rowNumber < rowCount; rowNumber++) {
    const columnCount = adjacencyMatrix[rowNumber].length;

    if (columnCount !== rowCount) {
      throw new Error("La matriz de adyacencia debe tener el mismo número de filas y columnas.");
    }
  }

  if (!(originIndex >= 0 && originIndex < rowCount)) {
    throw new Error(`El índice de origen ${originIndex} es inválido; debe estar entre 0 y ${rowCount - 1}.`);
  }

  const bestDistances = new Array(rowCount).fill(Infinity);
  const predecessors = new Array(rowCount).fill(null);
  const visited = new Array(rowCount).fill(false);

  bestDistances[originIndex] = 0;

  while (true) {
    // Se elige el vértice no visitado con la menor distancia conocida.
    let candidateIndex = null;

    for (let index = 0; index < rowCount; index++) {
      if (visited[index] || bestDistances[index] === Infinity) {
        continue;
      }

      if (candidateIndex === null) {
        candidateIndex = index;
      } else if (bestDistances[index] < bestDistances[candidateIndex]) {
        candidateIndex = index;
      }
    }

    if (candidateIndex === null) {
      break;
    }

    visited[candidateIndex] = true;

    // Relajación de las aristas del candidato.
    for (let columnNumber = 0; columnNumber < rowCount; columnNumber++) {
      const weight = adjacencyMatrix[candidateIndex][columnNumber];

      if (visited[columnNumber] || weight === Infinity) {
        continue;
      }

      const traversalDistance = bestDistances[candidateIndex] + weight;

      if (traversalDistance < bestDistances[columnNumber]) {
        bestDistances[columnNumber] = traversalDistance;
        predecessors[columnNumber] = candidateIndex;
      }
    }
  }

  return { bestDistances, predecessors };
}

/**
 * Obtiene la ruta más corta entre dos vértices por nombre.
 * @param {number[][]} adjacencyMatrix Matriz de adyacencia del grafo.
 * @param {string[]} verticesNames Nombres en el mismo orden que la matriz.
 * @param {string} originName Vértice de origen.
 * @param {string} destinationName Vértice de destino.
 * @returns {{route: string[], distance: number}}
 * @throws {Error} Si el destino no es alcanzable desde el origen.
 */
function findShortestPath(adjacencyMatrix, verticesNames, originName, destinationName) {
  const originIndex = verticesNames.indexOf(originName);
  const destinationIndex = verticesNames.indexOf(destinationName);

  const { bestDistances, predecessors } = dijkstra(adjacencyMatrix, originIndex);

  if (bestDistances[destinationIndex] === Infinity) {
    throw new Error(`No existe ninguna ruta de '${originName}' a '${destinationName}'.`);
  }

  // Se reconstruye la ruta desde el destino siguiendo los predecesores.
  const indices = [];

  let currentIndex = destinationIndex;

  while (currentIndex !== null) {
    indices.push(currentIndex);
    currentIndex = predecessors[currentIndex];
  }

  const route = [];

  for (const index of indices.reverse()) {
    const townName = verticesNames[index];

    route.push(townName);
  }

  return { route, distance: bestDistances[destinationIndex] };
}

/* ##########################################################################
 * [IA] GENERADO CON INTELIGENCIA ARTIFICIAL
 * ########################################################################## */

/**
 * Divide una ruta en tramos con la distancia de cada uno, para mostrarlos en
 * la línea de tiempo y animarlos en el mapa.
 * @param {number[][]} adjacencyMatrix Matriz de adyacencia del grafo.
 * @param {string[]} verticesNames Nombres en el mismo orden que la matriz.
 * @param {string[]} route Ruta devuelta por findShortestPath.
 * @returns {{from: string, to: string, distance: number}[]}
 */
function routeLegs(adjacencyMatrix, verticesNames, route) {
  const legs = [];

  for (let i = 0; i < route.length - 1; i++) {
    const fromIndex = verticesNames.indexOf(route[i]);
    const toIndex = verticesNames.indexOf(route[i + 1]);

    legs.push({ from: route[i], to: route[i + 1], distance: adjacencyMatrix[fromIndex][toIndex] });
  }

  return legs;
}
