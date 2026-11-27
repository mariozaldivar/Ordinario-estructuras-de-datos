<div align="center">

**UNIVERSIDAD ANÁHUAC MAYAB**

# Proyecto 5 — Sistema de archivos

### Documentación del proyecto (PAIF)

**Estructuras de Datos y Algoritmos** · NRC 50560<br>
Estructura de datos: **Árbol binario de búsqueda (ABB)**

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

Simular un sistema de archivos con un **árbol binario de búsqueda** en el que cada nodo es un **archivo** o un **directorio**, ordenado alfabéticamente por nombre. El programa empieza con el directorio raíz `Documentos`. Permite crear directorios, insertar archivos, buscar y eliminar elementos y recorrer el árbol en inorden, preorden y postorden. Hay dos versiones:

- **Consola (Python):** menú de 8 opciones con tablas en la terminal (librería `rich`).
- **Web (HTML + JavaScript):** dibuja el árbol, anima la búsqueda y los recorridos y muestra la ficha de cada elemento. Usa las mismas clases traducidas a JavaScript.

### ¿Qué se necesita?

- Una clase **Nodo** con nombre, extensión, tamaño en bytes, tipo (archivo o directorio) e hijos izquierdo y derecho.
- Una clase **Árbol** con la raíz y las operaciones de insertar, buscar, eliminar y los tres recorridos.
- Reglas del sistema de archivos:
  - La raíz es un directorio y **no puede eliminarse**.
  - Un **archivo siempre es hoja**: no puede contener otros elementos.
  - **No hay nombres duplicados.**
  - Un archivo **debe** tener extensión (máximo 3 caracteres) y un tamaño ≥ 0.

### ¿Qué elementos se identifican?

| Elemento | Descripción |
|---|---|
| Nodo | Archivo o directorio: `name`, `extension`, `size`, `file_type`, `left`, `right`. |
| Raíz | Directorio `Documentos`, creado al iniciar. |
| Clave de orden | El nombre, comparado alfabéticamente (menor → izquierda, mayor → derecha). |
| Directorio | Nodo que puede tener hijos (tamaño 0, sin extensión). |
| Archivo | Nodo hoja con extensión y tamaño. |
| Recorridos | Inorden (izq-raíz-der), preorden (raíz-izq-der), postorden (izq-der-raíz). |
| Casos de eliminación | Hoja, un hijo o dos hijos (sucesor inorden). |

---

## Fase 2. Definición de los requerimientos funcionales

| ID | Requerimiento |
|---|---|
| R1 | Crear directorio |
| R2 | Insertar archivo |
| R3 | Buscar elemento por nombre |
| R4 | Eliminar archivo o directorio |
| R5 | Recorrido inorden |
| R6 | Recorrido preorden |
| R7 | Recorrido postorden |
| R8 | Mostrar la información de un elemento |
| R9 | Validar las reglas de inserción |
| R10 | Salir |

| | |
|---|---|
| **Nombre** | R1 – Crear directorio |
| **Descripción** | Crea un nodo de tipo directorio y lo inserta en el ABB: desciende desde la raíz comparando nombres hasta encontrar un lugar vacío. |
| **Entrada** | Nombre. Ej.: `Fotos` |
| **Salidas** | `Directorio 'Fotos' insertado correctamente en el árbol` y el árbol actualizado |

| | |
|---|---|
| **Nombre** | R2 – Insertar archivo |
| **Descripción** | Crea un nodo de tipo archivo con extensión y tamaño, y lo inserta igual que un directorio. Al ser archivo, quedará siempre como hoja. |
| **Entrada** | Nombre, extensión y tamaño. Ej.: `Tarea`, `txt`, `1200` |
| **Salidas** | `Archivo 'Tarea' (1200 bytes) insertado correctamente en el árbol` |

| | |
|---|---|
| **Nombre** | R3 – Buscar elemento por nombre |
| **Descripción** | Búsqueda binaria: desde la raíz va a la izquierda o a la derecha según la comparación alfabética, hasta encontrar el nombre o llegar a un hijo vacío. |
| **Entrada** | Nombre. Ej.: `Tarea` / `Nada` |
| **Salidas** | Tabla Nombre, Extensión, Tamaño, Tipo, o `Could not find an element with the name Nada` / "El elemento no existe en el sistema de archivos." |

| | |
|---|---|
| **Nombre** | R4 – Eliminar archivo o directorio |
| **Descripción** | Busca el elemento, muestra su información y pide confirmación. Aplica los tres casos del ABB: **hoja** (se desconecta), **un hijo** (el hijo ocupa su lugar) y **dos hijos** (se reemplaza por su sucesor inorden, el mínimo del subárbol derecho). La raíz está protegida. |
| **Entrada** | Nombre y confirmación `s`/`n`. Ej.: `Backup`, `s` |
| **Salidas** | Árbol actualizado, o `Cannot delete the root directory` / "PROTEGIDO: No se puede eliminar el directorio raíz." |

| | |
|---|---|
| **Nombre** | R5 – Recorrido inorden |
| **Descripción** | Visita el subárbol izquierdo, después el nodo y después el subárbol derecho. Da los elementos en orden alfabético. |
| **Entrada** | Opción `5` / botón **Inorden** |
| **Salidas** | Tabla Nombre, Extensión, Tamaño, Tipo en orden inorden |

| | |
|---|---|
| **Nombre** | R6 – Recorrido preorden |
| **Descripción** | Visita el nodo, después el subárbol izquierdo y después el derecho. La raíz aparece primero. |
| **Entrada** | Opción `6` / botón **Preorden** |
| **Salidas** | Tabla en orden preorden |

| | |
|---|---|
| **Nombre** | R7 – Recorrido postorden |
| **Descripción** | Visita el subárbol izquierdo, después el derecho y al final el nodo. La raíz aparece al último. |
| **Entrada** | Opción `7` / botón **Postorden** |
| **Salidas** | Tabla en orden postorden |

| | |
|---|---|
| **Nombre** | R8 – Mostrar la información de un elemento |
| **Descripción** | Muestra la ficha del elemento encontrado o seleccionado: nombre, extensión, tamaño y tipo. En la web también muestra el camino desde la raíz. |
| **Entrada** | Nombre buscado o clic sobre un nodo (web) |
| **Salidas** | Ficha del elemento |

| | |
|---|---|
| **Nombre** | R9 – Validar las reglas de inserción |
| **Descripción** | Rechaza: nombres duplicados, insertar debajo de un archivo, nombre vacío, extensión vacía o de más de 3 caracteres, tamaño negativo y caracteres no ASCII. Muestra el error y vuelve a pedir los datos. |
| **Entrada** | `Fotos` (duplicado), `Zeta.pdf` (cae bajo un archivo), nombre vacío, `docx` |
| **Salidas** | `…there is already an element with such name`, `…a file cannot contain other elements`, `The file or directory cannot be the empty string`, `The file extension length cannot exceed 3…` |

| | |
|---|---|
| **Nombre** | R10 – Salir |
| **Descripción** | Termina el programa de consola. |
| **Entrada** | Opción `8` |
| **Salidas** | `Exiting...` |

---

## Fase 3. Diseño

![Diagrama de clases UML](evidencias/uml.png)

| Clase | Atributos | Métodos |
|---|---|---|
| **Node** | `name: str`<br>`file_type: str` (`file` \| `directory`)<br>`size: int`<br>`extension: str \| None`<br>`left: Node \| None`<br>`right: Node \| None` | `is_file() → bool`<br>`is_directory() → bool`<br>`_is_printable_ascii_string(string) → bool`<br>`_pretty_print_attributes()`<br>`__repr__() → str` |
| **BinaryTree** | `root: Node` | `insert(new_node)`<br>`search(target_name) → Node`<br>`delete(target_name)`<br>`count_children_nodes(target_node) → int`<br>`trajectorize_traversal(algorithm) → list[Node]`<br>`_trajectorize_inorder_traversal(node)`<br>`_trajectorize_preorder_traversal(node)`<br>`_trajectorize_postorder_traversal(node)` |

**Relaciones:** `BinaryTree` se compone de un `Node` raíz. Cada `Node` se relaciona consigo mismo con 0 a 2 hijos (`left`, `right`), que es la estructura recursiva del árbol. No hay herencia: archivo y directorio se distinguen con el atributo `file_type`.

**Versión web:** `classes.js` traduce las clases como `FileNode` y `BinaryTree`. Para la interfaz se agregaron `FileNode.fullName()` y, en `BinaryTree`, `searchPath(name)` (camino recorrido, para animarlo), `height()` y `size()`.

---

## Fase 4. Codificación

### Tecnologías y archivos

| Versión | Archivos | Tecnologías |
|---|---|---|
| Consola | `version-cli/classes.py`, `main.py`, `constants.py` | Python 3.14 + `rich` |
| Web | `version-web/classes.js`, `app.js`, `ui.js`, `index.html`, `styles.css` | HTML5, CSS3, JavaScript, SVG |

### Inserción (condicionales del ABB)

```python
def insert(self, new_node: Node):
    current_node: Node = self.root
    previous_node: Node | None = None

    while current_node is not None:
        previous_node = current_node
        if current_node.name == new_node.name:                 # sin duplicados
            raise ValueError(f"Cannot insert element with the name {new_node.name!r}, ...")
        if new_node.name < current_node.name:
            current_node = current_node.left                    # menor → izquierda
        elif new_node.name > current_node.name:
            current_node = current_node.right                   # mayor → derecha

    if not previous_node.is_directory():                        # un archivo es hoja
        raise ValueError(f"Cannot insert element in node {previous_node.name!r}, a file cannot contain other elements")

    if new_node.name < previous_node.name:
        previous_node.left = new_node
    elif new_node.name > previous_node.name:
        previous_node.right = new_node
```

### Eliminación (tres casos)

```python
match self.count_children_nodes(target_node):
    case 2:   # sucesor inorden: mínimo del subárbol derecho
        current_node, previous_node = target_node.right, target_node
        while current_node.left is not None:
            previous_node, current_node = current_node, current_node.left
        target_node.name = current_node.name          # se copian los datos del sucesor
        ...
    case 1:   # el único hijo ocupa el lugar del nodo
        replacement = target_node.right if target_node.left is None else target_node.left
        ...
    case 0:   # hoja: se desconecta del padre
        ...
```

### Recorridos recursivos

```python
def _trajectorize_inorder_traversal(self, node: Node):
    trajectory = []
    if node is not None:
        trajectory.extend(self._trajectorize_inorder_traversal(node.left))
        trajectory.append(node)
        trajectory.extend(self._trajectorize_inorder_traversal(node.right))
    return trajectory
```

En preorden, `append(node)` va antes de las dos llamadas recursivas; en postorden, después.

### Documentación del código

La explicación de cada funcionalidad está en [`CODIGO.md`](CODIGO.md). Ahí se distingue el código del equipo (**[EQUIPO]**) del agregado para la interfaz web (**[IA]**). Se abre también con el botón **Ver código** de la página. En `version-web/classes.js` cada clase y método tiene comentarios JSDoc.

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

3. Elija una opción del menú (1–8).

**Web:** abra `version-web/index.html` en el navegador o entre a la página publicada del proyecto.

### Limitaciones

- Los nombres se comparan carácter por carácter (orden ASCII): las mayúsculas van antes que las minúsculas y no se admiten acentos.
- Un directorio con dos hijos no se puede eliminar si su sucesor inorden es un archivo, porque el archivo quedaría con hijos.

---

## Fase 5. Pruebas

Árbol de prueba: raíz `Documentos`; directorios `Fotos`, `Apuntes`, `Musica`, `Backup`; archivos `Tarea.txt` (1200 B) e `Indice.md` (80 B). Resultado: 7 nodos y altura 4.

| Req. | Prueba | Resultado esperado | Resultado | Evidencia |
|---|---|---|---|---|
| R1 | Crear Fotos, Apuntes, Musica | Apuntes a la izquierda de la raíz; Fotos a la derecha; Musica a la derecha de Fotos | ✅ | Fig. 2, 10 |
| R2 | Tarea.txt, Indice.md | Insertados como hojas bajo Musica | ✅ | Fig. 3, 11 |
| R9 | Fotos repetido, Zeta.pdf, nombre vacío, `docx`, sin extensión | Mensajes de error | ✅ | Fig. 2, 3, 12–14 |
| R3, R8 | Buscar Tarea / Indice y Nada | Ficha del elemento / "no existe" | ✅ | Fig. 4, 15, 16 |
| R5 | Inorden | Apuntes, Backup, Documentos, Fotos, Indice, Musica, Tarea | ✅ | Fig. 5, 17 |
| R6 | Preorden | Documentos, Apuntes, Backup, Fotos, Musica, Indice, Tarea | ✅ | Fig. 6, 18 |
| R7 | Postorden | Backup, Apuntes, Indice, Tarea, Musica, Fotos, Documentos | ✅ | Fig. 7, 19 |
| R4 | Eliminar Documentos; Backup | Raíz protegida; Backup eliminado | ✅ | Fig. 8, 20–22 |
| R10 | Opción 8 | `Exiting...` | ✅ | Fig. 8 |

### Versión de consola

**Figura 1.** Menú principal.

![Menú](evidencias/cli-menu.png)

**Figura 2.** Crear directorios, incluido un nombre duplicado (R1, R9).

![Crear directorio](evidencias/cli-r1-directorio.png)

**Figura 3.** Insertar archivos: errores por caer debajo de un archivo, nombre vacío y extensión de 4 caracteres (R2, R9).

![Insertar archivo](evidencias/cli-r2-archivo.png)

**Figura 4.** Buscar un nombre inexistente y uno existente (R3, R8).

![Buscar](evidencias/cli-r3-buscar.png)

**Figura 5.** Recorrido inorden: orden alfabético (R5).

![Inorden](evidencias/cli-r5-inorden.png)

**Figura 6.** Recorrido preorden: la raíz primero (R6).

![Preorden](evidencias/cli-r6-preorden.png)

**Figura 7.** Recorrido postorden: la raíz al último (R7).

![Postorden](evidencias/cli-r7-postorden.png)

**Figura 8.** Eliminar: la raíz está protegida; al responder `n` con `Apuntes` no se elimina y se pide otro nombre; `Backup` se elimina con `s`. Después, la opción 8 termina el programa (R4, R10).

![Eliminar](evidencias/cli-r4-eliminar.png)

### Versión web

**Figura 9.** Estado inicial: solo el directorio raíz `Documentos`.

![Inicio](evidencias/web-inicio-raiz.png)

**Figura 10.** Directorios insertados (azul) en orden alfabético (R1).

![Directorios web](evidencias/web-r1-directorio.png)

**Figura 11.** Archivo `Tarea.txt` insertado como hoja (verde) (R2).

![Archivo web](evidencias/web-r2-archivo.png)

**Figura 12.** `Zeta.pdf` no se inserta porque caería debajo de un archivo (R9).

![Archivo hoja web](evidencias/web-r9-archivo-hoja.png)

**Figura 13.** Nombre duplicado (R9).

![Duplicado web](evidencias/web-r9-duplicado.png)

**Figura 14.** Archivo sin extensión (R9).

![Sin extensión web](evidencias/web-r9-sin-extension.png)

**Figura 15.** Búsqueda de `Indice`: se resalta el camino y se muestra la ficha (R3, R8).

![Buscar web](evidencias/web-r3-r8-buscar.png)

**Figura 16.** Búsqueda de un elemento inexistente (R3).

![No existe web](evidencias/web-r3-no-existe.png)

**Figura 17.** Recorrido inorden numerado sobre el árbol (R5).

![Inorden web](evidencias/web-r5-inorden.png)

**Figura 18.** Recorrido preorden (R6).

![Preorden web](evidencias/web-r6-preorden.png)

**Figura 19.** Recorrido postorden (R7).

![Postorden web](evidencias/web-r7-postorden.png)

**Figura 20.** Intento de eliminar la raíz (R4).

![Raíz protegida web](evidencias/web-r4-raiz-protegida.png)

**Figura 21.** Confirmación antes de eliminar `Backup` (R4).

![Confirmar eliminación web](evidencias/web-r4-eliminar-confirmar.png)

**Figura 22.** Árbol sin `Backup` (R4).

![Eliminado web](evidencias/web-r4-eliminar.png)

**Conclusión:** la inserción respeta el orden alfabético y las reglas del sistema de archivos. Los tres recorridos dan las secuencias calculadas a mano y la eliminación protege la raíz.

---

## Referencias

- Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C. (2022). *Introduction to Algorithms* (4.ª ed., cap. 12 "Binary Search Trees"). MIT Press.
- Python Software Foundation. (2026). *The Python Tutorial — Classes*. https://docs.python.org/3/tutorial/classes.html
- Textualize. (2026). *Rich documentation — Tables*. https://rich.readthedocs.io/en/stable/tables.html
- Mozilla. (2026). *MDN Web Docs — SVG*. https://developer.mozilla.org/es/docs/Web/SVG
