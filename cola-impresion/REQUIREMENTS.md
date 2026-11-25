# Proyecto 4 — Cola de impresión (Colas, FIFO)

> Fuente: `brightspace/4. Proyecto Colas - Cola de impresión.pdf` (incluye un prototipo de 16 pantallas)
> Rúbricas y guía de documentación: `brightspace/`
> Entregas: "4. Cola de impresión - Código" y "4. Cola de impresión - Documentación" (enlaces al repo y a la documentación).

## Objetivo
Implementar la estructura **Cola** (inserción al final, eliminación al frente) para administrar trabajos de impresión enviados por **PC1, PC2, PC3, PC4 y PC5**. Se puede usar arreglo, lista enlazada o la lista del lenguaje.

## Requerimientos funcionales
| ID | Requerimiento | Entrada | Salida |
|----|---------------|---------|--------|
| R1 | **Agregar trabajo**: el programa elige **al azar** una PC (PC1–PC5) que envía un documento; se agrega **al final** y se muestra la cola | Acción del usuario | Cola actualizada |
| R2 | **Imprimir**: elimina el **primer** elemento e indica qué PC se atiende (p. ej. "Impresión PC2") | Acción del usuario | Mensaje + cola actualizada |
| R3 | **Mostrar la cola**: todos los trabajos pendientes en orden de atención | — | Lista ordenada |
| R4 | **Cola llena**: capacidad máxima definida (ej. **6**); al intentar agregar: **"La cola de impresión está LLENA"** | — | Mensaje |
| R5 | **Cola vacía**: al intentar imprimir sin trabajos: **"La cola de impresión está VACÍA"** | — | Mensaje |

### Detalles del prototipo
- Las 5 PCs a la izquierda, botón **Imprimir**, la cola dibujada horizontalmente (frente a la izquierda), aviso de LLENA / VACÍA, y mensaje "Impresión PCx" al atender.
- Resumen: tamaño fijo o dinámico, estructura FIFO, acciones agregar/imprimir, control de capacidad con mensajes LLENA/VACÍA.

## Entregables (rúbricas)
- Código: POO (clase `Cola` con `encolar`, `desencolar`, `frente`, `estaVacia`, `estaLlena`; clase `TrabajoImpresion`/`PC`), comentarios, buenas prácticas, uso correcto de **colas**, sin errores, en GitHub.
- Documentación de 5 fases con capturas de cada requerimiento.

## Estado actual
- **Backend** FastAPI (`backend/src/backend/main.py`): cola persistida en `queue.json`; `/uploadfile` encola al final, `/getfiles` devuelve la cola, `/printfile` saca el frente y responde 409 "La cola esta vacia".
- **Frontend** React + Vite (`frontend/src`): subir archivos (drag & drop), ver cola con posiciones, botón Imprimir en el frente, animación y mensajes.
- **Documentación**: `Documentacion Proyecto Cola Impresion.docx/.pdf` ya existe.

**Hecho**
- [x] FIFO correcto (append al final, `pop(0)` del frente) — R3 y la parte FIFO de R1/R2.
- [x] Mensaje de impresión del trabajo atendido ("Imprimiste X").
- [x] Documento de documentación.

**Falta / diferencias con el enunciado**
- [ ] **R1**: los trabajos vienen de archivos subidos, no de una **PC aleatoria (PC1–PC5)**. Falta botón "Agregar trabajo" que elija la PC al azar (y mostrar la PC de cada trabajo).
- [ ] **R4**: no hay **capacidad máxima** ni mensaje **"La cola de impresión está LLENA"**.
- [ ] **R5**: el backend responde "La cola esta vacia", pero el botón Imprimir solo aparece cuando hay elementos, así que el usuario nunca ve el mensaje. Debe existir y mostrar exactamente "La cola de impresión está VACÍA".
- [ ] No hay una **clase Cola** explícita (se usa `list` + JSON); la rúbrica pide clases acordes al UML.
- [ ] Revisar que la documentación existente refleje los cambios (PCs, capacidad, mensajes) y tenga capturas de cada requerimiento.
- [ ] `backend/README.md` vacío: agregar instrucciones para ejecutar (`uv run fastapi dev …` + `npm run dev`).
