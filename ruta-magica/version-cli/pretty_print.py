from os import linesep
from sys import stderr, stdout

from classes import Vertex
from rich.console import Console
from rich.table import Table


def print_command_error(message: str):
    if len(message) == 0:
        raise ValueError("El mensaje de error no puede una cadena de caracteres vacía")

    print(f"[ERROR]: {message}", file=stderr)


def pretty_print_route(route: list[str]):
    size = len(route)

    print("Mejor ruta: ", end="")

    for i in range(size):
        town = route[i]

        if i == size - 1:
            print(town)
        else:
            print(f"{town} -> ", end="")


def pretty_print_results(route: list[str], best_distance: int):

    pretty_print_route(route)
    print(f"Distancia: {best_distance} [km]")


def pretty_print_vertex_degrees(
    vertices: dict[str, Vertex], trailing_newlines: int = 0
):
    print("Grados de los vértices: ", end="\n\n")

    for name, vertex in vertices.items():
        print(f"Vértice {name!r}: {vertex.degree()}")

    if trailing_newlines != 0:
        stdout.write(linesep * trailing_newlines)


def pretty_print_adjacency_matrix(
    console: Console,
    adjacency_matrix: list[list],
    vertices_names: list[str],
    trailing_newlines: int = 0,
):

    table = Table(title="Matriz de adyacencia")

    table.add_column("")

    for vertex_name in vertices_names:
        table.add_column(vertex_name)

    for row_number, vertex_name in enumerate(vertices_names):
        table_row = [str(weight) for weight in adjacency_matrix[row_number]]
        table_row.insert(0, vertex_name)

        table.add_row(*table_row)

    console.print(table)

    if trailing_newlines != 0:
        stdout.write(linesep * trailing_newlines)
