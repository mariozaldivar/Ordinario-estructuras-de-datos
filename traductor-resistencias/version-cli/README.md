# Ordinario de Estructuras de Datos

Colección de proyectos para la evaluación final de la materia _Estructuras de Datos_.

## Proyectos

### Resistencia

Calculadora de resistencia equivalente y combinaciones de colores [IEC
60062:2016](https://en.wikipedia.org/wiki/Electronic_color_code#Color_band_system)
para resistores de cuatro bandas en circuito eléctrico.

#### Instalación

1. Descargue `Python` versión 3.14.7.

> [!TIP]
> Si desea ejecutar las pruebas de unidad incluidas, haga la siguiente:

2. [Cree un entorno virtual](https://docs.python.org/3/library/venv.html).
3. Entre al entorno virtual.
4. [Instale el paquete](https://pip.pypa.io/en/latest/cli/pip_install) [`pytest`](https://docs.pytest.org/en/latest) versión 9.1.1 a través de PIP.

#### Uso

1. Inicie el programa.

```shell
python3 ./main.py
```

2. Especifique el tipo de circuito eléctrico y los valores de las resistencias
   en cada mensaje de entrada.

```shell
Enter the circuit type [series/parallel] series

Enter the values of each resistor (one per line) and press 'Ctrl + D' to stop reading values:

NOTE: Values are interpreted in ohms.

20
10
30
40
Stopped reading values

+-----------+
|Information|
+-----------+

- Circuit type: Series

- Resistors:
  1. Resistor: 20.0 ohms = [Red, Black, Black]
  2. Resistor: 10.0 ohms = [Brown, Black, Black]
  3. Resistor: 30.0 ohms = [Orange, Black, Black]
  4. Resistor: 40.0 ohms = [Yellow, Black, Black]

- Equivalent resistance: 100 ohms

NOTE: An interrogation sign next to a resistor value means it could not be represented as an IEC 60062:2016 color combination.
```

### Limitaciones

- No se admiten resistencias con punto decimal ni menores a 10 ohms para conversión a colores.
- No se procesan resistencias con con multiplicadores (p. ej., _kilo_, _mega_, etc.).
