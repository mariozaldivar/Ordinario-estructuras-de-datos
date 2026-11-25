# Proyecto 6 — Ruta mágica (Grafos)

> Fuente: `brightspace/6. Proyecto Grafos - Ruta magica.pdf`
> Rúbricas y guía de documentación: `brightspace/`
> Entregas: "6. Ruta mágica - Codigo" y "6. Ruta mágica - Documentación" (**la documentación vence el 21/11/2026 23:59**).

## Objetivo
Calcular la **ruta más corta** entre Pueblos Mágicos de **un estado** de México, modelados como **grafo ponderado**, usando uno de los algoritmos clásicos de caminos mínimos.

## Modelo
- **Vértices**: los Pueblos Mágicos del estado elegido (cada estado tiene entre 2 y 12).
- **Aristas**: carreteras directas entre dos pueblos.
- **Pesos**: distancia en **km**.
- **No dirigido** (A→B implica B→A) salvo que se justifique lo contrario.
- **Datos reales**: investigar los pueblos del estado elegido y las distancias por carretera (Google Maps o fuentes oficiales).

## Algoritmo (elegir uno y **justificar la elección** en la documentación)
| Algoritmo | Tipo | Pesos negativos | Nota |
|-----------|------|-----------------|------|
| Dijkstra | Origen único | No | Cola de prioridad; eficiente en grafos dispersos con pesos positivos (lo más natural aquí) |
| Floyd-Warshall | Todos los pares | Sí (sin ciclos negativos) | Programación dinámica, matriz V×V |
| Bellman-Ford | Origen único | Sí | Relaja aristas V−1 veces; más lento |

## Representación (elegir una)
- **Lista de adyacencia** (`dict` de listas en Python, `HashMap<String, List<Edge>>` en Java, o equivalente). Recomendada.
- **Matriz de adyacencia** `double[][]` con `∞` si no hay conexión.

**Opcional:** leer el grafo de un archivo de texto con formato:
```
# Pueblos Magicos de Puebla -- Distancias en km
Zacatlan Chignahuapan 22
Zacatlan Tetela_de_Ocampo 48
...
```

## Requerimientos funcionales
| ID | Requerimiento | Entrada | Salida |
|----|---------------|---------|--------|
| R1 | Cargar el grafo del estado (código o archivo) | Datos/archivo | Grafo en memoria |
| R2 | Listar los Pueblos Mágicos numerados | — | Lista 1..N |
| R3 | Elegir **origen** (validar rango) | Número | "-> Origen: X" |
| R4 | Elegir **destino** (validar rango) | Número | "-> Destino: Y" |
| R5 | Calcular la ruta más corta con el algoritmo elegido e indicar cuál se usa | Origen, destino | Ruta |
| R6 | Mostrar cada tramo con su distancia, la ruta completa y la **distancia total** | — | Ver ejemplo |
| R7 | Preguntar si se desea consultar otra ruta (S/N) | S/N | Repite o termina |
| R8 | Manejar el caso sin ruta / origen = destino | — | Mensaje claro |

### Salida esperada (del PDF, Puebla – Sierra Norte)
```
Algoritmo utilizado: Dijkstra
[OK] RUTA ENCONTRADA
  Xicotepec --(115 km)--> Cuetzalan
  Cuetzalan --( 38 km)--> Tlatlauquitepec
  Ruta completa: Xicotepec -> Cuetzalan -> Tlatlauquitepec
  Distancia total: 153 km
```

### Grafo de ejemplo (Puebla) — sirve para pruebas, pero se debe usar el estado elegido con datos investigados
|     | ZAC | CHI | TET | CUE | TLA | XIC | PAH |
|-----|-----|-----|-----|-----|-----|-----|-----|
| ZAC | 0 | 22 | 48 | ∞ | ∞ | 55 | 60 |
| CHI | 22 | 0 | 42 | ∞ | 90 | ∞ | ∞ |
| TET | 48 | 42 | 0 | 68 | ∞ | ∞ | ∞ |
| CUE | ∞ | ∞ | 68 | 0 | 38 | 115 | ∞ |
| TLA | ∞ | 90 | ∞ | 38 | 0 | ∞ | ∞ |
| XIC | 55 | ∞ | ∞ | 115 | ∞ | 0 | 32 |
| PAH | 60 | ∞ | ∞ | ∞ | ∞ | 32 | 0 |

Casos de prueba verificados a mano con esta matriz (útiles para la fase de Pruebas):
- XIC → TLA = **153 km** (XIC–CUE–TLA; la alternativa XIC–ZAC–CHI–TLA da 167).
- PAH → TLA = **172 km** (PAH–ZAC–CHI–TLA; PAH–XIC–CUE–TLA da 185 y PAH–ZAC–TET–CUE–TLA da 214).

## Entregables (rúbricas)
- Código: POO (p. ej. `Grafo`, `Arista`, `Dijkstra`/`RutaMagica`, menú), comentarios, buenas prácticas, uso correcto del **grafo**, sin errores, en GitHub.
- Documentación de 5 fases con capturas de cada requerimiento + **justificación del algoritmo** + fuentes de las distancias.

## Estado actual
- [ ] **No existe código.** Esta carpeta solo contiene el material de Brightspace.
- En Brightspace la entrega de "Código" aparece como enviada, pero no hay código en el repo; verificar qué se envió.
- [ ] Elegir estado e investigar pueblos y distancias.
- [ ] Implementar grafo + algoritmo + menú.
- [ ] Documentación (vence 21/11/2026).
