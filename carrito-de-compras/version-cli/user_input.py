from os import linesep
from sys import stderr, stdout


def read_product_quantity(prompt: str | None = None) -> int:

    if prompt is not None:
        prompt = "Cantidad: "

    while True:
        try:
            quantity = int(input(prompt))
        except ValueError:
            print(
                "La cantidad del producto debe ser al menos un número entero, intente de nuevo",
                file=stderr,
                end="\n\n",
            )
            continue

        if quantity > 0:
            break
        else:
            print(
                "La cantidad del producto debe ser un entero positivo, intente de nuevo",
                file=stderr,
                end="\n\n",
            )
            continue

    return quantity


def read_product_search_id(trailing_newlines: int = 0) -> int:

    first_catalogue_number: int = 1
    last_catalogue_number: int = 5

    while True:
        try:
            search_id = int(input("Ingrese el ID de un producto: "))
        except ValueError:
            print(
                "\nEl ID del producto debe ser un entero positivo, intente de nuevo",
                file=stderr,
                end="\n\n",
            )
            continue

        if search_id in range(first_catalogue_number, last_catalogue_number + 1):
            break
        else:
            print(
                f"\nEl ID del producto debe ser un entero positivo entre {first_catalogue_number} y {last_catalogue_number}, intente de nuevo",
                file=stderr,
                end="\n\n",
            )
            continue

    if trailing_newlines != 0:
        stdout.write(linesep * trailing_newlines)

    return search_id


def read_menu_option(trailing_newlines: int = 0) -> str:

    first_option_number: int = 1
    last_option_number: int = 9

    while True:
        try:
            option = int(input("Seleccione una opción: "))
        except ValueError:
            print(
                f"\nLa opción ingresada no es válida, intente de nuevo ingresando un entero positivo entre {first_option_number} y {last_option_number}",
                end="\n\n",
                file=stderr,
            )
            continue

        if option in range(1, last_option_number + 1):
            break
        else:
            print(
                f"\nLa opción ingresa no es válida, intente de nuevo ingresando un entero positivo entre {first_option_number} y {last_option_number}",
                end="\n\n",
                file=stderr,
            )
            continue

    if trailing_newlines != 0:
        stdout.write(linesep * trailing_newlines)

    return option


def ask_user_confirmation(prompt: str | None = None) -> str:

    if prompt is None:
        prompt = "¿Está seguro que desea eliminar el producto?"

    reply = input(f"{prompt} [(s)í/(n)o] ")

    return reply


def is_confirmation_prompt_reply_affirmative(reply: str) -> bool:

    return reply.lower() in ("s", "si", "sí", "y", "yes")
