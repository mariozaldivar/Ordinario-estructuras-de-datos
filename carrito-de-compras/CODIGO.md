# Carrito de compras — código documentado

Catálogo y carrito guardados en listas.

## Implementación original del equipo

Escrito a mano por el equipo en `version-cli/`. La versión web usa esta misma lógica, traducida en la sección **[EQUIPO]** de `version-web/classes.js`.

### Catálogo precargado

> **Origen: equipo** — Lista de productos en memoria (`classes.py`).

```python
class Catalogue(list):
    def __init__(self, products: list[Product] | None = None):
        if products is None:
            catalogue = [
                Product(id=1, name="Teclado", category="Accesorios", price=450),
                Product(id=2, name="Mouse", category="Accesorios", price=250),
                Product(id=3, name="Monitor", category="Electrónicos", price=3200),
                Product(id=4, name="Audífonos", category="Audio", price=800),
```

### Buscar producto por ID

> **Origen: equipo** — Búsqueda secuencial en la lista.

```python
def search_product(self, id: int) -> Product:

    match = None

    for product in self:
        if product.id == id:
            match = product
            break

    if match is None:
        raise KeyError(f"No hay ningún producto con el identificador {id}")

    return match
```

### Renglón del carrito y subtotal

> **Origen: equipo** — Cada renglón guarda la cantidad y calcula su subtotal.

```python
class CartEntry(list):
    def __init__(
        self,
        product: Product,
        quantity: int,
    ):
        self.id = product.id
        self.name = product.name
        self.price = product.price
        self.quantity = quantity
        self.subtotal = product.price * quantity
```

### Agregar al carrito

> **Origen: equipo** — Agrega un renglón nuevo al final de la lista.

```python
def add_product(self, product: Product, quantity: int):

    entry = CartEntry(product, quantity)

    self.append(entry)
```

### Validar la cantidad

> **Origen: equipo** — La cantidad debe ser un entero positivo (`user_input.py`).

```python
if quantity > 0:
    break
else:
    print(
        "La cantidad del producto debe ser un entero positivo, intente de nuevo",
        file=stderr,
        end="\n\n",
    )
    continue
```

### Modificar cantidad

> **Origen: equipo** — Reemplaza el renglón por uno nuevo con la cantidad nueva (`main.py`).

```python
cart[entry_index] = CartEntry(match, new_quantity)
```

### Eliminar producto

> **Origen: equipo** — Quita el renglón con ese ID, previa confirmación.

```python
def remove_product(self, id: int):
    for entry in self:
        if entry.id == id:
            self.remove(entry)
```

### Vaciar carrito

> **Origen: equipo** — Vacía la lista.

```python
def empty(self):
    self.clear()
```

### Finalizar compra

> **Origen: equipo** — Cuenta productos, artículos y total.

```python
for entry in cart:
    items += entry.quantity
    products += 1
    total += entry.subtotal
```

## Generado con IA

Agregado con inteligencia artificial para la versión web: secciones **[IA]** de `classes.js` y los archivos `app.js` y `ui.js` completos.

### Sumar cantidad si ya está en el carrito

> **Origen: IA** — Evita renglones duplicados; reutiliza `addProduct` y `searchEntries` del equipo.

```js
addOrIncrease(product, quantity) {
  if (this.contains(product.id)) {
    const entry = this.searchEntries(product.id);
    entry.setQuantity(entry.quantity + quantity);
  } else {
    this.addProduct(product, quantity);
  }
}
```

### Cambiar cantidad sin reemplazar el renglón

> **Origen: IA** — Actualiza la cantidad y recalcula el subtotal.

```js
setQuantity(quantity) {
  this.quantity = quantity;
  this.subtotal = this.price * quantity;
}
```

### Total y artículos

> **Origen: IA** — El mismo cálculo de la opción 8 del equipo, como métodos de `Cart`.

```js
getTotal() {
  let total = 0;
  for (const entry of this.entries) {
    total += entry.subtotal;
  }
  return total;
}
```

### Leer la cantidad del formulario

> **Origen: IA** — Aplica la regla del equipo (entero positivo) al texto escrito.

```js
function parseQuantity(text) {
  const quantity = Number(text);

  if (text.trim() === "" || !Number.isInteger(quantity)) {
    throw new Error("La cantidad del producto debe ser un número entero.");
  }
  if (quantity <= 0) {
    throw new Error("La cantidad del producto debe ser un entero positivo.");
  }
  return quantity;
}
```

### Ticket de compra

> **Origen: IA** — Muestra el ticket con el monto total y reinicia el carrito.

```js
ticketElement.replaceChildren(
  ...cart.entries.map((entry) => line(`${entry.name} ×${entry.quantity}`, currencyFormat.format(entry.subtotal))),
  line("Productos distintos", cart.entries.length, "ticket-linea ticket-total"),
  line("Artículos", cart.getItemCount()),
  line("Monto total", currencyFormat.format(cart.getTotal()), "ticket-linea ticket-total"),
);

ticketDialog.showModal();
cart.empty();
renderCart();
```
