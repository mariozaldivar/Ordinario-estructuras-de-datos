/* ==========================================================================
 * classes.js — Ruta mágica
 *
 * Estructura de datos principal: grafo no dirigido y ponderado. Cada vértice
 * guarda la lista de aristas que inciden en él (lista de adyacencia) y el grafo
 * puede convertirse a matriz de adyacencia para aplicar Dijkstra.
 *
 * Origen del código:
 *   [EQUIPO] Implementación original del equipo, traducida de
 *            version-cli/classes.py con la misma lógica y estructura.
 *   [IA]     Código generado con inteligencia artificial para la versión web.
 *            Va al final de cada clase, separado por un encabezado; los
 *            cambios dentro de un método original se marcan entre
 *            "[IA] inicio" y "[IA] fin".
 * ========================================================================== */

/* ##########################################################################
 * [EQUIPO] IMPLEMENTACIÓN ORIGINAL
 * ########################################################################## */

/**
 * Arista no dirigida entre dos vértices; su peso es la distancia en km.
 */
class Edge {
  /**
   * @param {number} weight Peso a revisar.
   * @returns {boolean} Verdadero si el peso es positivo.
   */
  isValidEdgeWeight(weight) {
    return weight > 0;
  }

  /**
   * @param {number} weight Peso a revisar.
   * @throws {Error} Si el peso no es positivo.
   */
  checkEdgeWeight(weight) {
    if (!this.isValidEdgeWeight(weight)) {
      throw new Error(`No se puede crear una arista con peso ${weight}: el peso debe ser un número real positivo.`);
    }
  }

  /**
   * @param {Vertex} end1 Primer extremo.
   * @param {Vertex} end2 Segundo extremo.
   * @param {number} weight Distancia en kilómetros (número real positivo).
   * @throws {Error} Si el peso no es positivo.
   */
  constructor(end1, end2, weight) {
    this.checkEdgeWeight(weight);

    this.end1 = end1;
    this.end2 = end2;
    this.weight = weight;
  }

  /** @returns {boolean} Verdadero si la arista une un vértice consigo mismo (lazo). */
  isLoop() {
    return this.end1.name === this.end2.name;
  }

  /**
   * Indica si otra arista une los mismos dos vértices (arista paralela).
   * @param {Edge} edge Arista a comparar.
   * @returns {boolean}
   */
  isParallel(edge) {
    if (edge === this) {
      return false;
    } else if (
      (this.end1.name === edge.end1.name && this.end2.name === edge.end2.name) ||
      (this.end1.name === edge.end2.name && this.end2.name === edge.end1.name)
    ) {
      return true;
    }

    return false;
  }

  /**
   * Devuelve el extremo opuesto al vértice dado.
   * @param {Vertex} vertex Uno de los extremos de la arista.
   * @returns {Vertex}
   * @throws {Error} Si la arista no incide en el vértice.
   */
  otherEnd(vertex) {
    if (vertex.name === this.end1.name) {
      return this.end2;
    } else if (vertex.name === this.end2.name) {
      return this.end1;
    } else {
      throw new Error(
        `No se pudo obtener el otro extremo de esta arista respecto al vértice '${vertex.name}' porque la arista no incide en él.`,
      );
    }
  }
}

/**
 * Vértice del grafo: un Pueblo Mágico (o ciudad) con sus aristas incidentes.
 */
class Vertex {
  /**
   * @param {string} name Nombre a revisar.
   * @returns {boolean} Verdadero si tiene uno o más caracteres alfabéticos (se permiten acentos).
   */
  isValidVertexName(name) {
    if (name === null || name === undefined || name.length === 0 || !/^\p{L}+$/u.test(name)) {
      return false;
    }

    return true;
  }

  /**
   * @param {string} name Nombre a revisar.
   * @throws {Error} Si el nombre no es válido.
   */
  checkVertexName(name) {
    if (!this.isValidVertexName(name)) {
      throw new Error(`No se puede nombrar el vértice '${name}': el nombre debe ser uno o más caracteres alfabéticos.`);
    }
  }

  /**
   * @param {string} name Nombre del lugar.
   * @throws {Error} Si el nombre está vacío o contiene caracteres no alfabéticos.
   */
  constructor(name) {
    this.checkVertexName(name);

    this.name = name;
    /** @type {Edge[]} Lista de aristas que inciden en el vértice. */
    this.incidentEdges = [];
  }

  /**
   * Agrega una arista a la lista de incidencia.
   * @param {Edge} edge Arista que incide en este vértice.
   */
  insertEdge(edge) {
    this.incidentEdges.push(edge);
  }

  /** @returns {number} Grado del vértice (número de aristas incidentes). */
  degree() {
    return this.incidentEdges.length;
  }

  /**
   * Indica si existe una arista entre este vértice y otro.
   * @param {Vertex} vertex Vértice a revisar.
   * @returns {boolean}
   */
  isAdjacent(vertex) {
    for (const edge of this.incidentEdges) {
      const neighborVertex = edge.otherEnd(this);

      if (neighborVertex.name === vertex.name) {
        return true;
      }
    }

    return false;
  }
}

/**
 * Grafo no dirigido y ponderado.
 */
class Graph {
  /**
   * @param {string} name Nombre a revisar.
   * @returns {boolean} Verdadero si tiene uno o más caracteres alfabéticos.
   */
  isValidGraphName(name) {
    if (name === null || name === undefined || name.length === 0 || !/^\p{L}+$/u.test(name)) {
      return false;
    }

    return true;
  }

  /**
   * @param {string} name Nombre a revisar.
   * @throws {Error} Si el nombre no es válido.
   */
  checkGraphName(name) {
    if (!this.isValidGraphName(name)) {
      throw new Error(`No se puede nombrar al grafo '${name}': el nombre debe ser uno o más caracteres alfabéticos.`);
    }
  }

  /**
   * @param {string} name Nombre del grafo (solo letras).
   * @param {Vertex} initialVertex Primer vértice del grafo.
   * @throws {Error} Si el nombre no es válido.
   */
  constructor(name, initialVertex) {
    this.checkGraphName(name);

    this.name = name;
    /** @type {Map<string, Vertex>} Vértices indexados por nombre, en orden de inserción. */
    this.vertices = new Map();

    this.insertVertex(initialVertex);
  }

  /**
   * Agrega un vértice al grafo.
   * @param {Vertex} vertex Vértice a agregar.
   * @throws {Error} Si ya existe un vértice con el mismo nombre.
   */
  insertVertex(vertex) {
    if (this.vertices.has(vertex.name)) {
      throw new Error(`No se puede añadir el vértice '${vertex.name}': ya existe un vértice con el mismo nombre.`);
    }

    this.vertices.set(vertex.name, vertex);
  }

  /**
   * Busca un vértice por nombre.
   * @param {string} name Nombre del vértice.
   * @returns {Vertex}
   * @throws {Error} Si el vértice no existe.
   */
  findVertex(name) {
    // [IA] inicio — en Python el diccionario lanza KeyError; Map devuelve undefined.
    if (!this.vertices.has(name)) {
      throw new Error(`No existe el vértice '${name}'.`);
    }
    // [IA] fin

    return this.vertices.get(name);
  }

  /**
   * Une dos vértices con una arista de peso dado.
   * @param {string} end1Name Nombre del primer extremo.
   * @param {string} end2Name Nombre del segundo extremo.
   * @param {number} weight Distancia en km.
   * @throws {Error} Si la arista sería un lazo o ya existe una entre esos vértices.
   */
  insertEdge(end1Name, end2Name, weight) {
    const end1 = this.findVertex(end1Name);
    const end2 = this.findVertex(end2Name);

    const newEdge = new Edge(end1, end2, weight);

    if (newEdge.isLoop()) {
      throw new Error("No se puede añadir una arista con extremos iguales.");
    }

    if (end1.isAdjacent(end2)) {
      throw new Error("No se puede añadir una arista cuyos vértices son adyacentes.");
    }

    end1.insertEdge(newEdge);
    end2.insertEdge(newEdge);
  }

  /**
   * Posición de un vértice dentro del orden de inserción.
   * @param {Vertex} target Vértice a buscar.
   * @returns {number}
   * @throws {Error} Si el vértice no pertenece al grafo.
   */
  findVertexIndex(target) {
    let index = null;

    let i = 0;
    for (const vertex of this.vertices.values()) {
      if (vertex.name === target.name) {
        index = i;
        break;
      }
      i++;
    }

    if (index === null) {
      throw new Error(`El vértice '${target.name}' no pertenece al grafo.`);
    }

    return index;
  }

  /**
   * Construye la matriz de adyacencia: 0 en la diagonal, el peso si hay arista
   * e Infinity si no hay conexión directa.
   * @returns {number[][]}
   */
  createAdjacencyMatrix() {
    const matrix = [];

    const size = this.vertices.size;

    for (let i = 0; i < size; i++) {
      matrix.push([]);
      for (let j = 0; j < size; j++) {
        if (i === j) {
          matrix[i].push(0);
        } else {
          matrix[i].push(Infinity);
        }
      }
    }

    for (const vertex of this.vertices.values()) {
      for (const incidentEdge of vertex.incidentEdges) {
        const end1 = incidentEdge.end1;
        const end2 = incidentEdge.end2;

        const indexEnd1 = this.findVertexIndex(end1);
        const indexEnd2 = this.findVertexIndex(end2);

        matrix[indexEnd1][indexEnd2] = incidentEdge.weight;
        matrix[indexEnd2][indexEnd1] = incidentEdge.weight;
      }
    }

    return matrix;
  }

  // ------------------------------------------------------------------------
  // [IA] Métodos generados con IA para la versión web.
  // ------------------------------------------------------------------------

  /** @returns {string[]} Nombres de los vértices en orden de inserción (mismo orden que la matriz). */
  vertexNames() {
    return [...this.vertices.keys()];
  }
}
