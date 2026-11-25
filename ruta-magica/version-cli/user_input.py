from os import linesep
from sys import stdout

from pretty_print import print_command_error


def prompt_input_locations(vertices_names: list[str], trailing_newlines: int = 0):

    while True:
        origin_name = input("Nombre del punto de origen: ")

        if origin_name in vertices_names:
            break
        else:
            print_command_error(
                f"El destino {origin_name!r} es inválido, reintente ingresando un nombre con la primera letra mayúscula y con acentos\n",
            )
            continue

    while True:
        destination_name = input("Nombre del punto de destino: ")

        if destination_name in vertices_names:
            break
        else:
            print_command_error(
                f"\nEl destino {destination_name!r} is inválido, reintente ingresando un nombre con la segunda letra mayúscula y con acentos\n",
            )
            continue

    if trailing_newlines != 0:
        stdout.write(linesep * trailing_newlines)

    return origin_name, destination_name
