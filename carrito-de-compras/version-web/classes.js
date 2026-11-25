/* ==========================================================================
 * classes.js — Carrito de compras
 *
 * Estructura de datos principal: listas (arreglos de JavaScript). El catálogo
 * y el carrito guardan sus elementos en una lista en memoria.
 *
 * Origen del código:
 *   [EQUIPO] Implementación original del equipo, traducida de
 *            version-cli/classes.py con la misma lógica y estructura.
 *   [IA]     Código generado con inteligencia artificial para la versión web.
 *            Va siempre al final de cada clase, separado por un encabezado.
 * ========================================================================== */

/* ##########################################################################
 * [EQUIPO] IMPLEMENTACIÓN ORIGINAL
 * ########################################################################## */

/**
 * Producto disponible en la tienda.
 */
class Product {
  /**
   * @param {number} id Identificador único del producto.
   * @param {string} name Nombre del producto.
   * @param {string} category Categoría a la que pertenece.
   * @param {number} price Precio unitario en pesos.
   */
  constructor(id, name, category, price) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.price = price;
  }
}

/**
 * Renglón del carrito: un producto junto con la cantidad que se compra.
 */
class CartEntry {
  /**
   * @param {Product} product Producto agregado al carrito.
   * @param {number} quantity Cantidad de unidades (entero positivo).
   */
  constructor(product, quantity) {
    this.id = product.id;
    this.name = product.name;
    this.price = product.price;
    this.quantity = quantity;
    this.subtotal = product.price * quantity;
  }

  // ------------------------------------------------------------------------
  // [IA] Generado con IA: en la versión original, para cambiar la cantidad se
  // reemplazaba el renglón por un CartEntry nuevo (opción 5 de main.py).
  // ------------------------------------------------------------------------

  /**
   * Cambia la cantidad y recalcula el subtotal del renglón.
   * @param {number} quantity Nueva cantidad (entero positivo).
   */
  setQuantity(quantity) {
    this.quantity = quantity;
    this.subtotal = this.price * quantity;
  }
}

/**
 * Catálogo de productos precargado en memoria.
 */
class Catalogue {
  /**
   * @param {Product[]} [products] Lista inicial; si se omite se usa el catálogo por defecto.
   */
  constructor(products) {
    if (products === undefined) {
      this.products = [
        new Product(1, "Teclado", "Accesorios", 450),
        new Product(2, "Mouse", "Accesorios", 250),
        new Product(3, "Monitor", "Electrónicos", 3200),
        new Product(4, "Audífonos", "Audio", 800),
        new Product(5, "Memoria USB", "Almacenamiento", 180),
      ];
    } else {
      this.products = products;
    }
  }

  /**
   * Busca un producto recorriendo la lista de forma secuencial.
   * @param {number} id Identificador a buscar.
   * @returns {Product} El producto encontrado.
   * @throws {Error} Si no existe un producto con ese identificador.
   */
  searchProduct(id) {
    let match = null;

    for (const product of this.products) {
      if (product.id === id) {
        match = product;
        break;
      }
    }

    if (match === null) {
      throw new Error(`No hay ningún producto con el identificador ${id}`);
    }

    return match;
  }
}

/**
 * Carrito de compras: lista de renglones (CartEntry).
 */
class Cart {
  constructor() {
    this.entries = [];
  }

  /**
   * Agrega un renglón nuevo al final de la lista.
   * @param {Product} product Producto a agregar.
   * @param {number} quantity Cantidad de unidades.
   */
  addProduct(product, quantity) {
    const entry = new CartEntry(product, quantity);

    this.entries.push(entry);
  }

  /**
   * Elimina del carrito el renglón con el identificador dado.
   * @param {number} id Identificador del producto a eliminar.
   */
  removeProduct(id) {
    for (const entry of this.entries) {
      if (entry.id === id) {
        this.entries.splice(this.entries.indexOf(entry), 1);
      }
    }
  }

  /**
   * Busca el renglón de un producto dentro del carrito.
   * @param {number} id Identificador del producto.
   * @returns {CartEntry} El renglón encontrado.
   * @throws {Error} Si el producto no está en el carrito.
   */
  searchEntries(id) {
    let match = null;

    for (const entry of this.entries) {
      if (entry.id === id) {
        match = entry;
        break;
      }
    }

    if (match === null) {
      throw new Error(`No hay ningún producto con el identificador ${id}`);
    }

    return match;
  }

  /** Vacía el carrito. */
  empty() {
    this.entries = [];
  }

  // ------------------------------------------------------------------------
  // [IA] Métodos generados con IA para la versión web.
  // ------------------------------------------------------------------------

  /**
   * Indica si un producto ya está en el carrito.
   * @param {number} id Identificador del producto.
   * @returns {boolean}
   */
  contains(id) {
    return this.entries.some((entry) => entry.id === id);
  }

  /**
   * Agrega un producto; si ya estaba, suma la cantidad al renglón existente
   * en lugar de duplicarlo. Usa addProduct y searchEntries del equipo.
   * @param {Product} product Producto a agregar.
   * @param {number} quantity Cantidad de unidades.
   */
  addOrIncrease(product, quantity) {
    if (this.contains(product.id)) {
      const entry = this.searchEntries(product.id);
      entry.setQuantity(entry.quantity + quantity);
    } else {
      this.addProduct(product, quantity);
    }
  }

  /**
   * Cambia la cantidad de un producto del carrito; el subtotal se recalcula.
   * @param {number} id Identificador del producto.
   * @param {number} quantity Nueva cantidad (entero positivo).
   */
  updateQuantity(id, quantity) {
    this.searchEntries(id).setQuantity(quantity);
  }

  /** @returns {boolean} Verdadero si el carrito no tiene productos. */
  isEmpty() {
    return this.entries.length === 0;
  }

  /** @returns {number} Suma de los subtotales (como en la opción 8 de main.py). */
  getTotal() {
    let total = 0;
    for (const entry of this.entries) {
      total += entry.subtotal;
    }
    return total;
  }

  /** @returns {number} Cantidad total de artículos (como en la opción 8 de main.py). */
  getItemCount() {
    let items = 0;
    for (const entry of this.entries) {
      items += entry.quantity;
    }
    return items;
  }
}
