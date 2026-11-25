from os import linesep
from sys import stderr, stdout

from classes import BinaryTree, Node
from constants import DEFAULT_MENU_OPTIONS
from rich.console import Console
from rich.table import Table


def make_node_info_table(nodes: list[Node], title: str):

    table = Table(title=title)

    table.add_column("Nombre")
    table.add_column("Extensión")
    table.add_column("Tamaño")
    table.add_column("Tipo")

    for node in nodes:
        row = [
            node.name,
            "None" if node.extension is None else node.extension,
            str(node.size),
            node.file_type.replace("_", " ").capitalize(),
        ]

        table.add_row(*row)

    return table


def show_found_node_info(
    console: Console, found_node: Node, trailing_newlines: int = 0
):

    node_info_table = make_node_info_table(
        [found_node], "Información de nodo encontrado"
    )

    console.print(node_info_table)

    if trailing_newlines != 0:
        stdout.write(linesep * trailing_newlines)


def show_traversal_trajectory(
    console: Console, trajectory: list[Node], trailing_newlines: int = 0
):

    node_info_table = make_node_info_table(trajectory, "Trayectoria de recorrido")

    console.print(node_info_table)

    if trailing_newlines != 0:
        stdout.write(linesep * trailing_newlines)


def show_exit_message():
    print("Exiting...")


def show_main_menu(
    options: tuple[str] | None = None,
    trailing_newlines: int = 0,
):
    if options is None:
        options = DEFAULT_MENU_OPTIONS

    print("Binary tree filesystem", end="\n\n")

    for number, option in enumerate(options, start=1):
        print(f"{number}. {option}")

    if trailing_newlines != 0:
        stdout.write(linesep * trailing_newlines)


def prompt_menu_option(options: tuple[str] | None = None, trailing_newlines: int = 0):
    if options is None:
        options = DEFAULT_MENU_OPTIONS

    while True:
        try:
            selected_option = int(input("Choose an option: "))
        except ValueError:
            print(
                "A selected menu option must be numerical",
                file=stderr,
                end="\n\n",
            )
            continue

        if selected_option not in range(1, len(options) + 1):
            print(
                "The selected menu option is not within the valid range",
                file=stderr,
                end="\n\n",
            )
            continue

        break

    if trailing_newlines != 0:
        stdout.write(linesep * trailing_newlines)

    return selected_option


def is_affirmative_confirmation_prompt_answer(answer: str):

    return answer.lower() in ("sí", "si", "s")


def prompt_confirmation(message: str):

    if len(message) == 0:
        raise ValueError("Prompt message cannot be the empty string")

    answer: str = input(f"{message} [S(í)/N(o] ")

    return is_affirmative_confirmation_prompt_answer(answer)


def main():
    binary_tree: BinaryTree = BinaryTree()

    console: Console = Console()

    while True:
        show_main_menu(trailing_newlines=1)
        selected_option = prompt_menu_option(trailing_newlines=1)

        match selected_option:
            case 1:
                while True:
                    directory_name: str = input("Nombre del directorio: ")
                    print()

                    try:
                        new_node: Node = Node(
                            name=directory_name, file_type="directory"
                        )

                    except ValueError as e:
                        print(e.args[0], file=stderr, end="\n\n")
                        continue

                    try:
                        binary_tree.insert(new_node)
                        break

                    except ValueError as e:
                        print(e.args[0], file=stderr, end="\n\n")
                        continue

                print(
                    f"Directorio {directory_name!r} insertado correctamente en el árbol",
                    end="\n\n",
                )

                print("Árbol actualizado", end="\n\n")
                print(binary_tree, end="\n\n")

            case 2:
                while True:
                    file_name: str = input("Nombre: ")
                    extension: str = input("Extensión: ")
                    file_size: str = int(input("Tamaño (bytes): "))
                    print()

                    try:
                        new_node: Node = Node(
                            name=file_name,
                            file_type="file",
                            size=file_size,
                            extension=extension,
                        )

                    except ValueError as e:
                        print(e.args[0], file=stderr, end="\n\n")
                        continue

                    try:
                        binary_tree.insert(new_node)
                        break

                    except ValueError as e:
                        print(e.args[0], file=stderr, end="\n\n")
                        continue

                print(
                    f"Archivo {file_name!r} ({file_size} bytes) insertado correctamente en el árbol",
                    end="\n\n",
                )

                print("Árbol actualizado", end="\n\n")
                print(binary_tree, end="\n\n")

            case 3:
                while True:
                    file_name: str = input("Ingrese nombre: ")
                    print()

                    try:
                        found_node: Node = binary_tree.search(file_name)
                        break
                    except KeyError as e:
                        print(e.args[0], file=stderr, end="\n\n")
                        continue

                show_found_node_info(console, found_node, trailing_newlines=1)

            case 4:
                while True:
                    element_name: str = input("Nombre: ")
                    print()

                    try:
                        found_node: Node = binary_tree.search(element_name)

                    except KeyError as e:
                        print(e.args[0], file=stderr, end="\n\n")
                        continue

                    show_found_node_info(console, found_node, trailing_newlines=1)

                    if prompt_confirmation("¿Eliminar?"):
                        try:
                            binary_tree.delete(element_name)
                            break

                        except ValueError as e:
                            print(e.args[0], file=stderr, end="\n\n")
                            continue

                print("Árbol actualizado", end="\n\n")
                print(binary_tree, end="\n\n")

            case 5:
                trajectory = binary_tree.trajectorize_traversal(algorithm="in")

                show_traversal_trajectory(console, trajectory, trailing_newlines=1)

            case 6:
                trajectory = binary_tree.trajectorize_traversal(algorithm="pre")

                show_traversal_trajectory(console, trajectory, trailing_newlines=1)

            case 7:
                trajectory = binary_tree.trajectorize_traversal(algorithm="post")

                show_traversal_trajectory(console, trajectory, trailing_newlines=1)

            case 8:
                show_exit_message()
                break

    return 0


if __name__ == "__main__":
    main()
