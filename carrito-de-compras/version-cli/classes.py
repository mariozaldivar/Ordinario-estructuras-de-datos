from dataclasses import dataclass


@dataclass
class Product:
    id: int
    name: str
    category: str
    price: int


class CatalogueEntry(list):
    def __init__(
        self,
        product: Product,
    ):
        entry = [product.id, product.name, product.category, product.price]

        super().__init__(entry)


class CartEntry(list):
    def __init__(
        self,
        product: Product,
        quantity: int,
    ):
        self.id = product.id
        self.name = product.name
        self.price = product.price
        self.quantity = quantity
        self.subtotal = product.price * quantity

        entry = [
            self.id,
            self.name,
            self.price,
            self.quantity,
            self.subtotal,
        ]

        super().__init__(entry)


class Catalogue(list):
    def __init__(self, products: list[Product] | None = None):
        if products is None:
            catalogue = [
                Product(id=1, name="Teclado", category="Accesorios", price=450),
                Product(id=2, name="Mouse", category="Accesorios", price=250),
                Product(id=3, name="Monitor", category="Electrónicos", price=3200),
                Product(id=4, name="Audífonos", category="Audio", price=800),
                Product(
                    id=5,
                    name="Memoria USB",
                    category="Almacenamiento",
                    price=180,
                ),
            ]
        else:
            catalogue = [products]

        super().__init__(catalogue)

    def search_product(self, id: int) -> Product:

        match = None

        for product in self:
            if product.id == id:
                match = product
                break

        if match is None:
            raise KeyError(f"No hay ningún producto con el identificador {id}")

        return match


class Cart(list):
    def __init__(self):
        super().__init__([])

    def add_product(self, product: Product, quantity: int):

        entry = CartEntry(product, quantity)

        self.append(entry)

    def remove_product(self, id: int):
        for entry in self:
            if entry.id == id:
                self.remove(entry)

    def search_entries(self, id: int) -> CartEntry:
        match = None

        for entry in self:
            if entry.id == id:
                match = entry
                break

        if match is None:
            raise KeyError(f"No hay ningún producto con el identificador {id}")

        return match

    def empty(self):
        self.clear()
