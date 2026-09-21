// Capa de acceso a la API de la cola de impresion (FastAPI).
// El puerto se puede sobreescribir con VITE_API_URL en un archivo .env.
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

const SIN_CONEXION =
  "No hay conexión con la API. Verifica que el backend esté corriendo en " +
  API_BASE;

/** Extrae el mensaje de error que manda FastAPI en el campo "detail". */
function leerDetalle(texto, respaldo) {
  try {
    const cuerpo = JSON.parse(texto);
    if (typeof cuerpo?.detail === "string") return cuerpo.detail;
  } catch {
    // La respuesta no era JSON; usamos el mensaje de respaldo.
  }
  return respaldo;
}

/** Devuelve la cola completa: el indice 0 es el frente. */
export async function fetchQueue() {
  let response;
  try {
    response = await fetch(`${API_BASE}/getfiles`, { method: "POST" });
  } catch {
    throw new Error(SIN_CONEXION);
  }

  const texto = await response.text();
  if (!response.ok) {
    throw new Error(leerDetalle(texto, "No se pudo leer la cola."));
  }
  return JSON.parse(texto);
}

/**
 * Encola un archivo al final de la cola.
 * Usa XMLHttpRequest porque fetch no reporta el progreso de subida.
 */
export function uploadFile(file, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE}/uploadfile`);

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        onProgress?.(event.loaded, event.total);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress?.(file.size, file.size);
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(
          new Error(
            leerDetalle(xhr.responseText, "No se pudo subir el archivo."),
          ),
        );
      }
    });

    xhr.addEventListener("error", () => reject(new Error(SIN_CONEXION)));
    xhr.addEventListener("abort", () =>
      reject(new Error("Se canceló la subida.")),
    );

    xhr.send(formData);
  });
}

/** Imprime: saca el archivo del frente de la cola. */
export async function printFile() {
  let response;
  try {
    response = await fetch(`${API_BASE}/printfile`, { method: "POST" });
  } catch {
    throw new Error(SIN_CONEXION);
  }

  const texto = await response.text();
  if (!response.ok) {
    throw new Error(leerDetalle(texto, "No se pudo imprimir el archivo."));
  }
  return JSON.parse(texto);
}
