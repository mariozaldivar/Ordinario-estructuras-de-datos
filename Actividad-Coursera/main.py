import re

from classes import ArbolBinario


def main() -> int:
    texto = input("Escribe una línea de texto: ")

    # Dividir en palabras: solo letras (quita signos y números), en minúsculas
    # para que "Hola" y "hola" se consideren la misma palabra.
    palabras = re.findall(r"[^\W\d_]+", texto.lower())

    if not palabras:
        print("No se encontraron palabras en el texto.")
        return 1

    arbol = ArbolBinario()
    for palabra in palabras:
        arbol.insertar(palabra)

    print("\n--- Recorridos ---")
    print("Inorden:  ", " ".join(arbol.recorrer(algoritmo="in")))
    print("Preorden: ", " ".join(arbol.recorrer(algoritmo="pre")))
    print("Postorden:", " ".join(arbol.recorrer(algoritmo="post")))

    print("\n--- Estadísticas ---")
    print("Número total de nodos:   ", arbol.contar_nodos())
    print("Número de nodos internos:", arbol.contar_internos())
    print("Palabra con máximo valor alfabético:", arbol.maximo())

    print("\n--- Información de los nodos ---")
    print("Hojas:   ", ", ".join(arbol.obtener_hojas()))
    internos = arbol.obtener_internos()
    print("Internos:", ", ".join(internos) if internos else "(ninguno)", end="\n\n")
    
    print(arbol)

    return 0


if __name__ == "__main__":
    main()