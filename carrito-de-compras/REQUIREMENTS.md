# Proyecto 2 — Carrito de compras (Listas)

> Fuente: `brightspace/2. Proyecto Listas - Carrito de Compras.pdf`
> Rúbricas y guía de documentación: `brightspace/` (PAIF Código, PAIF Documentación, Documentación del proyecto)
> Entregas: "2. Carrito de compras - Código" y "2. Carrito de compras - Documentación".

## Objetivo
Simular un carrito de compras que gestione productos usando **listas** como estructura principal: inserción, búsqueda, actualización y eliminación. Todo se guarda **en memoria** (sin base de datos).

## Requerimientos funcionales
| ID | Requerimiento | Entrada | Salida |
|----|---------------|---------|--------|
| R1 | **Catálogo precargado**; cada producto tiene `ID`, `nombre`, `precio` | — | Lista de productos en memoria |
| R2 | Ver el **catálogo completo** | — | Tabla ID / nombre / precio |
| R3 | **Buscar producto por ID** | ID | Producto o mensaje "no encontrado" |
| R4 | **Buscar producto por nombre** | Nombre (o parte) | Producto(s) o mensaje |
| R5 | **Agregar al carrito**: elegir producto + cantidad | ID/nombre, cantidad | Carrito actualizado (si ya está, sumar cantidad) |
| R6 | **Ver carrito**: productos, cantidad, precio unitario, **subtotal** por producto y **total acumulado** | — | Tabla del carrito + total |
| R7 | **Modificar cantidad** de un producto del carrito; el subtotal se recalcula automáticamente | Producto, nueva cantidad | Carrito actualizado |
| R8 | **Eliminar producto** del carrito por **ID o por nombre** | ID o nombre | Carrito sin el producto |
| R9 | **Vaciar carrito** y reiniciar la compra | — | Carrito vacío |
| R10 | **Finalizar compra**: lista de productos comprados, **cantidad total de artículos** y **monto total** | — | Ticket/resumen |

## Requerimientos no funcionales
- Interfaz de **consola**; el modo gráfico es **opcional**.
- **Validación de entradas** (IDs inexistentes, cantidades ≤ 0 o no numéricas, nombres vacíos).
- **Manejo de errores** básicos con mensajes claros.
- **POO** obligatoria (p. ej. `Producto`, `ItemCarrito`, `Catalogo`, `Carrito`, `Tienda/Menu`).
- **Uso obligatorio de listas** para almacenar catálogo y carrito (la rúbrica califica la estructura usada).

## Entregables (rúbricas)
- Código: clases = UML, comentarios en clases y métodos, buenas prácticas, ejecuta sin errores, en GitHub, entrega puntual (10 pts).
- Documentación: 5 fases (Contextualización, Requerimientos R1…Rn con nombre/descr./entrada/salida, UML, Codificación, Pruebas con capturas por requerimiento), portada, referencias.

## Estado actual
- `index.html`: maqueta estática (título, un `<input>` sin lógica, tabla con 1 producto fijo "Cebolla", `div#carrito_actual` vacío).
- `carrito.js`: **vacío** y no está enlazado desde `index.html`.

**Falta prácticamente todo**
- [ ] Clases y lista de catálogo precargado (R1).
- [ ] Ver catálogo / buscar por ID / por nombre (R2–R4).
- [ ] Agregar, ver, modificar, eliminar, vaciar, finalizar (R5–R10).
- [ ] Validaciones y mensajes de error.
- [ ] Documentación y UML.
