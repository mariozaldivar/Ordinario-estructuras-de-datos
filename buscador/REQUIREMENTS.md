# Proyecto 3 — Navegador web (Pilas, LIFO)

> Fuente: `brightspace/3. Proyecto Pilas - Navegador web.pdf` (incluye un prototipo de 10 pantallas)
> Rúbricas y guía de documentación: `brightspace/`
> Entregas: "3. Navegador web - Código" y "3. Navegador web - Documentación".

## Objetivo
Simular el historial de un navegador con **dos pilas**:
- **Back stack**: páginas visitadas anteriormente.
- **Forward stack**: páginas a las que se puede volver después de retroceder.

La **página actual** se guarda aparte (no es parte de ninguna pila).

## Reglas de operación
| Acción | Efecto |
|--------|--------|
| Visitar URL | `push(actual)` en Back; la nueva URL pasa a ser la actual; **Forward se vacía** |
| Back | `push(actual)` en Forward; `pop()` de Back pasa a ser la actual |
| Forward | `push(actual)` en Back; `pop()` de Forward pasa a ser la actual |
| Exit | Sale del programa |

## Requerimientos funcionales
| ID | Requerimiento | Entrada | Salida |
|----|---------------|---------|--------|
| R1 | Visitar página ingresando una URL | URL | Nueva página actual; Forward vacío |
| R2 | Back (regresar) | — | Página anterior como actual |
| R3 | Forward (avanzar) | — | Página siguiente como actual |
| R4 | Mostrar la **página actual en todo momento** | — | URL actual (en el prototipo también un texto/título, p. ej. "Bienvenido a Mozilla", o "404" si no hay página) |
| R5 | Exit | — | Termina el programa |
| R6 | **Evitar errores** si no hay páginas para retroceder/avanzar | — | Mensaje (prototipo: "X PILA VACÍA") |
| R7 | Limpiar Forward al visitar una página nueva | — | Forward vacío |
| R8 | **Mensajes claros y amigables** | — | Avisos de URL inválida, pila vacía, etc. |

### Detalles del prototipo (pantallas 1–10 del PDF)
- Interfaz: campo URL + botón **Visitar**, botones **← Back**, **Forward →**, **Exit**, panel "Página actual" y visualización de **ambas pilas** con sus posiciones numeradas (1 = fondo).
- Las pilas tienen **capacidad 4** en el ejemplo; al llenarse se muestra **"X PILA LLENA"**. Al estar vacía, **"X PILA VACÍA"**. Conviene implementar capacidad máxima configurable y ambos mensajes.

## Entregables (rúbricas)
- Código: POO (clase `Pila`/`Stack` con `push`, `pop`, `peek`, `isEmpty`, `isFull`; clase `Navegador`), comentarios, buenas prácticas, uso correcto de **pilas**, sin errores, en GitHub.
- Documentación de 5 fases con capturas de cada requerimiento.

## Estado actual (`index.html`, `buscador.js`)
**Hecho**
- [x] Visitar URL validando con `URL.canParse` y vaciando Forward.
- [x] Back y Forward con dos arreglos usados como pilas (`push`/`pop`).
- [x] Muestra página actual y ambas listas.
- [x] Botón Exit (`window.close()`).

**Falta / problemas**
- [ ] La página actual se modela como el **tope de la pila Back** en lugar de una variable separada (difiere del enunciado). Con una sola página, Back la saca y queda sin página actual.
- [ ] No hay **mensajes** al usuario: URL inválida, pila vacía, pila llena se ignoran en silencio (R6, R8).
- [ ] No hay capacidad máxima ni mensaje "PILA LLENA" del prototipo.
- [ ] No hay clase `Pila` propia; la lógica de pila está mezclada con el DOM.
- [ ] `index.html` enlaza `styles.css`, que **no existe**.
- [ ] `window.close()` no funciona en pestañas no abiertas por script; mostrar una pantalla de salida.
- [ ] Nombres confusos: `visitadosElemento` apunta a `#retrocedidos` y viceversa.
- [ ] Falta el texto/título de la página actual (p. ej. "404") que muestra el prototipo.
- [ ] Faltan comentarios, UML y documentación.
