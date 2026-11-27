# Cola de impresión — código documentado

Trabajos de impresión en una cola FIFO: los archivos entran por el final y se imprimen desde el frente.

## Implementación original del equipo

Escrito por el equipo como aplicación *fullstack*: la API en `backend/` (FastAPI, Python) y la interfaz en `frontend/` (React + Vite). La cola es una lista guardada en `queue.json`; el índice 0 es el frente.

### Leer y guardar la cola

> **Origen: equipo** — La cola persiste en disco; si el archivo no existe, arranca vacía (`backend/src/backend/main.py`).

```python
def read_queue() -> list[str]:
    """Lee la cola desde disco. Si no existe, arranca vacia"""
    if not QUEUE_PATH.exists():
        return []
    with open(QUEUE_PATH, "r") as json_queue:
        return json.load(json_queue)


def write_queue(queue: list[str]) -> None:
    """Persiste la cola en disco"""
    with open(QUEUE_PATH, "w") as json_queue:
        json.dump(queue, json_queue, indent=2)
```

### Encolar — `POST /uploadfile`

> **Origen: equipo** — Guarda el archivo en `files/` y agrega su nombre al final de la cola.

```python
@app.post("/uploadfile")
def uploadFile(file: UploadFile = File(...)):
    """Encola un archivo: lo guarda en disco y lo agrega al final."""
    try:
        file_name = os.path.basename(file.filename)
        FILES_PATH.mkdir(parents=True, exist_ok=True)
        upload_directory = FILES_PATH / file_name
        with open(upload_directory, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        queue = read_queue()
        queue.append(file_name)
        write_queue(queue)

        return {"status": "saved", "name": file_name, "position": len(queue)}
```

### Consultar — `POST /getfiles`

> **Origen: equipo** — Devuelve la cola completa, del frente al final.

```python
@app.post("/getfiles")
def getFiles():
    """Devuelve la cola completa, del frente (indice 0) al final."""
    try:
        return read_queue()
```

### Desencolar — `POST /printfile`

> **Origen: equipo** — Saca el nombre del frente, borra el archivo y responde 409 si la cola está vacía.

```python
if not queue:
    raise HTTPException(status_code=409, detail="La cola esta vacia")

try:
    file_name = queue.pop(0)
    (FILES_PATH / file_name).unlink(True)
    write_queue(queue)

    return {"status": "printed", "name": file_name, "remaining": len(queue)}
```

### Subir con progreso

> **Origen: equipo** — `frontend/src/api.js` usa `XMLHttpRequest` porque `fetch` no informa el progreso de la subida.

```js
const xhr = new XMLHttpRequest();
xhr.open("POST", `${API_BASE}/uploadfile`);

xhr.upload.addEventListener("progress", (event) => {
  if (event.lengthComputable) {
    onProgress?.(event.loaded, event.total);
  }
});
```

### Imprimir desde la interfaz

> **Origen: equipo** — `App.jsx` marca el frente como saliente, llama a la API, espera la animación y vuelve a leer la cola.

```js
async function handlePrint() {
  if (files.length === 0) return;

  setPrinting(true);
  setNotice(null);
  setLeavingName(files[0]);

  try {
    const resultado = await printFile();
    await new Promise((listo) => setTimeout(listo, DURACION_SALIDA));
    setError(null);
    setNotice(`Imprimiste ${resultado.name}`);
  } catch (problema) {
    setError(problema.message);
  } finally {
    setPrinting(false);
    await refresh();
    setLeavingName(null);
  }
}
```

### Dibujar la cola

> **Origen: equipo** — `Queue.jsx` dibuja la lista en orden; solo el frente tiene el botón **Imprimir**.

```js
{files.map((name, indice) => (
  <QueueFile
    key={`${name}-${indice}`}
    name={name}
    position={indice + 1}
    isFront={indice === 0}
    isPrinting={indice === 0 && printing}
    isLeaving={indice === 0 && name === leavingName}
    onPrint={onPrint}
  />
))}
```

## Generado con IA

La versión estática de `version-web/`, publicada en GitHub Pages, se generó con inteligencia artificial. GitHub Pages no puede ejecutar el servidor FastAPI, así que la API se sustituye por una cola en memoria que imita sus respuestas. No se sube ni se guarda ningún archivo y la cola se borra al recargar. La interfaz es la misma que la de React, traducida a JavaScript sin bibliotecas.

### Cola en memoria

> **Origen: IA** — `ColaImpresion` (`version-web/cola.js`) reproduce los tres endpoints con un arreglo.

```js
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
```

### Subida simulada

> **Origen: IA** — Solo anima la barra de progreso; el contenido del archivo nunca se lee.

```js
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
```

### Imprimir sin React

> **Origen: IA** — `version-web/app.js` agrega la clase `is-leaving` a la tarjeta del frente para animar su salida y luego vuelve a dibujar la cola.

```js
frente?.classList.add("is-leaving");
frente?.setAttribute("aria-hidden", "true");
estado.printing = true;
render();

try {
  const resultado = await api.printFile();
  await new Promise((listo) => setTimeout(listo, DURACION_SALIDA));
  estado.error = null;
  estado.notice = `Imprimiste ${resultado.name}`;
} catch (problema) {
  estado.error = problema.message;
} finally {
  estado.printing = false;
  await refresh();
}
```

### Botón "Ver código"

> **Origen: IA** — Abre este panel con la documentación del proyecto.

```html
<button type="button" class="ver-codigo" data-ver-codigo="../CODIGO.md" data-titulo="Cola de impresión">Ver código</button>
```
