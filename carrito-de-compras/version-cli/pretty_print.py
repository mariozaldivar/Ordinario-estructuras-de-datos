from os import linesep
from sys import stdout, stderr

from classes import CatalogueEntry

from rich.table import Table
from rich.console import Console


def check_menu_options(options: list[str]) -> None:

    if not isinstance(options, list):
        raise ValueError(
            "Expected a list of strings for the menu options, got something else"
        )

    for option in options:
        if not isinstance(option, str):
            raise ValueError(
                "Expected a string for each menu option, got something else"
            )

    if len(options) != 9:
        raise ValueError("Expected nine menu options, got something else")


def show_main_menu(
    options: list[str] | None = None, trailing_newlines: int = 0
) -> None:

    if options is None:
        options = [
            "Mostrar catálogo",
            "Buscar producto",
            "Agregar producto al carrito",
            "Ver carrito",
            "Modificar cantidad",
            "Eliminar producto",
            "Vaciar carrito",
            "Finalizar compra",
            "Salir",
        ]

    print("=== CARRITO DE COMPRAS ===", end="\n\n")

    check_menu_options(options)

    for number, option in enumerate(options, start=1):
        print(f"{number}. {option}")

    if trailing_newlines != 0:
        stdout.write(linesep * trailing_newlines)


def show_product_catalogue(
    catalogue: Catalogue, console: Console, trailing_newlines: int = 0
) -> None:

    table = Table(title="Catálogo de productos")

    table.add_column("ID")
    table.add_column("Producto")
    table.add_column("Categoría")
    table.add_column("Precio")

    for product in catalogue:
        entry = CatalogueEntry(product)

        table.add_row(*list(map(str, entry)))

    console.print(table)

    if trailing_newlines != 0:
        stdout.write(linesep * trailing_newlines)


def show_catalogue_product(
    id: int,
    catalogue: Catalogue,
    console: Console,
    trailing_newlines: int = 0,
):

    try:
        match = catalogue.search_product(id)
    except KeyError as e:
        print(e, file=stderr)

    table = Table(title="Producto encontrado")

    table.add_column("ID")
    table.add_column("Producto")
    table.add_column("Categoría")
    table.add_column("Precio")

    entry = CatalogueEntry(match)

    table.add_row(*map(str, entry))

    console.print(table)

    if trailing_newlines != 0:
        stdout.write(linesep * trailing_newlines)


def show_cart(cart: Cart, console: Console, trailing_newlines: int = 0) -> None:

    table = Table(title="Carrito de compras")

    table.add_column("ID")
    table.add_column("Producto")
    table.add_column("Precio")
    table.add_column("Cantidad")
    table.add_column("Subtotal")

    total: int = 0

    for entry in cart:
        table.add_row(*map(str, entry))
        total += entry.subtotal

    console.print(table)

    print(f"\nTotal: {total}")

    if trailing_newlines != 0:
        stdout.write(linesep * trailing_newlines)
