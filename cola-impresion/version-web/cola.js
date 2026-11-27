/* ==========================================================================
 * cola.js — Cola de impresión (versión estática)
 *
 * [IA] ARCHIVO GENERADO CON INTELIGENCIA ARTIFICIAL.
 * Sustituye a la API de FastAPI (backend/src/backend/main.py) para que la
 * página funcione en GitHub Pages. La cola vive en memoria y se pierde al
 * recargar; no se guarda ningún archivo, solo su nombre.
 *
 * Cada método imita un endpoint del backend y devuelve la misma respuesta:
 *   encolar()    ↔ POST /uploadfile
 *   consultar()  ↔ POST /getfiles
 *   desencolar() ↔ POST /printfile
 * ========================================================================== */

class ColaImpresion {
  constructor() {
    /** Nombres de los trabajos; el índice 0 es el frente. */
    this.trabajos = [];
  }

  /** Agrega un trabajo al final de la cola (encolar). */
  encolar(nombre) {
    this.trabajos.push(nombre);
    return { status: "saved", name: nombre, position: this.trabajos.length };
  }

  /** Devuelve una copia de la cola, del frente al final. */
  consultar() {
    return [...this.trabajos];
  }

  /** Saca el trabajo del frente (desencolar). Falla si la cola está vacía. */
  desencolar() {
    if (this.trabajos.length === 0) {
      throw new Error("La cola esta vacia");
    }
    const nombre = this.trabajos.shift();
    return { status: "printed", name: nombre, remaining: this.trabajos.length };
  }
}

/**
 * Imita la capa api.js del frontend de React con promesas, para conservar el
 * mismo flujo asíncrono. La "subida" solo anima una barra de progreso: el
 * contenido del archivo nunca se lee ni se envía.
 */
class ApiSimulada {
  constructor() {
    this.cola = new ColaImpresion();
  }

  fetchQueue() {
    return Promise.resolve(this.cola.consultar());
  }

  uploadFile(archivo, onProgress) {
    // Duración proporcional al tamaño, entre 0.5 y 1.6 segundos.
    const duracion = Math.min(1600, 500 + archivo.size / 4000);
    const inicio = performance.now();

    return new Promise((resolve) => {
      const avanzar = (ahora) => {
        const fraccion = Math.min(1, (ahora - inicio) / duracion);
        onProgress?.(Math.round(archivo.size * fraccion), archivo.size);
        if (fraccion < 1) {
          requestAnimationFrame(avanzar);
        } else {
          resolve(this.cola.encolar(archivo.name));
        }
      };
      requestAnimationFrame(avanzar);
    });
  }

  printFile() {
    try {
      return Promise.resolve(this.cola.desencolar());
    } catch (problema) {
      return Promise.reject(problema);
    }
  }
}
