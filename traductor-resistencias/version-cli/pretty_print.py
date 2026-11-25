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

from sys import stdout

from classes import Circuit, Resistor


def generate_header(word: str):
    """Return a word in an ASCII art box."""
    if len(word) == 0:
        raise ValueError

    header_box_line: str = "+" + "-" * len(word) + "+"

    header: str = (
        header_box_line + "\n" + "|" + word + "|" + "\n" + header_box_line
    )

    return header


def pretty_print_circuit_information_header(
    word: str, leading_newlines: int = 0, trailing_newlines: int = 0
) -> None:

    header: str = generate_header(word)

    print("\n" * leading_newlines + header, end="\n" * trailing_newlines)


def pretty_print_circuit_resistors(
    circuit: Circuit, trailing_newlines: int = 0
):
    resistors: list[Resistor] = circuit.resistors

    print("- Resistors:")

    resistor_number: int = 1

    for resistor in resistors:
        try:
            color_combination = resistor.to_band_colors()
        except ValueError:
            print(f"  {resistor_number}. {resistor!r} = ?")
        else:
            print(f"  {resistor_number}. {resistor!r} = {color_combination}")

        resistor_number += 1

    if trailing_newlines != 0:
        stdout.write("\n" * trailing_newlines)


def pretty_print_circuit_equivalent_resistance(
    circuit: Circuit, decimal_digits: int, trailing_newlines: int = 0
) -> None:
    equivalent_resistance = circuit.equivalent_resistance

    if equivalent_resistance.is_integer():
        print(f"- Equivalent resistance: {int(equivalent_resistance)} ohms")
    else:
        print(
            f"- Equivalent resistance: {
                round(equivalent_resistance, decimal_digits)
            } ohms"
        )

    if trailing_newlines != 0:
        stdout.write("\n" * trailing_newlines)


def print_output_format_note() -> None:

    print(
        "NOTE: An interrogation sign next to a resistor value means it "
        "could not be represented as an IEC 60062:2016 color combination."
    )


def pretty_print_circuit_information(
    circuit: Circuit,
    header_word: str = "Information",
    decimal_digits: int = 3,
) -> None:
    """Write formatted circuit information to the console.

    Arguments:
        circuit -- A Circuit object.

        header_word -- A human-readable word for the formatted output header.

        decimal_digits -- Amount of decimal digits to show for the equivalent
                          resistance of circuit.
    """
    pretty_print_circuit_information_header(
        header_word, leading_newlines=1, trailing_newlines=2
    )

    print(f"- Circuit type: {circuit.type.title()}", end="\n\n")

    pretty_print_circuit_resistors(circuit, trailing_newlines=1)

    pretty_print_circuit_equivalent_resistance(
        circuit, decimal_digits, trailing_newlines=1
    )

    print_output_format_note()
