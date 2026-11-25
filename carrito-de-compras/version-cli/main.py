from rich.console import Console

from sys import stderr

from classes import Cart, Catalogue, CartEntry

from pretty_print import (
    show_main_menu,
    show_product_catalogue,
    show_catalogue_product,
    show_cart,
)

from user_input import (
    read_menu_option,
    read_product_search_id,
    read_product_quantity,
    ask_user_confirmation,
    is_confirmation_prompt_reply_affirmative,
)


def main() -> int:

    cart: Cart = Cart()
    console: Console = Console()
    catalogue: Catalogue = Catalogue()

    menu_option: int

    while True:
        show_main_menu(trailing_newlines=1)

        menu_option = read_menu_option(trailing_newlines=1)

        match menu_option:
            case 1:
                show_product_catalogue(catalogue, console, trailing_newlines=1)
            case 2:
                search_id = read_product_search_id(trailing_newlines=1)

                show_catalogue_product(
                    search_id, catalogue, console, trailing_newlines=1
                )
            case 3:
                search_id = read_product_search_id(trailing_newlines=1)

                match = catalogue.search_product(search_id)

                print(f"Producto: {match.name}", end="\n\n")

                print(f"Precio unitario: {match.price}", end="\n\n")

                quantity = int(input("Cantidad: "))

                cart.add_product(match, quantity)

                print("¡Producto agregado al carrito!", end="\n\n")
            case 4:
                show_cart(cart, console, trailing_newlines=1)
            case 5:
                search_id = read_product_search_id(trailing_newlines=1)

                try:
                    entry = cart.search_entries(search_id)
                except KeyError as e:
                    print(e.args[0], file=stderr, end="\n\n")
                    continue

                entry_index = cart.index(entry)

                print(f"Producto: {entry.name}", end="\n\n")
                print(f"Cantidad actual: {entry.quantity}", end="\n\n")

                new_quantity = read_product_quantity("Nueva cantidad: ")

                try:
                    match = catalogue.search_product(search_id)
                except KeyError as e:
                    print(e.args[0], file=stderr, end="\n\n")
                    continue

                cart[entry_index] = CartEntry(match, new_quantity)

            case 6:
                search_id = read_product_search_id(trailing_newlines=1)

                try:
                    match = cart.search_entries(search_id)
                except KeyError as e:
                    print(e.args[0], file=stderr, end="\n\n")
                    continue

                print(f"Producto: {match.name}", end="\n\n")

                reply = ask_user_confirmation()

                if is_confirmation_prompt_reply_affirmative(reply):
                    cart.remove_product(search_id)
                    print("¡Producto eliminado del carrito!", end="\n\n")

            case 7:
                reply = ask_user_confirmation(
                    "¿Está seguro que desea vacíar el carrito?"
                )

                if is_confirmation_prompt_reply_affirmative(reply):
                    cart.empty()
                    print("¡Carrito vaciado!", end="\n\n")

            case 8:
                show_cart(cart, console, trailing_newlines=1)

                items, products, total = 0, 0, 0

                for entry in cart:
                    items += entry.quantity
                    products += 1
                    total += entry.subtotal

                print(f"Productos: {products}")
                print(f"Artículos: {items}")

            case 9:
                break

    return 0


if __name__ == "__main__":
    main()
