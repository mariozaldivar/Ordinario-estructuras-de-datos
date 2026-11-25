# Proyecto 5 — Sistema de archivos (Árbol binario de búsqueda)

> Fuente: `brightspace/5. Proyecto Árboles - Sistema de archivos.pdf`
> Prototipos: `brightspace/archivos_consola.png` (modo consola) y `brightspace/archivos_grafico.png` (modo gráfico)
> Rúbricas y guía de documentación: `brightspace/`
> Entregas: "5. Sistema de archivos - Código" (enlace al repo) y "5. Sistema de archivos - Documentación" (enlace al documento). **Cierran el 21/11/2026.**

## Objetivo
Simular un sistema de archivos con un **ABB**: cada nodo es un archivo o un directorio.

## Estructura
**Clase Nodo** (mínimo): `nombre`, `extension` (directorios: ninguna/"-"), `tamano` en bytes (directorio: 0), `tipo` (Directorio | Archivo), `izquierdo`, `derecho`.

**Clase Árbol**: raíz, insertar, buscar, eliminar, recorridos inorden/preorden/postorden, validaciones. Más un **menú interactivo**.

## Reglas del árbol
- El programa **inicia creando un directorio raíz** (ejemplo: `Documentos`).
- La raíz **no puede ser un archivo** y **no puede eliminarse**.
- Todos los elementos cuelgan de la raíz.
- Un **Archivo** no puede contener nodos → siempre es **hoja**. Un **Directorio** sí puede tener hijos.

## Requerimientos funcionales
| ID | Requerimiento | Entrada | Salida |
|----|---------------|---------|--------|
| R1 | Crear directorio | Nombre | "Directorio 'X' insertado correctamente" + árbol actualizado |
| R2 | Insertar archivo | Nombre, extensión, tamaño | "Archivo 'x.ext' (n bytes) insertado" |
| R3 | Buscar por nombre | Nombre | Nombre, Extensión, Tipo, Tamaño (y Ruta en el prototipo) o "El elemento no existe en el sistema de archivos." |
| R4 | Eliminar archivo o directorio (con confirmación S/N en el prototipo) | Nombre | Mensaje de eliminado / error |
| R5 | Recorrido **inorden** | — | Tabla nombre, ext, tamaño, tipo |
| R6 | Recorrido **preorden** | — | Ídem |
| R7 | Recorrido **postorden** | — | Ídem |
| R8 | Información de un elemento seleccionado | Nombre | Ficha del elemento |
| R9 | Validar reglas de inserción y restricciones | — | Mensajes de error |
| R10 | Salir | — | Mensaje de despedida |

### Inserción (clave = nombre, orden alfabético)
1. Nuevo < actual → izquierda; nuevo > actual → derecha.
2. **Sin duplicados**: "Ya existe un elemento con nombre 'X'".
3. Si al descender se llega a un nodo **Archivo**, no se puede continuar: `ERROR: No se puede insertar el elemento. Un archivo no puede contener otros elementos.`
4. Si el nodo actual es **Directorio**, se continúa por izquierda/derecha.

### Eliminación (casos clásicos de ABB)
1. Hoja → se elimina directo.
2. Un hijo → se reemplaza por su hijo.
3. Dos hijos → sucesor inorden (u otro método estándar).
- Restricciones: **no eliminar la raíz** ("PROTEGIDO: No se puede eliminar el directorio raíz"); considerar que un directorio puede tener elementos → **recomendado: solo eliminar directorios vacíos**.

### Validaciones
- Archivo **debe** tener extensión; directorio **no** debe tenerla.
- Tamaño de archivo ≥ 0.
- Nombre no vacío (prototipo: tampoco con espacios).

### Prototipos
- **Consola**: menú de 9 opciones (Crear directorio, Insertar archivo, Buscar, Eliminar, Inorden, Preorden, Postorden, Información, Salir), dibujo ASCII del árbol, "Presione ENTER para continuar…", pie con nodos y altura.
- **Gráfico** (ejemplo en Java Swing; el lenguaje no es obligatorio): panel "Nuevo elemento" (nombre, tipo, botones Insertar/Buscar/Eliminar), árbol dibujado con directorios en **azul** y archivos en **verde**, consola de log, diálogos de búsqueda, información y error, pantalla de salida.

## Entregables (rúbricas)
- Código: clases = UML, comentarios, buenas prácticas, uso correcto del **árbol**, sin errores, en GitHub.
- Documentación de 5 fases con capturas de cada requerimiento.

## Estado actual
- Proyecto **Create React App recién generado**: `src/App.js` es la plantilla por defecto ("Esto es una prueba del live reload").
- `src/components/file.js`: componente de 6 líneas que no se exporta ni se usa; `src/components/tree.js` vacío.
- La carpeta completa **no está en git** (aparece como sin seguimiento), aunque en Brightspace la entrega de código figura como enviada.

**Falta prácticamente todo**
- [ ] Clases `Nodo` y `ArbolABB` (insertar, buscar, eliminar con los 3 casos, recorridos).
- [ ] Directorio raíz inicial y todas las validaciones/restricciones.
- [ ] Interfaz (menú/consola o GUI) con el árbol dibujado, búsqueda, información y eliminación.
- [ ] Documentación y UML.
- [ ] Hacer commit de la carpeta (sin `node_modules`).
- Nota: `react-scripts` (CRA) está descontinuado; si se mantiene web, conviene Vite como en `cola-impresion`.
