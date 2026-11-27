<div align="center">

**UNIVERSIDAD ANÁHUAC MAYAB**

# Proyecto 2 — Carrito de compras

### Documentación del proyecto (PAIF)

**Estructuras de Datos y Algoritmos** · NRC 50560<br>
Estructura de datos: **Listas**

Docente: Lizbeth Hernández Olan

**Integrantes del equipo**<br>
Alejandro Cervera Castillo · Gael Hernández Lozano · Mario Andrés Zaldívar de la Cruz · Rodolfo Concha Canto

Mérida, Yucatán · Noviembre de 2026

</div>

---

## Índice

1. [Fase 1. Contextualización](#fase-1-contextualización)
2. [Fase 2. Requerimientos funcionales](#fase-2-definición-de-los-requerimientos-funcionales)
3. [Fase 3. Diseño](#fase-3-diseño)
4. [Fase 4. Codificación](#fase-4-codificación)
5. [Fase 5. Pruebas](#fase-5-pruebas)
6. [Referencias](#referencias)

---

## Fase 1. Contextualización

### ¿Qué se debe hacer?

Simular un carrito de compras que use **listas** como estructura principal. El usuario debe poder consultar un catálogo, buscar productos y agregarlos al carrito. También debe poder ver el carrito con subtotales y total, cambiar cantidades, eliminar productos, vaciar el carrito y finalizar la compra. Todo se guarda en memoria, sin base de datos. Hay dos versiones:

- **Consola (Python):** menú numerado de 9 opciones con tablas en la terminal (librería `rich`).
- **Web (HTML + JavaScript):** catálogo en tarjetas, carrito editable y ticket de compra. Reutiliza las clases del equipo traducidas a JavaScript.

### ¿Qué se necesita?

- Una clase **Producto** con ID, nombre, categoría y precio.
- Una lista **Catálogo** precargada con los productos y búsqueda por ID.
- Una lista **Carrito** cuyos elementos (**renglones**) guardan producto, cantidad y subtotal.
- Operaciones de inserción, búsqueda, actualización y eliminación sobre la lista del carrito.
- Validación de entradas: IDs fuera de rango, cantidades no positivas o no numéricas y opciones de menú inválidas.

### ¿Qué elementos se identifican?

| Elemento | Descripción |
|---|---|
| Producto | `id`, `nombre`, `categoría`, `precio`. |
| Catálogo | Lista con 5 productos precargados (Teclado, Mouse, Monitor, Audífonos, Memoria USB). |
| Renglón del carrito | Producto + cantidad + subtotal (`precio × cantidad`). |
| Carrito | Lista de renglones. |
| Total | Suma de los subtotales del carrito. |
| Artículos | Suma de las cantidades del carrito. |
| Menú | Opciones 1–9 que llaman a cada operación (versión de consola). |

---

## Fase 2. Definición de los requerimientos funcionales

| ID | Requerimiento |
|---|---|
| R1 | Catálogo precargado |
| R2 | Mostrar el catálogo completo |
| R3 | Buscar producto por ID |
| R4 | Agregar producto al carrito |
| R5 | Ver el carrito con subtotales y total |
| R6 | Modificar la cantidad de un producto |
| R7 | Eliminar un producto del carrito |
| R8 | Vaciar el carrito |
| R9 | Finalizar la compra |
| R10 | Validar entradas y salir del programa |

| | |
|---|---|
| **Nombre** | R1 – Catálogo precargado |
| **Descripción** | Al iniciar, la clase `Catalogue` crea una lista con cinco objetos `Product`, cada uno con ID, nombre, categoría y precio. |
| **Entrada** | — (inicio del programa) |
| **Salidas** | Lista del catálogo en memoria |

| | |
|---|---|
| **Nombre** | R2 – Mostrar el catálogo completo |
| **Descripción** | Recorre la lista del catálogo y muestra cada producto en una tabla (consola) o en tarjetas (web). |
| **Entrada** | Opción `1` del menú (consola) / abrir la página (web) |
| **Salidas** | Tabla con las columnas ID, Producto, Categoría y Precio |

| | |
|---|---|
| **Nombre** | R3 – Buscar producto por ID |
| **Descripción** | Recorre la lista del catálogo hasta encontrar el ID (búsqueda secuencial). Si no existe, informa el error. |
| **Entrada** | ID del producto. Ej.: `3` |
| **Salidas** | `3 · Monitor · Electrónicos · 3200`, o un mensaje de error si el ID es inválido |

| | |
|---|---|
| **Nombre** | R4 – Agregar producto al carrito |
| **Descripción** | Busca el producto en el catálogo, crea un renglón con la cantidad indicada y lo **inserta al final** de la lista del carrito. En la web, si el producto ya estaba en el carrito, se suma la cantidad. |
| **Entrada** | ID del producto y cantidad. Ej.: `1`, `2` |
| **Salidas** | `¡Producto agregado al carrito!` y carrito actualizado |

| | |
|---|---|
| **Nombre** | R5 – Ver el carrito con subtotales y total |
| **Descripción** | Recorre la lista del carrito, muestra cada renglón con su subtotal (`precio × cantidad`) y acumula el total. |
| **Entrada** | Opción `4` del menú (consola) / sección "Mi carrito" (web) |
| **Salidas** | Tabla ID, Producto, Precio, Cantidad, Subtotal y `Total` |

| | |
|---|---|
| **Nombre** | R6 – Modificar la cantidad de un producto |
| **Descripción** | Localiza el renglón por ID, pide la nueva cantidad (entero positivo) y **reemplaza** el renglón en la misma posición de la lista, con lo que se recalcula el subtotal. |
| **Entrada** | ID del producto y nueva cantidad. Ej.: `1`, `3` |
| **Salidas** | Renglón con la nueva cantidad y el subtotal recalculado |

| | |
|---|---|
| **Nombre** | R7 – Eliminar un producto del carrito |
| **Descripción** | Localiza el renglón por ID, pide confirmación (s/n) y lo **elimina** de la lista. |
| **Entrada** | ID del producto y confirmación `s` |
| **Salidas** | `¡Producto eliminado del carrito!` y carrito sin el producto |

| | |
|---|---|
| **Nombre** | R8 – Vaciar el carrito |
| **Descripción** | Pide confirmación y elimina todos los renglones de la lista para reiniciar la compra. |
| **Entrada** | Opción `7` y confirmación `s` |
| **Salidas** | `¡Carrito vaciado!` y carrito con total 0 |

| | |
|---|---|
| **Nombre** | R9 – Finalizar la compra |
| **Descripción** | Muestra el resumen de la compra: los productos, el número de productos distintos, la cantidad total de artículos y el monto total. En la web aparece como ticket y el carrito se reinicia. |
| **Entrada** | Opción `8` (consola) / botón **Finalizar compra** (web) |
| **Salidas** | Ticket con productos, artículos y monto total |

| | |
|---|---|
| **Nombre** | R10 – Validar entradas y salir del programa |
| **Descripción** | Rechaza opciones fuera del rango 1–9, IDs fuera de 1–5 y cantidades menores o iguales a 0, y vuelve a pedir el dato. La opción 9 termina el programa. |
| **Entrada** | `12`, `abc`, `9` (ID), `0` (cantidad), `9` (opción) |
| **Salidas** | Mensajes de error y, con la opción 9, fin del programa |

---

## Fase 3. Diseño

![Diagrama de clases UML](evidencias/uml.png)

| Clase | Atributos | Métodos |
|---|---|---|
| **Product** *(dataclass)* | `id: int`<br>`name: str`<br>`category: str`<br>`price: int` | — (constructor generado por `@dataclass`) |
| **CatalogueEntry** *(hereda de `list`)* | `[id, name, category, price]` | `__init__(product)` |
| **CartEntry** *(hereda de `list`)* | `id`, `name`, `price`, `quantity`, `subtotal` | `__init__(product, quantity)` |
| **Catalogue** *(hereda de `list`)* | elementos: `Product` | `search_product(id) → Product` |
| **Cart** *(hereda de `list`)* | elementos: `CartEntry` | `add_product(product, quantity)`<br>`remove_product(id)`<br>`search_entries(id) → CartEntry`<br>`empty()` |

**Herencia:** `Catalogue`, `Cart`, `CartEntry` y `CatalogueEntry` **heredan de `list`**. Así, el catálogo y el carrito *son* listas de Python y usan directamente `append`, `remove`, `index`, `clear` y la iteración.

**Versión web:** `classes.js` traduce las mismas clases. Como en JavaScript no se hereda de `Array`, `Catalogue` guarda sus productos en `products: Product[]` y `Cart` sus renglones en `entries: CartEntry[]`. Para la interfaz se agregaron `CartEntry.setQuantity()` y, en `Cart`, `contains()`, `addOrIncrease()`, `updateQuantity()`, `isEmpty()`, `getTotal()` y `getItemCount()`.

---

## Fase 4. Codificación

### Tecnologías y archivos

| Versión | Archivos | Tecnologías |
|---|---|---|
| Consola | `version-cli/classes.py`, `main.py`, `user_input.py`, `pretty_print.py` | Python 3.14 + `rich` (tablas en la terminal) |
| Web | `version-web/classes.js`, `app.js`, `ui.js`, `index.html`, `styles.css` | HTML5, CSS3, JavaScript |

### Operaciones sobre listas

```python
class Cart(list):
    def add_product(self, product: Product, quantity: int):
        entry = CartEntry(product, quantity)
        self.append(entry)                  # inserción al final

    def remove_product(self, id: int):
        for entry in self:
            if entry.id == id:
                self.remove(entry)          # eliminación

    def search_entries(self, id: int) -> CartEntry:
        match = None
        for entry in self:                  # búsqueda secuencial
            if entry.id == id:
                match = entry
                break
        if match is None:
            raise KeyError(f"No hay ningún producto con el identificador {id}")
        return match

    def empty(self):
        self.clear()                        # vaciar la lista
```

### Fórmulas y asignaciones

```python
self.subtotal = product.price * quantity           # subtotal del renglón

for entry in cart:                                 # resumen al finalizar
    items += entry.quantity
    products += 1
    total += entry.subtotal
```

```python
cart[entry_index] = CartEntry(match, new_quantity)  # actualización en la misma posición
```

### Condicionales y validaciones

```python
if search_id in range(first_catalogue_number, last_catalogue_number + 1):
    break
else:
    print(f"\nEl ID del producto debe ser un entero positivo entre 1 y 5, intente de nuevo")

if quantity > 0:
    break
else:
    print("La cantidad del producto debe ser un entero positivo, intente de nuevo")
```

### Documentación del código

La explicación de cada funcionalidad está en [`CODIGO.md`](CODIGO.md). Ahí se distingue el código del equipo (**[EQUIPO]**) del agregado para la interfaz web (**[IA]**). Desde la página web se abre con el botón **Ver código**. En `version-web/classes.js` cada clase y método tiene comentarios JSDoc.

### Instalación y uso

**Consola**

1. Instale las dependencias:

   ```shell
   pip install -r requirements.txt
   ```

2. Inicie el programa:

   ```shell
   python main.py
   ```

3. Elija una opción del menú (1–9) y siga las indicaciones.

**Web:** abra `version-web/index.html` en el navegador o entre a la página publicada del proyecto.

### Limitaciones

- En consola, agregar dos veces el mismo producto crea dos renglones (la web suma las cantidades en un solo renglón).
- La búsqueda y la eliminación se hacen por ID.

---

## Fase 5. Pruebas

| Req. | Prueba | Resultado esperado | Resultado | Evidencia |
|---|---|---|---|---|
| R1, R2 | Opción 1 / abrir la página | 5 productos con ID, nombre, categoría y precio | ✅ | Fig. 1, 9 |
| R3 | Buscar ID 9 y luego ID 3 | Error para 9; Monitor $3,200 para 3 | ✅ | Fig. 2, 10, 11 |
| R4, R5 | Teclado ×2 + Audífonos ×1 | Subtotales 900 y 800; total 1,700 | ✅ | Fig. 3, 12 |
| R6 | Teclado → cantidad 0, luego 3 | Rechaza 0; subtotal 1,350 | ✅ | Fig. 4, 13, 14 |
| R7 | Eliminar Audífonos (ID 4) | Se quita del carrito | ✅ | Fig. 5, 15, 16 |
| R8 | Vaciar con confirmación | Carrito vacío, total 0 | ✅ | Fig. 6, 17, 18 |
| R9 | Teclado ×3 + Mouse ×1 → finalizar | 2 productos, 4 artículos, total 1,600 | ✅ | Fig. 7, 19 |
| R10 | Opción 12, luego 9 | Mensaje de error; el programa termina | ✅ | Fig. 8 |

### Versión de consola

**Figura 1.** Menú principal y catálogo precargado (R1, R2).

![Catálogo en consola](evidencias/cli-r1-r2-catalogo.png)

**Figura 2.** Búsqueda por ID con un ID inválido y uno válido (R3, R10).

![Búsqueda en consola](evidencias/cli-r3-buscar.png)

**Figura 3.** Agregar productos y ver el carrito con subtotales y total (R4, R5).

![Agregar y ver carrito en consola](evidencias/cli-r4-r5-agregar-ver.png)

**Figura 4.** Modificar la cantidad: se rechaza 0 y se acepta 3; el subtotal se recalcula (R6).

![Modificar cantidad en consola](evidencias/cli-r6-modificar.png)

**Figura 5.** Eliminar un producto con confirmación (R7).

![Eliminar en consola](evidencias/cli-r7-eliminar.png)

**Figura 6.** Vaciar el carrito con confirmación (R8).

![Vaciar en consola](evidencias/cli-r8-vaciar.png)

**Figura 7.** Finalizar la compra: productos, artículos y total (R9).

![Finalizar compra en consola](evidencias/cli-r9-finalizar.png)

**Figura 8.** Opción inválida y salida del programa (R10).

![Validación del menú en consola](evidencias/cli-r10-validacion-salir.png)

### Versión web

**Figura 9.** Catálogo precargado (R1, R2).

![Catálogo web](evidencias/web-r1-r2-catalogo.png)

**Figura 10.** Búsqueda del ID 3: se resalta el Monitor (R3).

![Búsqueda web](evidencias/web-r3-buscar.png)

**Figura 11.** Búsqueda de un ID inexistente (R3, R10).

![Búsqueda con error web](evidencias/web-r3-buscar-error.png)

**Figura 12.** Teclado ×2, Audífonos ×1 y Teclado ×1 otra vez: la web suma la cantidad del Teclado (R4, R5).

![Agregar y ver carrito web](evidencias/web-r4-r5-agregar-ver.png)

**Figura 13.** Cantidad de Audífonos cambiada a 3; subtotal y total recalculados (R6).

![Modificar cantidad web](evidencias/web-r6-modificar.png)

**Figura 14.** Intento de poner la cantidad en 0: se rechaza (R6, R10).

![Cantidad inválida web](evidencias/web-r6-modificar-error.png)

**Figura 15.** Confirmación antes de eliminar (R7).

![Confirmar eliminación web](evidencias/web-r7-eliminar-confirmar.png)

**Figura 16.** Carrito sin el producto eliminado (R7).

![Producto eliminado web](evidencias/web-r7-eliminar.png)

**Figura 17.** Confirmación para vaciar el carrito (R8).

![Confirmar vaciar web](evidencias/web-r8-vaciar-confirmar.png)

**Figura 18.** Carrito vacío (R8).

![Carrito vacío web](evidencias/web-r8-vaciar.png)

**Figura 19.** Ticket de compra: Monitor ×1 + Mouse ×2 → 2 productos, 3 artículos, $3,700.00 (R9).

![Ticket web](evidencias/web-r9-finalizar.png)

**Conclusión:** las operaciones de inserción, búsqueda, actualización y eliminación sobre la lista del carrito funcionan en las dos versiones. Los totales coinciden con el cálculo manual (por ejemplo, 3 × 450 + 1 × 250 = 1,600).

---

## Referencias

- Python Software Foundation. (2026). *Data Structures — More on Lists*. https://docs.python.org/3/tutorial/datastructures.html
- Python Software Foundation. (2026). *dataclasses — Data Classes*. https://docs.python.org/3/library/dataclasses.html
- Textualize. (2026). *Rich documentation — Tables*. https://rich.readthedocs.io/en/stable/tables.html
- Mozilla. (2026). *MDN Web Docs — Array*. https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array
- Cairó, O., & Guardati, S. (2006). *Estructuras de datos* (3.ª ed.). McGraw-Hill.
