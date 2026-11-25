"""
Calculate equivalent resistances and IEC 60062:2016 color combinations of four band resistors in electrical circuits.
Copyright (C) 2026 Alejandro Cervera Castillo

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, see <https://www.gnu.org/licenses/>
"""

from math import log10


class Circuit:
    """
    Representation of an electrical circuit.

    Attributes:
        type -- Must be 'series' or parallel'.
        resistors -- Collection of resistors.
        equivalent_resistance: Self-explanatory.
    """

    def _check_circuit_type(self):
        valid_types: tuple[str] = ("series", "parallel")

        if self.type not in valid_types:
            raise ValueError(
                f"The circuit type {self.type!r} is not valid, it must be 'series' or 'parallel"
            )

    def _check_resistors(self):
        if not (isinstance(self.resistors, list)):
            raise TypeError(
                "Expected a list of Resistor objects, got something else"
            )

        zero_values: int = 0

        for resistor in self.resistors:
            if not isinstance(resistor, Resistor):
                raise TypeError(
                    f"The object {resistor!r} is not an instance of the Resistor class"
                )

            if resistor.magnitude == 0:
                zero_values += 1

        if self.type == "parallel" and zero_values == len(self.resistors):
            raise ValueError(
                "All resistor values are zero, there must be at least one resistor with a non-zero value in a parallel circuit"
            )

    def _reciprocal_resistance(self, resistance: float) -> float:

        if resistance == 0:
            raise ValueError(
                "There is no reciprocal for a resistance of 0 ohms"
            )

        return 1 / resistance

    def _totalize_resistances(self) -> float:
        """Return the equivalent resistance of the circuit."""
        equivalent_resistance: float

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

        return equivalent_resistance

    def add_resistor(self, resistor):

        if not isinstance(resistor, Resistor):
            raise TypeError("Expected a Resistor object, got something else")

        if self.resistors is None:
            self.resistors = [resistor]
        else:
            self.resistors.append(resistor)

        self._check_resistors()

        self.equivalent_resistance = self._totalize_resistances()

    def __init__(self, type: str, resistors: list | None = None):
        self.type = type
        self.resistors = resistors

        self._check_circuit_type()

        if self.resistors is not None:
            self._check_resistors()
            self.equivalent_resistance = self._totalize_resistances()
        else:
            self.equivalent_resistance = 0


class BandColor:
    """
    Representation of an IEC-60062:2016 resistor band color.

    Attributes:
        name -- Lowercase IEC-60062:2016 band color name.
    """

    def _check_name(self) -> bool:
        valid_names: str = [
            "black",
            "brown",
            "red",
            "orange",
            "yellow",
            "green",
            "blue",
            "violet",
            "grey",
            "white",
        ]

        if self.name not in valid_names:
            raise ValueError(
                f"The band color name {self.name!r} is not valid, it must be "
                "a lowercased color name defined by IEC-60062:2016 (e.g., 'black')"
            )

    def __init__(self, name: str):
        self.name = name

        self._check_name()

        match self.name:
            case "black":
                significant_numeral, multiplier = 0, 10**0

            case "brown":
                significant_numeral, multiplier = 1, 10**1

            case "red":
                significant_numeral, multiplier = 2, 10**2

            case "orange":
                significant_numeral, multiplier = 3, 10**3

            case "yellow":
                significant_numeral, multiplier = 4, 10**4

            case "green":
                significant_numeral, multiplier = 5, 10**5

            case "blue":
                significant_numeral, multiplier = 6, 10**6

            case "violet":
                significant_numeral, multiplier = 7, 10**7

            case "grey":
                significant_numeral, multiplier = 8, 10**8

            case "white":
                significant_numeral, multiplier = 9, 10**9

        self.significant_numeral = significant_numeral
        self.multiplier = multiplier

    def __repr__(self):
        return self.name.title()

    def __eq__(self, other):
        return self.name == other.name


class Resistor:
    """
    Representation of a four band resistor.

    Attributes:
        magnitude    -- Resistance (in ohms).
        label        -- Human readable string identifying the resistor (by default: 'Resistor').
        circuit      -- Circuit with the resistor (by default: None).

    Public methods:
        to_band_colors()

            Return the color names in an IEC-60062:2016 band color
            combination exactly or approximately equal to the magnitude
            of the resistor.

    Limitations:
        * Conversion from magnitude to band colors is not supported for
        for resistances below 10 ohms nor resistances with decimal
        points.
    """

    def _check_magnitude(self):
        """Check minimal type and value requirements for instantiation."""
        if not (isinstance(self.magnitude, (int, float))):
            raise TypeError(
                f"The resistor magnitude {self.magnitude!r} is invalid, use a 'float' or 'int'"
            )

        if self.magnitude < 0:
            raise ValueError(
                f"The resistor magnitude {self.magnitude!r} is invalid, use a positive integer"
            )

    def __init__(
        self,
        magnitude: float,
        label: str = "Resistor",
        circuit: Circuit | None = None,
    ):
        self.magnitude = magnitude
        self.label = label
        self.circuit = circuit

        self._check_magnitude()

    def __repr__(self) -> str:
        """Return a human-readable string representing the resistor."""
        if self.magnitude > 1:
            return f"{self.label}: {self.magnitude} ohms"

        return f"{self.label}: {self.magnitude} ohms"

    def to_band_colors(self) -> list[BandColor]:
        """Return an equal or approximate IEC-60062:2016 band color combinaton."""
        if self.magnitude != round(self.magnitude):
            raise ValueError(
                "Conversion from magnitude to band colors is not supported for resistances with decimal points"
            )

        if self.magnitude < 10:
            raise ValueError(
                "Conversion from magnitude to band colors is not supported for resistances below 10 ohms"
            )

        colors = [
            BandColor("black"),
            BandColor("brown"),
            BandColor("red"),
            BandColor("orange"),
            BandColor("yellow"),
            BandColor("green"),
            BandColor("blue"),
            BandColor("violet"),
            BandColor("grey"),
            BandColor("white"),
        ]

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
