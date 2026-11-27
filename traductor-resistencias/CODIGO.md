# Resistencia eléctrica — código documentado

Convierte el valor de una resistencia a sus bandas de colores (IEC 60062:2016) y guarda las resistencias de un circuito en un arreglo para calcular su equivalente en serie y en paralelo.

## Implementación original del equipo

Todo el programa fue escrito a mano por el equipo: la versión de consola en `version-cli/` (Python) y la versión web en `index.html`, `resistor.js` y `styles.css`.

### Colores de las bandas

> **Origen: equipo** — Cada color tiene una cifra significativa y un multiplicador (`version-cli/classes.py`).

```python
match self.name:
    case "black":
        significant_numeral, multiplier = 0, 10**0

    case "brown":
        significant_numeral, multiplier = 1, 10**1

    case "red":
        significant_numeral, multiplier = 2, 10**2
```

### Convertir la magnitud a colores

> **Origen: equipo** — Las dos primeras cifras son las bandas 1 y 2; la cantidad de cifras restantes da el multiplicador. El resultado es un arreglo de tamaño fijo.

```python
color_combination = [None, None, None]

first_band = int(str(self.magnitude)[0])
second_band = int(str(self.magnitude)[1])
multiplier = 10 ** len(str(int(self.magnitude))[2:])

if log10(multiplier) > 9:
    raise ValueError(
        f"The resistance '{self.magnitude}' is too big to be represented as an IEC-60062:2016 color combination"
    )

for color in colors:
    if color.significant_numeral == first_band:
        color_combination[0] = color

    if color.significant_numeral == second_band:
        color_combination[1] = color

    if color.multiplier == multiplier:
        color_combination[2] = color

return color_combination
```

### Resistencia equivalente

> **Origen: equipo** — Las resistencias del circuito se guardan en un arreglo. En serie se suman; en paralelo se suman los recíprocos y se invierte el resultado.

```python
resistances: list[float] = [
    resistor.magnitude for resistor in self.resistors
]

match self.type:
    case "series":
        equivalent_resistance = sum(resistances)

    case "parallel":
        equivalent_resistance = 1 / sum(
            map(self._reciprocal_resistance, resistances)
        )
```

### Agregar una resistencia al circuito

> **Origen: equipo** — Agrega al final del arreglo, valida y recalcula el equivalente.

```python
def add_resistor(self, resistor):

    if not isinstance(resistor, Resistor):
        raise TypeError("Expected a Resistor object, got something else")

    if self.resistors is None:
        self.resistors = [resistor]
    else:
        self.resistors.append(resistor)

    self._check_resistors()

    self.equivalent_resistance = self._totalize_resistances()
```

### Leer los valores en consola

> **Origen: equipo** — Lee una resistencia por línea hasta `Ctrl + D` y descarta los valores no numéricos (`version-cli/user_input.py`).

```python
while True:
    try:
        input_value = float(input())
    except ValueError:
        print(
            "\nERROR: Value is not numeric, try again",
            file=sys.stderr,
            end="\n\n",
        )
        continue

    except EOFError:
        print("Stopped reading values")
        break
```

### Bandas en la versión web

> **Origen: equipo** — `Resistor` de `resistor.js` llena el arreglo `valuesArray`: dos cifras, multiplicador y tolerancia. La cuarta banda es plateada si lo que se pierde al redondear supera el 5 %.

```js
setResistorValue(number) {
  this.value = number;

  let numberString = number.toString();
  if (numberString.length == 1) {
    this.valuesArray = [0, number, 0, 0];
  } else if (numberString.length >= 2) {
    let leftover = numberString.substring(2); // "cdef"
    if (parseFloat(leftover) > parseFloat(numberString) / 20) {
      this.valuesArray = [
        parseInt(numberString[0]),
        parseInt(numberString[1]),
        numberString.length - 2,
        1,
      ];
    } else {
      this.valuesArray = [
        parseInt(numberString[0]),
        parseInt(numberString[1]),
        numberString.length - 2,
        0,
      ];
    }
  } else {
    this.valuesArray = [0, 0, 0, 0];
  }
}
```

### Pintar el dibujo

> **Origen: equipo** — Colorea las franjas del SVG con el arreglo de valores; la última es dorada o plateada.

```js
colorStripes() {
  for (let i = 0; i < this.stripes.length - 1; i++) {
    this.stripes[i].style.fill = this.valorColores[this.valuesArray[i]];
  }
  if (this.valuesArray[this.stripes.length - 1] == 0) {
    this.stripes[this.stripes.length - 1].style.fill = "#c68401";
  } else {
    this.stripes[this.stripes.length - 1].style.fill = "#C0C0C0 ";
  }
}
```

### Circuito en la versión web

> **Origen: equipo** — `Circuito` guarda las resistencias en `resistorList` y calcula ambos equivalentes ignorando los valores no válidos.

```js
sumarEnSerie() {
  let sum = 0;
  this.resistorList.forEach((resistor) => {
    if (parseInt(resistor.value) <= 0) return;
    sum += (parseInt(resistor.value) || 0);
  });
  return sum;
}

sumarEnParalelo() {
  let sum = 0;
  this.resistorList.forEach((resistor) => {
    if (isNaN(parseFloat(resistor.value)) || parseFloat(resistor.value) <= 0) return;
    sum += (1 / (parseFloat(resistor.value)));
  });
  return sum > 0 ? 1 / sum : 0;
}
```

### Agregar al circuito y mostrar los totales

> **Origen: equipo** — El botón (o Enter) mueve la resistencia actual al circuito y actualiza los totales con tres decimales.

```js
botonAgregarACircuito.addEventListener("click", () => {
  circuit.agregarCurrentResistorACircuito();
  resistorValue.value = "";
  textoEnSerie.textContent = `Suma total de las resistencias de tu circuito en serie: ${circuit.sumarEnSerie().toFixed(3)}Ω`;
  textoParalelo.textContent = `Suma total de las resistencias de tu circuito en paralelo: ${circuit.sumarEnParalelo().toFixed(3)||0}Ω`;
});
```

## Generado con IA

El programa no tiene lógica generada con IA. Lo único agregado con inteligencia artificial es esta documentación: este archivo, el panel `visor/` y el botón que lo abre (marcado con `[IA]` en `index.html`).

### Botón "Ver código"

> **Origen: IA** — Abre este panel con la documentación del proyecto.

```html
<button type="button" class="ver-codigo" data-ver-codigo="CODIGO.md" data-titulo="Resistencia eléctrica">Ver código</button>
```
