/* ==========================================================================
 * classes.js — Sistema de archivos
 *
 * Estructura de datos principal: árbol binario de búsqueda (ABB). Cada nodo
 * es un archivo o un directorio y la clave de orden es su nombre.
 *
 * Origen del código:
 *   [EQUIPO] Implementación original del equipo, traducida de
 *            version-cli/classes.py y constants.py con la misma lógica y
 *            estructura (los mensajes se tradujeron al español).
 *   [IA]     Código generado con inteligencia artificial para la versión web.
 *            Va al final de cada clase, separado por un encabezado; los
 *            cambios dentro de un método original se marcan entre
 *            "[IA] inicio" y "[IA] fin".
 * ========================================================================== */

/* ##########################################################################
 * [EQUIPO] IMPLEMENTACIÓN ORIGINAL
 * ########################################################################## */

/** Longitud máxima permitida para la extensión de un archivo. */
const MAX_FILE_EXTENSION_LENGTH = 3;

/** Nombre del directorio raíz con el que inicia el sistema de archivos. */
const ROOT_DIRECTORY_NAME = "Documentos";

/**
 * Nodo del árbol: representa un archivo o un directorio.
 */
class FileNode {
  /**
   * Indica si un texto contiene solo caracteres ASCII imprimibles.
   * @param {string} text Texto a revisar.
   * @returns {boolean}
   */
  static isPrintableAsciiString(text) {
    return /^[\x20-\x7E]*$/.test(text);
  }

  /**
   * Crea un nodo validando sus datos.
   * @param {string} name Nombre (clave del ABB).
   * @param {"file"|"directory"} fileType Tipo de nodo.
   * @param {number} [size=0] Tamaño en bytes.
   * @param {string|null} [extension=null] Extensión; obligatoria en archivos.
   * @throws {Error} Si algún dato no cumple las reglas.
   */
  constructor(name, fileType, size = 0, extension = null) {
    if (!FileNode.isPrintableAsciiString(name)) {
      throw new Error("El nombre solo puede contener caracteres ASCII imprimibles (sin acentos ni ñ).");
    }

    if (name.length === 0) {
      throw new Error("El nombre no puede estar vacío.");
    }

    if (fileType !== "file" && fileType !== "directory") {
      throw new Error("El tipo debe ser 'file' (archivo) o 'directory' (directorio).");
    }

    if (fileType === "file") {
      if (extension === null) {
        throw new Error("Un archivo debe tener extensión.");
      } else if (extension.length === 0) {
        throw new Error("La extensión no puede estar vacía.");
      } else if (!FileNode.isPrintableAsciiString(extension)) {
        throw new Error("La extensión solo puede contener caracteres ASCII imprimibles.");
      } else if (extension.length > MAX_FILE_EXTENSION_LENGTH) {
        throw new Error(`La extensión no puede tener más de ${MAX_FILE_EXTENSION_LENGTH} caracteres.`);
      }
    }

    // [IA] inicio — en la web el tamaño llega de un campo de texto: se exige un entero.
    if (!Number.isInteger(size)) {
      throw new Error("El tamaño del archivo debe ser un número entero.");
    }
    // [IA] fin

    if (size < 0) {
      throw new Error("El tamaño del archivo debe ser mayor o igual a cero.");
    }

    this.name = name;
    this.size = size;
    this.extension = extension;
    this.fileType = fileType;

    /** @type {FileNode|null} Hijo izquierdo (nombres menores). */
    this.left = null;
    /** @type {FileNode|null} Hijo derecho (nombres mayores). */
    this.right = null;
  }

  /** @returns {boolean} Verdadero si el nodo es un archivo. */
  isFile() {
    return this.fileType === "file";
  }

  /** @returns {boolean} Verdadero si el nodo es un directorio. */
  isDirectory() {
    return this.fileType === "directory";
  }

  // ------------------------------------------------------------------------
  // [IA] Métodos generados con IA para la versión web.
  // ------------------------------------------------------------------------

  /** @returns {string} Nombre con extensión (si es archivo), p. ej. "notas.txt". */
  fullName() {
    return this.isFile() ? `${this.name}.${this.extension}` : this.name;
  }
}

/**
 * Árbol binario de búsqueda que simula el sistema de archivos.
 */
class BinaryTree {
  /**
   * @param {FileNode} [root] Nodo raíz; si se omite se crea el directorio raíz por defecto.
   * @throws {Error} Si la raíz no es un directorio.
   */
  constructor(root) {
    if (root === undefined) {
      this.root = new FileNode(ROOT_DIRECTORY_NAME, "directory");
    } else {
      if (!root.isDirectory()) {
        throw new Error("La raíz del sistema de archivos debe ser un directorio.");
      }

      this.root = root;
    }
  }

  /**
   * Cuenta cuántos hijos (0, 1 o 2) tiene un nodo.
   * @param {FileNode} targetNode Nodo a revisar.
   * @returns {number}
   */
  countChildrenNodes(targetNode) {
    let children = 0;

    if (targetNode.left !== null && targetNode.right !== null) {
      children = 2;
    } else if (
      (targetNode.left !== null && targetNode.right === null) ||
      (targetNode.left === null && targetNode.right !== null)
    ) {
      children = 1;
    }

    return children;
  }

  /**
   * Busca un elemento por nombre descendiendo por el árbol.
   * @param {string} targetName Nombre a buscar.
   * @returns {FileNode} El nodo encontrado.
   * @throws {Error} Si el elemento no existe.
   */
  search(targetName) {
    let currentNode = this.root;

    while (currentNode !== null) {
      if (targetName < currentNode.name) {
        currentNode = currentNode.left;
      } else if (targetName > currentNode.name) {
        currentNode = currentNode.right;
      } else {
        break;
      }
    }

    if (currentNode === null) {
      throw new Error("El elemento no existe en el sistema de archivos.");
    }

    return currentNode;
  }

  /**
   * Elimina un elemento por nombre con los tres casos del ABB: dos hijos (se
   * reemplaza por el menor del subárbol derecho), un hijo u hoja.
   * @param {string} targetName Nombre del elemento a eliminar.
   * @throws {Error} Si no existe, si es la raíz o si el reemplazo es un archivo.
   */
  delete(targetName) {
    const targetNode = this.search(targetName);

    if (targetNode === this.root) {
      throw new Error("PROTEGIDO: No se puede eliminar el directorio raíz.");
    }

    let currentNode = this.root;
    let previousNode = null;

    while (currentNode !== null) {
      if (targetNode.name < currentNode.name) {
        previousNode = currentNode;
        currentNode = currentNode.left;
      } else if (targetNode.name > currentNode.name) {
        previousNode = currentNode;
        currentNode = currentNode.right;
      } else {
        break;
      }
    }

    switch (this.countChildrenNodes(targetNode)) {
      case 2: {
        currentNode = targetNode.right;
        previousNode = targetNode;

        while (currentNode.left !== null) {
          previousNode = currentNode;

          currentNode = currentNode.left;
        }

        const minimumNode = currentNode;

        if (!minimumNode.isDirectory()) {
          throw new Error(
            `No se puede eliminar '${targetNode.name}': su reemplazo es un archivo y un archivo no puede contener otros elementos.`,
          );
        }

        targetNode.name = minimumNode.name;
        targetNode.fileType = minimumNode.fileType;
        targetNode.size = minimumNode.size;
        targetNode.extension = minimumNode.extension;

        if (previousNode.name === targetNode.name) {
          previousNode.right = currentNode.right;
        } else {
          previousNode.left = currentNode.right;
        }
        break;
      }

      case 1: {
        let replacement;
        if (targetNode.left === null) {
          replacement = targetNode.right;
        } else {
          replacement = targetNode.left;
        }

        if (targetNode.name < previousNode.name) {
          previousNode.left = replacement;
        } else if (targetNode.name > previousNode.name) {
          previousNode.right = replacement;
        }
        break;
      }

      case 0:
        if (targetNode.name < previousNode.name) {
          previousNode.left = null;
        } else if (targetNode.name > previousNode.name) {
          previousNode.right = null;
        }
        break;
    }
  }

  /**
   * Inserta un nodo respetando el orden alfabético y las reglas:
   * sin nombres duplicados y sin colgar elementos de un archivo.
   * @param {FileNode} newNode Nodo a insertar.
   * @throws {Error} Si el nombre ya existe o el lugar de inserción es un archivo.
   */
  insert(newNode) {
    let currentNode = this.root;
    let previousNode = null;

    while (currentNode !== null) {
      previousNode = currentNode;

      if (currentNode.name === newNode.name) {
        throw new Error(`Ya existe un elemento con nombre '${newNode.name}'.`);
      }

      if (newNode.name < currentNode.name) {
        currentNode = currentNode.left;
      } else if (newNode.name > currentNode.name) {
        currentNode = currentNode.right;
      }
    }

    if (!previousNode.isDirectory()) {
      throw new Error("ERROR: No se puede insertar el elemento. Un archivo no puede contener otros elementos.");
    }

    if (newNode.name < previousNode.name) {
      previousNode.left = newNode;
    } else if (newNode.name > previousNode.name) {
      previousNode.right = newNode;
    }
  }

  /**
   * Recorrido preorden: nodo, izquierdo, derecho.
   * @param {FileNode|null} node Subárbol a recorrer.
   * @returns {FileNode[]}
   */
  trajectorizePreorderTraversal(node) {
    const trajectory = [];

    if (node !== null) {
      trajectory.push(node);

      trajectory.push(...this.trajectorizePreorderTraversal(node.left));
      trajectory.push(...this.trajectorizePreorderTraversal(node.right));
    }

    return trajectory;
  }

  /**
   * Recorrido inorden: izquierdo, nodo, derecho (resultado en orden alfabético).
   * @param {FileNode|null} node Subárbol a recorrer.
   * @returns {FileNode[]}
   */
  trajectorizeInorderTraversal(node) {
    const trajectory = [];

    if (node !== null) {
      trajectory.push(...this.trajectorizeInorderTraversal(node.left));

      trajectory.push(node);

      trajectory.push(...this.trajectorizeInorderTraversal(node.right));
    }

    return trajectory;
  }

  /**
   * Recorrido postorden: izquierdo, derecho, nodo.
   * @param {FileNode|null} node Subárbol a recorrer.
   * @returns {FileNode[]}
   */
  trajectorizePostorderTraversal(node) {
    const trajectory = [];

    if (node !== null) {
      trajectory.push(...this.trajectorizePostorderTraversal(node.left));

      trajectory.push(...this.trajectorizePostorderTraversal(node.right));

      trajectory.push(node);
    }

    return trajectory;
  }

  /**
   * Devuelve la trayectoria del recorrido indicado.
   * @param {"pre"|"in"|"post"} algorithm Tipo de recorrido.
   * @returns {FileNode[]}
   * @throws {Error} Si el tipo de recorrido no es válido.
   */
  trajectorizeTraversal(algorithm) {
    if (!["pre", "in", "post"].includes(algorithm)) {
      throw new Error("El recorrido debe ser 'pre', 'in' o 'post'.");
    }

    let trajectory;

    switch (algorithm) {
      case "pre":
        trajectory = this.trajectorizePreorderTraversal(this.root);
        break;
      case "in":
        trajectory = this.trajectorizeInorderTraversal(this.root);
        break;
      case "post":
        trajectory = this.trajectorizePostorderTraversal(this.root);
        break;
    }

    return trajectory;
  }

  // ------------------------------------------------------------------------
  // [IA] Métodos generados con IA para las animaciones y la ficha de la web.
  // ------------------------------------------------------------------------

  /**
   * Devuelve los nodos que se visitan al buscar un nombre, en orden, desde la
   * raíz hasta el nodo encontrado o hasta el último nodo antes de un hijo nulo.
   * Sigue el mismo descenso que search().
   * @param {string} targetName Nombre a buscar.
   * @returns {{visited: FileNode[], found: boolean}}
   */
  searchPath(targetName) {
    const visited = [];
    let currentNode = this.root;

    while (currentNode !== null) {
      visited.push(currentNode);

      if (targetName === currentNode.name) {
        return { visited, found: true };
      }
      currentNode = targetName < currentNode.name ? currentNode.left : currentNode.right;
    }

    return { visited, found: false };
  }

  /**
   * Altura del árbol (un solo nodo tiene altura 1).
   * @param {FileNode|null} node Subárbol a medir.
   * @returns {number}
   */
  height(node = this.root) {
    if (node === null) return 0;
    return 1 + Math.max(this.height(node.left), this.height(node.right));
  }

  /** @returns {number} Cantidad total de nodos del árbol. */
  size() {
    return this.trajectorizeInorderTraversal(this.root).length;
  }
}
