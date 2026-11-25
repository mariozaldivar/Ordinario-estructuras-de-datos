# Sistema de archivos — código documentado

Árbol binario de búsqueda donde cada nodo es un archivo o un directorio, ordenado por nombre.

## Implementación original del equipo

Escrito a mano por el equipo en `version-cli/`. La versión web usa esta misma lógica, traducida en la sección **[EQUIPO]** de `version-web/classes.js`.

### Directorio raíz

> **Origen: equipo** — El árbol inicia con `Documentos`; la raíz debe ser un directorio.

```python
def __init__(self, root: Node | None = None):
    if root is None:
        self.root = Node(name=ROOT_DIRECTORY_NAME, file_type="directory")
    else:
        if not root.is_directory():
            raise ValueError("The root of the filesystem must be a directory")

        self.root = root
```

### Validar archivos y directorios

> **Origen: equipo** — Nombre ASCII, extensión obligatoria de máximo 3 caracteres y tamaño no negativo.

```python
if file_type.lower() == "file":
    if extension is None:
        raise ValueError("An extension must be specified for a file")

    elif len(extension) == 0:
        raise ValueError("The file extension cannot be the empty string")

    elif not self._is_printable_ascii_string(extension):
        raise ValueError(
            "The file extension must be a string of printable ASCII characters"
        )

    elif len(extension) > MAX_FILE_EXTENSION_LENGTH:
        raise ValueError(
            f"The file extension length cannot exceed {MAX_FILE_EXTENSION_LENGTH} printable ASCII characters"
        )
```

### Insertar

> **Origen: equipo** — Desciende por nombre; rechaza duplicados y nodos que colgarían de un archivo.

```python
while current_node is not None:
    previous_node = current_node

    if current_node.name == new_node.name:
        raise ValueError(
            f"Cannot insert element with the name {new_node.name!r}, there is already an element with such name"
        )

    if new_node.name < current_node.name:
        current_node = current_node.left
    elif new_node.name > current_node.name:
        current_node = current_node.right

if not previous_node.is_directory():
    raise ValueError(
        f"Cannot insert element in node {previous_node.name!r}, a file cannot contain other elements"
    )
```

### Buscar

> **Origen: equipo** — Búsqueda binaria por nombre.

```python
while current_node is not None:
    if target_name < current_node.name:
        current_node = current_node.left

    elif target_name > current_node.name:
        current_node = current_node.right

    else:
        break
```

### Eliminar

> **Origen: equipo** — Tres casos (dos hijos con sucesor inorden, un hijo, hoja); la raíz está protegida.

```python
match self.count_children_nodes(target_node):
    case 2:
        current_node: Node = target_node.right
        previous_node: Node = target_node

        while current_node.left is not None:
            previous_node = current_node

            current_node = current_node.left

        minimum_node = current_node
        # ... se copian sus datos al nodo eliminado

    case 1:
        if target_node.left is None:
            replacement = target_node.right
        else:
            replacement = target_node.left
```

### Recorridos

> **Origen: equipo** — Recorridos recursivos preorden, inorden y postorden (se muestra el inorden).

```python
def _trajectorize_inorder_traversal(self, node: Node):
    trajectory = []

    if node is not None:
        trajectory.extend(self._trajectorize_inorder_traversal(node.left))

        trajectory.append(node)

        trajectory.extend(self._trajectorize_inorder_traversal(node.right))

    return trajectory
```

## Generado con IA

Agregado con inteligencia artificial para la versión web: secciones **[IA]** de `classes.js` y los archivos `app.js` y `ui.js` completos.

### Camino de búsqueda

> **Origen: IA** — Mismo descenso que la búsqueda del equipo, pero guarda los nodos visitados para animarlos.

```js
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
```

### Altura del árbol

> **Origen: IA** — Se muestra junto al número de nodos.

```js
height(node = this.root) {
  if (node === null) return 0;
  return 1 + Math.max(this.height(node.left), this.height(node.right));
}
```

### Dibujo del árbol

> **Origen: IA** — Columna = posición en inorden; fila = profundidad.

```js
function place(node, depth) {
  if (node === null) return;
  place(node.left, depth + 1);
  positions.set(node, {
    x: PADDING + column * (NODE_WIDTH + HORIZONTAL_GAP) + NODE_WIDTH / 2,
    y: PADDING + depth * LEVEL_HEIGHT + NODE_HEIGHT / 2,
  });
  maxDepth = Math.max(maxDepth, depth);
  column += 1;
  place(node.right, depth + 1);
}
```

### Animación de búsqueda

> **Origen: IA** — Ilumina cada nodo del camino y marca el resultado.

```js
for (const node of visited) {
  const group = nodeElements.get(node.name);
  group.classList.add("visitando");
  await wait(stepDelay);
  if (run !== animationRun) return false;
  group.classList.replace("visitando", "visitado");
}
```
