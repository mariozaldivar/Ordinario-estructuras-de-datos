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

import sys

from classes import Circuit, Resistor


def read_user_input() -> Circuit:

    while True:
        try:
            circuit_type: str = input("Enter the circuit type [series/parallel] ")

            circuit = Circuit(type=circuit_type)
            break

        except ValueError as e:
            print(f"\nERROR: {e}", file=sys.stderr, end="\n\n")
            continue

        except EOFError:
            print(
                "\n\nERROR: No circuit type was specified, please try "
                "again or press 'Ctrl + C' to exit",
                end="\n\n",
                file=sys.stderr,
            )
            continue

    print(
        "\nEnter the values of each resistor (one per line) and press "
        "'Ctrl + D' to stop reading values: ",
        end="\n\n",
    )

    print("NOTE: Values are interpreted in ohms.", end="\n\n")

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

        try:
            resistor = Resistor(input_value)
        except ValueError as e:
            print(f"\nERROR: {e}", file=sys.stderr, end="\n\n")
            continue
            break

        circuit.add_resistor(resistor)

    return circuit
