class Nodo:
    def __init__(self, info: str, izq=None, der=None):
        if not isinstance(info, str) or info == "":
            raise ValueError("No se especificó una palabra (str no vacío) para el atributo 'info'")

        self.info = info
        self.contador = 1  # veces que apareció la palabra (manejo de duplicados)
        self.izq = izq
        self.der = der

    def es_hoja(self) -> bool:
        return self.izq is None and self.der is None

    def __repr__(self):
        return f"Nodo(info={self.info!r}, contador={self.contador}, izq={self.izq}, der={self.der})"


class ArbolBinario:
    def __init__(self, raiz: Nodo | None = None):

        if raiz is not None:
            if not isinstance(raiz, Nodo):
                raise ValueError("No se especificó un objeto 'Nodo' para la raíz del árbol")

        self.raiz = raiz

    def esta_vacio(self) -> bool:
        return self.raiz is None

    # ------------------------------------------------------------------
    # Inserción
    # ------------------------------------------------------------------
    def busca_nodo_padre(self, nodo_nuevo: Nodo, nodo_actual: Nodo) -> Nodo:
        """Baja por el árbol y devuelve el último nodo visitado.
        Si encuentra una palabra igual, se detiene en ese nodo (duplicado)."""
        nodo_padre = None

        while nodo_actual is not None:
            nodo_padre = nodo_actual

            if nodo_nuevo.info == nodo_actual.info:
                break
            elif nodo_nuevo.info < nodo_actual.info:
                nodo_actual = nodo_actual.izq
            else:
                nodo_actual = nodo_actual.der

        return nodo_padre

    def insertar(self, info: str) -> None:
        """
        Reglas:
        - Palabra alfabéticamente menor  -> subárbol izquierdo.
        - Palabra alfabéticamente mayor  -> subárbol derecho.
        - Palabra repetida               -> NO se crea otro nodo; se incrementa
          el contador del nodo existente (así el árbol no tiene claves repetidas
          y aun así se sabe cuántas veces apareció cada palabra).
        """
        nodo_nuevo = Nodo(info)

        if self.esta_vacio():
            self.raiz = nodo_nuevo
            return

        nodo_padre = self.busca_nodo_padre(nodo_nuevo, self.raiz)

        if nodo_nuevo.info == nodo_padre.info:
            nodo_padre.contador += 1
        elif nodo_nuevo.info < nodo_padre.info:
            nodo_padre.izq = nodo_nuevo
        else:
            nodo_padre.der = nodo_nuevo

    # ------------------------------------------------------------------
    # Recorridos (devuelven una lista con las palabras)
    # ------------------------------------------------------------------
    def preorden(self, nodo: Nodo | None, resultado: list | None = None) -> list:
        if resultado is None:
            resultado = []

        if nodo is not None:
            resultado.append(nodo.info)
            self.preorden(nodo.izq, resultado)
            self.preorden(nodo.der, resultado)

        return resultado

    def inorden(self, nodo: Nodo | None, resultado: list | None = None) -> list:
        if resultado is None:
            resultado = []

        if nodo is not None:
            self.inorden(nodo.izq, resultado)
            resultado.append(nodo.info)
            self.inorden(nodo.der, resultado)

        return resultado

    def postorden(self, nodo: Nodo | None, resultado: list | None = None) -> list:
        if resultado is None:
            resultado = []

        if nodo is not None:
            self.postorden(nodo.izq, resultado)
            self.postorden(nodo.der, resultado)
            resultado.append(nodo.info)

        return resultado

    def recorrer(self, nodo: Nodo | None = None, algoritmo: str = "pre") -> list:
        if nodo is None:
            nodo = self.raiz

        match algoritmo.lower():
            case "pre" | "preorden":
                return self.preorden(nodo)

            case "in" | "inorden":
                return self.inorden(nodo)

            case "post" | "postorden":
                return self.postorden(nodo)

            case _:
                raise ValueError(
                    f"El algoritmo de recorrido {algoritmo!r} no es válido, "
                    "se esperaba 'pre(orden)', 'in(orden)' o 'post(orden)'"
                )

    # ------------------------------------------------------------------
    # Estadísticas
    # ------------------------------------------------------------------
    def contar_nodos(self, nodo: Nodo | None = "raiz") -> int:
        if nodo == "raiz":
            nodo = self.raiz

        if nodo is None:
            return 0

        return 1 + self.contar_nodos(nodo.izq) + self.contar_nodos(nodo.der)

    def obtener_hojas(self, nodo: Nodo | None = "raiz", resultado: list | None = None) -> list:
        """Palabras de los nodos hoja (sin hijos), en orden alfabético."""
        if nodo == "raiz":
            nodo = self.raiz
        if resultado is None:
            resultado = []

        if nodo is not None:
            self.obtener_hojas(nodo.izq, resultado)
            if nodo.es_hoja():
                resultado.append(nodo.info)
            self.obtener_hojas(nodo.der, resultado)

        return resultado

    def obtener_internos(self, nodo: Nodo | None = "raiz", resultado: list | None = None) -> list:
        """Palabras de los nodos internos (con al menos un hijo), en orden alfabético.
        Nota: la raíz cuenta como interno siempre que tenga hijos."""
        if nodo == "raiz":
            nodo = self.raiz
        if resultado is None:
            resultado = []

        if nodo is not None:
            self.obtener_internos(nodo.izq, resultado)
            if not nodo.es_hoja():
                resultado.append(nodo.info)
            self.obtener_internos(nodo.der, resultado)

        return resultado

    def contar_internos(self) -> int:
        return len(self.obtener_internos())

    def maximo(self) -> str | None:
        """Palabra con el máximo valor alfabético: el nodo más a la derecha."""
        if self.esta_vacio():
            return None

        nodo = self.raiz
        while nodo.der is not None:
            nodo = nodo.der

        return nodo.info

    def __repr__(self):
        return f"ArbolBinario(raiz={self.raiz})"