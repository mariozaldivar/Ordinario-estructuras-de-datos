# Ruta mágica — código documentado

Grafo no dirigido y ponderado de Pueblos Mágicos de Yucatán; ruta más corta con Dijkstra.

## Implementación original del equipo

Escrito a mano por el equipo en `version-cli/`. La versión web usa esta misma lógica, traducida en las secciones **[EQUIPO]** de `version-web/classes.js`, `pathfinding.js` y `app.js` (datos del grafo).

### Cargar el grafo

> **Origen: equipo** — Pueblos y distancias investigadas (`main.py`).

```python
graph: Graph = Graph(name="Pueblos", initial_vertex=city)

for magic_town in magic_towns:
    graph.insert_vertex(magic_town)

graph.insert_edge("Sisal", "Mérida", 54)
graph.insert_edge("Mérida", "Motul", 43)
graph.insert_edge("Motul", "Izamal", 38)
graph.insert_edge("Mérida", "Izamal", 71)
```

### Insertar arista

> **Origen: equipo** — Sin lazos ni aristas repetidas; se guarda en ambos vértices.

```python
if new_edge.is_loop():
    raise ValueError("No se puede añadir una arista con extremos iguales")

if end1.is_adjacent(end2):
    raise ValueError(
        "No se puede añadir una arista cuyos vértices son adyacentes"
    )

end1.insert_edge(new_edge)
end2.insert_edge(new_edge)
```

### Matriz de adyacencia

> **Origen: equipo** — 0 en la diagonal, peso si hay arista, infinito si no.

```python
for vertex in self.vertices.values():
    for incident_edge in vertex.incident_edges:
        end1 = incident_edge.end1
        end2 = incident_edge.end2

        index_end1 = self._find_vertex_index(end1)
        index_end2 = self._find_vertex_index(end2)

        matrix[index_end1][index_end2] = incident_edge.weight
        matrix[index_end2][index_end1] = incident_edge.weight
```

### Dijkstra

> **Origen: equipo** — Toma el vértice más cercano no visitado y relaja sus aristas.

```python
visited[candidate_index] = True

for column_number, weight in enumerate(adjacency_matrix[candidate_index]):
    if visited[column_number] or weight == infinity:
        continue

    traversal_distance = best_distances[candidate_index] + weight

    if traversal_distance < best_distances[column_number]:
        best_distances[column_number] = traversal_distance
        predecessors[column_number] = candidate_index
```

### Reconstruir la ruta

> **Origen: equipo** — Sigue los predecesores desde el destino hasta el origen.

```python
while current_index is not None:
    indices.append(current_index)
    current_index = predecessors[current_index]
```

## Generado con IA

Agregado con inteligencia artificial para la versión web: secciones **[IA]** de los scripts y los archivos `ui.js` y `styles.css` completos.

### Distancia de cada tramo

> **Origen: IA** — Divide la ruta del equipo en tramos para la línea de tiempo.

```js
function routeLegs(adjacencyMatrix, verticesNames, route) {
  const legs = [];

  for (let i = 0; i < route.length - 1; i++) {
    const fromIndex = verticesNames.indexOf(route[i]);
    const toIndex = verticesNames.indexOf(route[i + 1]);

    legs.push({ from: route[i], to: route[i + 1], distance: adjacencyMatrix[fromIndex][toIndex] });
  }

  return legs;
}
```

### Elegir origen y destino en el mapa

> **Origen: IA** — Primer clic: origen; segundo clic: destino y cálculo.

```js
function pickTown(name) {
  if (nextPick === "origen") {
    originField.value = name;
    nextPick = "destino";
    clearRoute();
    setHint("Ahora haz clic en el pueblo de ", "destino", ".");
  } else {
    destinationField.value = name;
    nextPick = "origen";
    setHint("Haz clic en un pueblo para elegir un nuevo ", "origen", ".");
    showRoute();
  }
  updateMarkers();
}
```

### Dibujar la ruta

> **Origen: IA** — Traza la ruta tramo por tramo sobre el mapa.

```js
routeLayer.append(
  createSvgElement("line", { class: "tramo", x1: start.x, y1: start.y, x2: end.x, y2: end.y, pathLength: 1 }),
);
await wait(LEG_DURATION);
```

### Origen igual a destino

> **Origen: IA** — Aviso en lugar de calcular.

```js
if (originName === destinationName) {
  clearRoute();
  showToast("El origen y el destino son el mismo lugar: la distancia es 0 km.", "info");
  return;
}
```
