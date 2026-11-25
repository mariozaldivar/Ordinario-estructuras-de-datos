# Proyecto 1 — Resistencia eléctrica (Arreglos)

> Fuente: `brightspace/1. Proyecto Arreglos - Resistencia Eléctrica.pdf`
> Rúbricas: `brightspace/Rúbrica PAIF - Código…pdf`, `brightspace/Rúbrica PAIF - Documentación…pdf`, guía `brightspace/Documentación del proyecto.pdf`
> Entregas en Brightspace: "1. Resistencia - Código" y "1. Resistencia - Documentación" (enlaces al repo y a la documentación).

## Objetivo
1. Determinar los **colores** de una resistencia a partir de su valor en ohmios.
2. Calcular la resistencia total de **n resistencias en serie y en paralelo**.

**Estructura de datos obligatoria:** arreglos.

## Tabla de colores (debe estar modelada en arreglos)

| Color    | 1.ª banda (dígito) | 2.ª banda (dígito) | 3.ª banda (multiplicador) | 4.ª banda (tolerancia) |
|----------|----|----|---------------|-----|
| Negro    | 0  | 0  | ×1            |     |
| Marrón   | 1  | 1  | ×10           |     |
| Rojo     | 2  | 2  | ×100          |     |
| Naranja  | 3  | 3  | ×1 000        |     |
| Amarillo | 4  | 4  | ×10 000       |     |
| Verde    | 5  | 5  | ×100 000      |     |
| Azul     | 6  | 6  | ×1 000 000    |     |
| Violeta  | 7  | 7  | ×10 000 000   |     |
| Gris     | 8  | 8  | ×100 000 000  |     |
| Blanco   | 9  | 9  | ×1 000 000 000|     |
| Dorado   |    |    | ×0.1          | 5%  |
| Plateado |    |    | ×0.01         | 10% |
| Ninguno  |    |    |               | 20% |

## Requerimientos funcionales
| ID | Requerimiento | Entrada | Salida |
|----|---------------|---------|--------|
| R1 | Valor → colores | Valor en Ω | Nombres de las bandas. Ej.: `160` → Marrón, Azul, Marrón; `5800` → Verde, Gris, Rojo |
| R2 | **Colores en modo gráfico** (obligatorio para la entrega de ordinario) | Valor en Ω | Dibujo de la resistencia con las bandas coloreadas |
| R3 | Suma en **serie** de n resistencias: `Rts = R1 + R2 + … + Rn` | `n` dado por el usuario | Total en Ω |
| R4 | Suma en **paralelo** de n resistencias: `1/Rtp = 1/R1 + … + 1/Rn` | `n` dado por el usuario | Total en Ω |
| R5 | Generación **aleatoria**: en R3/R4 cada resistor es un **entero aleatorio entre 10 y 1 000 000 000** | `n` | Lista de los n valores generados (guardados en un arreglo) |

Notas:
- El PDF escribe la fórmula de paralelo como `Rtp = 1/R1 + …`; lo correcto es `Rtp = 1 / (1/R1 + … + 1/Rn)`. Conviene aclararlo en la documentación.
- Validar entradas (no negativos, no vacío, `n ≥ 1`).

## Requerimientos no funcionales y entregables (rúbricas)
- POO: clases, atributos y métodos iguales al diagrama UML.
- Uso correcto de **arreglos** (la rúbrica lo califica explícitamente).
- Comentarios en clases y métodos, nombres descriptivos, indentación consistente, sin código muerto.
- Ejecuta sin errores; código en GitHub.
- Documentación con las 5 fases (Contextualización, Requerimientos R1…Rn con nombre/descr./entrada/salida, Diseño UML, Codificación, Pruebas con capturas por requerimiento), portada, referencias, buena ortografía.

## Estado actual (`index.html`, `resistor.js`, `styles.css`)
**Hecho**
- [x] R1/R2: convierte el valor a 3 bandas + tolerancia y colorea un SVG (`Resistor.setResistorValue`, `colorStripes`).
- [x] R3/R4: suma serie y paralelo (`Circuito.sumarEnSerie`, `sumarEnParalelo`) con la fórmula correcta.
- [x] Clases `Resistor` y `Circuito`; la lista de resistencias del circuito está en un arreglo.

**Falta / problemas**
- [ ] **R5: no hay generación aleatoria** de n resistencias (10 – 1e9) ni entrada de `n`; hoy el usuario agrega resistencias una por una a mano.
- [ ] No se muestran los **nombres** de los colores (solo el dibujo); R1 pide la salida en texto.
- [ ] La tabla de colores no cubre Dorado/Plateado como multiplicador (valores < 10 Ω o con decimales).
- [ ] Valores con más de 2 cifras significativas se truncan sin avisar (p. ej. 165 → 160); la 4.ª banda usa una heurística propia (`leftover > valor/20`) que no está en el enunciado. Documentarlo o mostrar la tolerancia.
- [ ] Bug: `key.preventDefault;` (falta `()`), así que el `-` no se bloquea.
- [ ] Se usa `alert()` para validar; mejor un mensaje en la página.
- [ ] Faltan comentarios en métodos y el diagrama UML / documentación (no hay documento en el repo).
