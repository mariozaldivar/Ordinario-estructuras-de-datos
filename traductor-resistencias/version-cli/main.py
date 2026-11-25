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

from classes import Circuit
from pretty_print import pretty_print_circuit_information
from user_input import read_user_input


def main() -> int:

    circuit: Circuit = read_user_input()

    if circuit.resistors is None:
        print("\n\nNo resistor values were specified, exiting")
        return 0

    pretty_print_circuit_information(circuit)

    return 0


if __name__ == "__main__":
    main()
